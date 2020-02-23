requirejs.config({
  baseUrl:"./js",
  paths: {
    jquery: 'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min',
    io: '../socket.io/socket.io.js',
    indexPage: '../page/index',
  }
})

if (window.location.pathname === '/chatroom') {
  requirejs(['indexPage'], function(undefined) {})
}

