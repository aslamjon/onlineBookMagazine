const path = require("path");
const fs = require('fs');
const { encodingBase64, decodingBase64 } = require("../utiles");


async function getFile(req, res) {
    const { fileName } = req.params;
    let folder = req.route.path.split('/')[1];
    // let testFolder = `${req.url.replace(fileName, '').replace('/', '').replace('/', '')}`;
    let filePath = path.join(__dirname, `./../data/${folder}/${fileName}`);
    
    let file = 1;
    let base64 = '';
    try {
        base64 = encodingBase64(filePath);
    } catch (e) {
        file = 0
    }
    // decodingBase64(base64, filePathToImg);

    if (file) res.send({
        file: base64,
        fileName
    });
    else res.status(404).send({ message: "file not found" });
}

module.exports = {
    getFile
}