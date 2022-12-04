requirejs.config({
  baseUrl:"./js",
  paths: {
    jquery: '../scripts/jquery.slim.min',
    popper: '../scripts/popper.min',
    bootstrap: '../scripts/bootstrap.min',
    io: '../socket.io/socket.io.js',
    homePage: '../page/home',
    indexPage: '../page/index',
    roomPage: '../page/room',
    signupPage: '../page/signup',
    signinPage: '../page/signin',
    mainPage: '../page/main',
    axios: 'https://cdn.bootcss.com/axios/0.19.2/axios.min'
  }
})

if (window.location.pathname === '/') {
  requirejs(['homePage'], function(undefined) {})
}

if (window.location.pathname === '/chatroom') {
  requirejs(['indexPage'], function(undefined) {})
}

if (window.location.pathname === '/rooms') {
  requirejs(['roomPage'], function(undefined) {})
}


if (window.location.pathname === '/signup') {
  requirejs(['signupPage'], function(undefined) {})
}

if (window.location.pathname === '/signin') {
  requirejs(['signinPage'], function(undefined) {})
}

if (window.location.pathname === '/main') {
  requirejs(['mainPage'], function(undefined) {})
}
