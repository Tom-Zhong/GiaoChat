var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chatroom', function(req, res, next) {
  res.render('chatroom', { title: 'chat_room' });
});

router.get('/rooms', function(req, res, next) {
  res.render('rooms', { title: 'rooms' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'about' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'signup' });
});


module.exports = router;
