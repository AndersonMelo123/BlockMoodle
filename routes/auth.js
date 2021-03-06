const pool = require('../dbconfig/dbconfig');
const poolUser = require('../dbconfig/dbconfig_user');
const sha256 = require('sha256');
var fs = require('fs');
var pdf = require("html-pdf");
var ejs = require("ejs");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (server) => {

  if (server === null) {
    throw new Error('server should be an express instance')
  }

  async function getUmAluno(email) {
    try {
      const results = await pool.query(`SELECT a.id, a.firstname, a.lastname, a.email, a.phone2, a.institution, a.timecreated FROM mdl_user as a WHERE a.email = '${email}';`);
      var jsonArray = JSON.parse(JSON.stringify(results[0]));
      const nota = await pool.query(`SELECT i.itemname,g.finalgrade FROM mdl_grade_items i INNER JOIN mdl_grade_grades g ON i.id=g.itemid WHERE i.courseid=5 AND g.userid = '${jsonArray[0].id}';`);
      const curso = await pool.query(`SELECT c.id, c.fullname, c.shortname, rs.timemodified FROM mdl_role_assignments rs INNER JOIN mdl_context e ON rs.contextid=e.id INNER JOIN  mdl_course c ON c.id = e.instanceid WHERE e.contextlevel=50 AND rs.roleid=5 AND rs.userid='${jsonArray[0].id}';`);

      results.push(nota[0]);
      results.push(curso[0]);

      return results;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async function getUser() {
    try {
      const results = await pool.query(`SELECT a.firstname, a.lastname, a.email, a.phone2, a.institution, a.timecreated FROM mdl_user as a`)
      return results[0];
    } catch (error) {
      console.error(error);
    }
  }

  async function getCurso() {
    try {
      const results = await pool.query(`SELECT c.id,c.shortname,c.fullname,c.startdate,c.enddate,ct.name AS category FROM mdl_course c INNER JOIN mdl_course_categories ct ON c.category=ct.id WHERE c.format != 'site'`)
      return results[0];
    } catch (error) {
      console.error(error);
    }
  }

  async function getNotas() {
    try {

      //SELECT u.id, u.firstname,u.lastname,u.email,u.username, g.finalgrade AS nota FROM mdl_course_modules cm INNER JOIN mdl_modules m ON m.id=cm.module INNER JOIN mdl_grade_items i ON i.itemmodule=m.name  INNER JOIN mdl_grade_grades g ON g.itemid=i.id INNER JOIN mdl_user u ON g.userid=u.id WHERE   i.itemtype='mod' AND cm.instance=i.iteminstance AND cm.id=2
      const results = await pool.query(`SELECT u.id, u.firstname, u.lastname FROM mdl_role_assignments rs INNER JOIN mdl_user u ON u.id=rs.userid INNER JOIN mdl_context e ON rs.contextid=e.id WHERE e.contextlevel=50 AND rs.roleid=5 AND e.instanceid=5`);
      const ativ = await pool.query('SELECT id, itemname, itemtype, gradetype, scaleid FROM mdl_grade_items WHERE courseid=5');
      const nota = await pool.query('SELECT g.id, g.itemid, g.userid, g.finalgrade FROM mdl_grade_grades g INNER JOIN mdl_grade_items i ON g.itemid=i.id WHERE i.courseid=5');

      results.push(ativ[0]);
      results.push(nota[0]);

      return results;
    } catch (error) {
      console.error(error);
    }
  }

  async function getAtividades() {
    try {
      const results = await pool.query(`SELECT q.id,q.name, q.timemodified,c.shortname FROM mdl_quiz q INNER JOIN mdl_course c ON q.course=c.id `)
      const forum = await pool.query(`SELECT f.id,f.name, f.timemodified,c.shortname FROM mdl_forum f INNER JOIN mdl_course c ON f.course=c.id `)
      const resource = await pool.query(`SELECT r.id,r.name, r.timemodified,c.shortname FROM mdl_resource r INNER JOIN mdl_course c ON r.course=c.id `)
      const choice = await pool.query(`SELECT h.id,h.name, h.timemodified,c.shortname FROM mdl_choice h INNER JOIN mdl_course c ON h.course=c.id `)
      const url = await pool.query(`SELECT u.id,u.name, u.timemodified,c.shortname FROM mdl_url u INNER JOIN mdl_course c ON u.course=c.id `)
      const glossary = await pool.query(`SELECT g.id,g.name, g.timemodified,c.shortname FROM mdl_glossary g INNER JOIN mdl_course c ON g.course=c.id `)
      const feedback = await pool.query(`SELECT b.id,b.name, b.timemodified,c.shortname FROM mdl_feedback b INNER JOIN mdl_course c ON b.course=c.id `)

      results.push(forum[0]);
      results.push(resource[0]);
      results.push(choice[0]);
      results.push(url[0]);
      results.push(glossary[0]);
      results.push(feedback[0]);


      //console.log('RESSSS', results);
      return results;
    } catch (error) {
      console.error(error);
    }
  }

  server.post('/auth/profile_aluno', async (req, resp) => {
    const email = req.body.email
    const results = await getUmAluno(email);

    var timestamp = new Date().getTime();
    var d = new Date(timestamp);
    var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    var data = d.getDate() + '/' + months[d.getMonth()] + '/' + d.getFullYear();
    var hora = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();;
    var options = { "border": { "top": "1.5cm", "right": "1.5cm", "bottom": "1.5cm", "left": "1.5cm" } };

    ejs.renderFile("B:/Documentos/GIT/BlockMoodle/modelos/rlt_notas_aluno.ejs", { data: data, hora: hora, notas: results }, (err, html) => {
      if (err) {
        console.log('err1', err);
        return err;
      } else {
        pdf.create(html, options).toFile("./arquivo_notas_aluno.pdf", (err, res) => {
          if (err) {
            console.log('err2', err);
            return err;
          } else {
            fs.readFile('./arquivo_notas_aluno.pdf', 'utf-8', function (err, dataresult) {
              if (err) {
                console.log('err3', err);
                return err;
              }
              const a = sha256(dataresult);
              return resp.json({ chave: a });
            });
          }
        });
      }
    });
  })

  server.get('/auth/profile', async (req, resp) => {
    const results = await getUser();
    var timestamp = new Date().getTime();
    var d = new Date(timestamp);
    var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    var data = d.getDate() + '/' + months[d.getMonth()] + '/' + d.getFullYear();
    var hora = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();;
    var options = { "border": { "top": "1.5cm", "right": "1.5cm", "bottom": "1.5cm", "left": "1.5cm" } };

    ejs.renderFile("B:/Documentos/GIT/BlockMoodle/modelos/rlt_users.ejs", { data: data, hora: hora, alunos: results }, (err, html) => {
      if (err) {
        console.log('err1', err);
      } else {
        pdf.create(html, options).toFile("./arquivo.pdf", (err, res) => {
          if (err) {
            console.log('err2', err);
          } else {
            fs.readFile('./arquivo.pdf', 'utf-8', function (err, dataresult) {
              if (err) {
                console.log('err3', err);
              }
              const a = sha256(dataresult);
              return resp.json({ chave: a });
            });
          }
        });
      }
    });
  })

  server.get('/auth/profile_cursos', async (req, resp) => {
    const results = await getCurso();
    var timestamp = new Date().getTime();
    var d = new Date(timestamp);
    var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    var data = d.getDate() + '/' + months[d.getMonth()] + '/' + d.getFullYear();
    var hora = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();;
    var options = { "border": { "top": "1.5cm", "right": "1.5cm", "bottom": "1.5cm", "left": "1.5cm" } };

    ejs.renderFile("B:/Documentos/GIT/BlockMoodle/modelos/rlt_cursos.ejs", { data: data, hora: hora, cursos: results }, (err, html) => {
      if (err) {
        console.log('err1', err);
      } else {
        pdf.create(html, options).toFile("./arquivo_curso.pdf", (err, res) => {
          if (err) {
            console.log('err2', err);
          } else {
            fs.readFile('./arquivo_curso.pdf', 'utf-8', function (err, dataresult) {
              if (err) {
                console.log('err3', err);
              }
              const a = sha256(dataresult);
              console.log(a);
              return resp.json({ chave: a });
            });
          }
        });
      }
    });
  })

  server.get('/auth/profile_notas', async (req, resp) => {
    const results = await getNotas();
    //console.log('RESSS ===>', results);
    var timestamp = new Date().getTime();
    var d = new Date(timestamp);
    var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    var data = d.getDate() + '/' + months[d.getMonth()] + '/' + d.getFullYear();
    var hora = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();;
    var options = { "border": { "top": "1.5cm", "right": "1.5cm", "bottom": "1.5cm", "left": "1.5cm" } };

    ejs.renderFile("B:/Documentos/GIT/BlockMoodle/modelos/rlt_notas.ejs", { data: data, hora: hora, result: results }, (err, html) => {
      if (err) {
        console.log('err1', err);
      } else {
        pdf.create(html, options).toFile("./arquivo_notas.pdf", (err, res) => {
          if (err) {
            console.log('err2', err);
          } else {
            fs.readFile('./arquivo_notas.pdf', 'utf-8', function (err, dataresult) {
              if (err) {
                console.log('err3', err);
              }
              const a = sha256(dataresult);
              return resp.json({ chave: a });
            });
          }
        });
      }
    });
  })

  server.get('/auth/profile_atividades', async (req, resp) => {
    const results = await getAtividades();
    var timestamp = new Date().getTime();
    var d = new Date(timestamp);
    var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    var data = d.getDate() + '/' + months[d.getMonth()] + '/' + d.getFullYear();
    var hora = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();;
    var options = { "border": { "top": "1.5cm", "right": "1.5cm", "bottom": "1.5cm", "left": "1.5cm" } };

    ejs.renderFile("B:/Documentos/GIT/BlockMoodle/modelos/rlt_atividades.ejs", { data: data, hora: hora, atividades: results }, (err, html) => {
      if (err) {
        console.log('err1', err);
      } else {
        pdf.create(html, options).toFile("./arquivo_atividades.pdf", (err, res) => {
          if (err) {
            console.log('err2', err);
          } else {
            fs.readFile('./arquivo_atividades.pdf', 'utf-8', function (err, dataresult) {
              if (err) {
                console.log('err3', err);
              }
              const a = sha256(dataresult);
              return resp.json({ chave: a });
            });
          }
        });
      }
    });
  })
  //*********************************************************************************************/
  server.post('/auth/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (email && password) {
      const results = await getUsuario(email)
      if (results[0][0]) {
        bcrypt.compare(password, results[0][0].password).then(function (response) {
          if (response == true) {
            if (results[0][0].tipo == 0) {
              req.session.loggedin = true
              req.session.email = email
              req.session.nome = results[0][0].name
              req.session.tipo = "Admin"
              return res.json(req.session)
            } else if (results[0][0].tipo == 1) {
              req.session.loggedin = true
              req.session.email = email
              req.session.nome = results[0][0].name
              req.session.tipo = "User"
              return res.json(req.session)
            }

          } else {
            return res.json({ message: 'Senha incorreta!' })
          }
        })
      } else {
        return res.json({ message: 'Usuário não encontrado!' })
      }
    } else {
      return res.json({ message: 'Por favor, informe email e senha!' })
    }
  })

  async function getUsuario(email) {
    try {
      const results = await poolUser.query(`SELECT * FROM users WHERE email='${email}';`)
      return results
    } catch (e) {
      console.error(e)
    }
  }
  //============================================================================================================
  server.post('/auth/signup', async (req, res) => {
    var name = req.body.name
    var address = req.body.address
    var email = req.body.email
    var password = req.body.password

    if (name && address && email && password) {
      bcrypt.hash(password, saltRounds).then(async function (hash) {
        const results = await addUser(name, address, email, hash)
        if (results && results.length > 0) {
          bcrypt.hash(email + hash, saltRounds).then(function (hash) {
            sendVerificationEmail(email, "http://" + req.headers.host + "/auth/verify?email=" + email + "&hash=" + hash)
          })
          return res.json({ email: email })
        } else {
          return res.json({ message: 'Email já cadastrado: ' + email })
        }
      })
    } else {
      return res.json({ message: 'Por favor, preencha todos os campos!' })
    }
  })

  async function addUser(name, address, email, password) {
    try {
      const results = await poolUser.query(`INSERT INTO users (name, address, email, password) VALUES ("${name}", "${address}","${email}", "${password}");`)
      return results
    } catch (e) {
      console.error(e)
    }
  }
  //==========================================================================================================
  server.get('/auth/signout', (req, res) => {
    if (req.session && req.session.loggedin) {
      req.session.destroy()
      res.redirect(`/`)
    }
  })

  server.get('/auth/session', (req, res) => {
    if (req.session) {
      return res.json(req.session)
    } else {
      return res.status(403)
    }
  })

  server.get('/auth/profile', async (req, res) => {
    if (req.session && req.session.loggedin) {
      const results = await getUsuario(req.session.email)
      if (results[0][0]) {
        return res.json({
          name: results[0][0].name || 'nome',
          address: results[0][0].address || 'endereço'
        })
      } else {
        return res.status(500)
      }
    } else {
      return res.status(403)
    }
  })

  //=========================================================================
  const fileWorker = require('../controllers/file.controller');
  const uploadFolder = 'B:/Documentos/GIT/BlockMoodle/';

  server.get('/api/files/getall', async (req, res) => {
    var relatorio = [];
    try {
      fs.readdir(uploadFolder, (err, files) => {
        for (let i = 0; i < files.length; i++) {
          if (files[i] == 'arquivo.pdf') {
            relatorio.push(files[i]);
          }
        }
        res.download(relatorio[0]);
      })
    } catch (error) {
      res.status(500).send(err);
    }
  });

  server.get('/api/files/getall_cursos', async (req, res) => {
    var relatorio = [];
    try {
      fs.readdir(uploadFolder, (err, files) => {
        for (let i = 0; i < files.length; i++) {
          if (files[i] == 'arquivo_curso.pdf') {
            relatorio.push(files[i]);
          }
        }
        res.download(relatorio[0]);
      })
    } catch (error) {
      res.status(500).send(err);
    }
  });

  server.get('/api/files/getall_notas', async (req, res) => {
    var relatorio = [];
    try {
      fs.readdir(uploadFolder, (err, files) => {
        for (let i = 0; i < files.length; i++) {
          if (files[i] == 'arquivo_notas.pdf') {
            relatorio.push(files[i]);
          }
        }
        res.download(relatorio[0]);
      })
    } catch (error) {
      res.status(500).send(err);
    }
  });

  server.get('/api/files/get_notas', async (req, res) => {
    var relatorio = [];
    try {
      fs.readdir(uploadFolder, (err, files) => {
        for (let i = 0; i < files.length; i++) {
          if (files[i] == 'arquivo_notas_aluno.pdf') {
            relatorio.push(files[i]);
          }
        }
        res.download(relatorio[0]);
      })
    } catch (error) {
      res.status(500).send(err);
    }
  });

  server.get('/api/files/getall_atividades', async (req, res) => {
    var relatorio = [];
    try {
      fs.readdir(uploadFolder, (err, files) => {
        for (let i = 0; i < files.length; i++) {
          if (files[i] == 'arquivo_atividades.pdf') {
            relatorio.push(files[i]);
          }
        }
        res.download(relatorio[0]);
      })
    } catch (error) {
      res.status(500).send(err);
    }
  });

  server.post('/api/files/upload', async (req, res) => {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        });
      } else {
        let myFile = req.files.myFile;
        myFile.mv('./uploads/' + myFile.name);
        res.send({
          status: true,
          message: 'File is uploaded',
          data: {
            name: myFile.name,
            mimetype: myFile.mimetype,
            size: myFile.size,
          }
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  server.post('/api/files/validar', async (req, res) => {
    const a = req.body;
    const hash = []
    fs.readFile('./uploads/' + a.nameFile, 'utf-8', function (err, dataresult) {
      if (err) {
        console.log('err3', err);
      }
      hash.push(sha256(dataresult));

      res.send({
        status: true,
        message: 'File is valid',
        data: {
          hash: hash[0]
        }
      });
    });
  })
}