const express = require('express')
const router = express.Router()
const fs = require('fs');

// loggin all request
router.use((req, res, next) => {
    let request = `Request URL:, ${req.originalUrl}\nRequest Type: ${req.method}`
    next();
});

fs.readdirSync(__dirname).forEach(function(file) {
  if (file == 'index.js') return;
  let name = file.substr(0, file.indexOf('.'));
  require('./' + name)(router);
});

router.get('/', (req, res, next) => {
    return res.send('hello world', 200);
});

module.exports = router;
