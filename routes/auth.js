const pool = require('../dbconfig/dbconfig');
const poolUser = require('../dbconfig/dbconfig_user');
const sha256 = require('sha256');
var fs = require('fs');
var pdf = require("html-pdf");
var ejs = require("ejs");
const bcrypt = require('bcrypt');
const saltRounds = 10;

//var express = require('express');

module.exports = (server) => {

  if (server === null) {
    throw new Error('server should be an express instance')
  }

  async function getUser() {
    
    try {
      const results = await pool.query(`SELECT a.firstname, a.lastname, a.email, a.timecreated FROM mdl_user as a`)
      
      return results[0];
    } catch (error) {
      console.error(error);
    }
  }

  server.get('/auth/profile', async (req, resp) => {
    
    const results = await getUser();

    var timestamp = new Date().getTime();
    var d = new Date(timestamp);
    var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    var data = d.getDate() +'/'+ months[d.getMonth()] +'/'+ d.getFullYear(); 
    var hora = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();;

    var options = {"border": {"top": "1.5cm","right": "1.5cm","bottom": "1.5cm","left": "1.5cm"}};

    ejs.renderFile("C:/Users/Anderson Melo/Documents/GIT/BlockMoodle/modelos/rlt_users.ejs", {data: data, hora: hora, alunos: results}, (err, html) => {
      if(err){
        console.log('err1',err);
      } else {
        pdf.create(html, options).toFile("./arquivo.pdf", (err, res) => {
          //console.log('RERSSSS', res); // endereço q criou o pdf
          if(err) {
            console.log('err2',err);
          }else{
            fs.readFile('./arquivo.pdf', 'utf-8', function (err, dataresult) {
              if(err){
                console.log('err3',err);
              }
              const a = sha256(dataresult);
              //dataresult.download('./meupdflindao.pdf');
              return resp.json({chave: a});
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
        //if (results[0][0].verified) {
          bcrypt.compare(password, results[0][0].password).then(function(response) {
            if (response == true) {
              req.session.loggedin = true
              req.session.email = email
              return res.json(req.session)
            } else {
              return res.json({message: 'Senha incorreta!'})
            }
          })
        //} else {
        //  return res.json({message: 'User not verified'})
        //}
      } else {
        return res.json({message: 'Usuário não encontrado!'})
      }
    } else {
      return res.json({message: 'Por favor, informe email e senha!'})
    }
  })

  async function getUsuario(email) {
    try {
      const results = await poolUser.query(`SELECT * FROM users WHERE email='${email}';`)
      return results
    }catch(e){
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
      bcrypt.hash(password, saltRounds).then(async function(hash) {
        const results = await addUser(name, address, email, hash)
        if (results && results.length > 0) {
          bcrypt.hash(email + hash, saltRounds).then(function(hash) {
            sendVerificationEmail(email, "http://" + req.headers.host + "/auth/verify?email=" + email + "&hash=" + hash)
          })
          return res.json({email: email})
        } else {
          return res.json({message: 'Email já cadastrado: ' + email})
        }
      })
    } else {
      return res.json({message: 'Por favor, preencha todos os campos!'})
    }
  })

  async function addUser(name, address, email, password) {
    try {
      const results = await poolUser.query(`INSERT INTO users (name, address, email, password) VALUES ("${name}", "${address}","${email}", "${password}");`)
      return results
    }catch(e){
      console.error(e)
    }
  }

//==========================================================================================================

  server.get('/auth/signout', (req, res) => {
    if (req.session && req.session.loggedin) {
      console.log('destruiu session');
      req.session.destroy()
      res.redirect(`/`)
    }
  })

  server.get('/auth/session', (req, res) => {
    if (req.session) {
      console.log('criou session');
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
	
  server.get('/api/files/getall', fileWorker.listAllFiles);
  
  server.post('/api/files/upload', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let myFile = req.files.myFile;

            myFile.mv('./uploads/' + myFile.name);

            //send response
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

  server.post('/api/files/validar', async (req, res)=>{

    const a = req.body;

    console.log('req a ======= ', a.nameFile);
    
    const hash = []

    fs.readFile('./uploads/' + a.nameFile, 'utf-8', function (err, dataresult) {
      if(err){
        console.log('err3',err);
      }
      console.log(sha256(dataresult));
      
      hash.push(sha256(dataresult));

      console.log(hash[0]);
      
      res.send({
        status: true,
        message: 'File is valid',
        data: {
            hash: hash[0]
        }
      });
    });
  })
	//server.get('/api/files/:filename', fileWorker.downloadFile);

}