const uploadFolder = 'C:/Users/Anderson Melo/Documents/GIT/BlockMoodle/';
const fs = require('fs');

exports.uploadFile = (req, res) => {
	//res.send('File uploaded successfully! -> filename = ' + req.file.filename);
	console.log('nome ========= ', req.body);
}

exports.listAllFiles = (req, res) => {
	var relatorio = [];
	try {
		fs.readdir(uploadFolder, (err, files) => {
		for (let i = 0; i < files.length; i++) {
			console.log(files[i]);
			if (files[i] == 'arquivo.pdf'){
				relatorio.push(files[i]);
			}	
		}
		res.download(relatorio[0]);
	})	
	} catch (error) {
		console.log('ERRRORORO', error);
	}
	
}

/*exports.downloadFile = (req, res) => {
	var filename = req.params.filename;
	res.download(uploadFolder + filename); 
}*/