const path = require("path");
const fs = require('fs');
const { encodingBase64, decodingBase64 } = require("../utiles");


async function getFile(req, res) {
    const { fileName } = req.params;
    // filePath = path.join(__dirname, `./../data/images/${fileName}`);
    filePath = path.join(__dirname, `./../data/images/${fileName}`);

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

function saveFile(req, res) {

}

module.exports = {
    getFile
}