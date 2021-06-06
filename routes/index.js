var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res,) {
  res.render('index', { title: 'Express' });
});

router.get('/chatroom', function(req, res,) {
  res.render('chatroom', { title: 'chat_room' });
});

router.get('/rooms', function(req, res,) {
  res.render('rooms', { title: 'rooms' });
});

router.get('/about', function(req, res,) {
  res.render('about', { title: 'about' });
});

router.get('/signin', function(req, res,) {
  res.render('signin', { title: 'signin' });
});
router.get('/signup', function(req, res,) {
  res.render('signup', { title: 'signup' });
});

router.get('/main', function(req, res,) {
  res.render('main', { title: 'main' });
});



module.exports = router;
