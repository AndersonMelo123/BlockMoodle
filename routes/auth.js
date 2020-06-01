const pool = require('../dbconfig/dbconfig');
const sha256 = require('sha256');
var fs = require('fs');
var pdf = require("html-pdf");
var ejs = require("ejs");

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

    ejs.renderFile("C:/Users/Anderson Melo/Documents/MEGA/UFRPE - MESTRADO/blockchain/BlockMoodle/routes/documento.ejs", {data: data, hora: hora, alunos: results}, (err, html) => {
      if(err){
        console.log('err1',err);
      } else {
        pdf.create(html, options).toFile("./meupdflindao.pdf", (err, res) => {
          if(err) {
            console.log('err2',err);
          }else{
            fs.readFile('./meupdflindao.pdf', 'utf-8', function (err, dataresult) {
              if(err){
                console.log('err3',err);
              }
              const a = sha256(dataresult);
              
              return resp.json({chave: a});
            });
          }
        });
      }
    });
  })
}