require('dotenv').config();
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const multer = require('multer');

const server = express();
const port = 3001;

server.use(cors());

const staticDataRoot = './static';
server.use(express.static(staticDataRoot));

const pdiStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `/server/static/peru-departure-inspections/${req.headers['container-id']}/images`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadPDIImages = multer({ storage: pdiStorage });
server.post(
  '/peru-departure-inspections',
  uploadPDIImages.array('image'),
  (req, res) => {
    const fileNames = req.files.map((file) => {
      console.log(`File ${file.originalname} uploaded to ${file.path}`);
      return file.path.replace('/server/static/', '');
    });
    return res.status(200).send({ fileNames, success: true });
  },
);

server.listen(port, () => console.log('JV server live on ' + port));
