//static index page returned to oj-client
//oj-server can be more than API (send back data)

const express = require('express');
const router = express.Router();
const path = require('path');

// router.get('/', (res, req) => {
// 	res.sendFile('index.html', { root:path.join(__dirname, '../../public')});
// });

module.exports = router;