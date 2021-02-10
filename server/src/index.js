require('dotenv').config();
const cors = require('cors');
const express = require('express');

const server = express();
const port = 3001;

server.use(cors());

const staticDataRoot = './static';
server.use(express.static(staticDataRoot));

server.listen(port, () => console.log('JV server live on ' + port));
