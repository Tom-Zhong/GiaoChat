requirejs.config({
  baseUrl:"./js",
  paths: {
    jquery: '/scripts/jquery-3.6.0.min',
    popper: '/scripts/popper.min',
    bootstrap: '/scripts/bootstrap.min',
    io: '/socket.io/socket.io.js',
    homePage: '/page/home',
    chatRoomPage: '/page/chatroom',
    roomPage: '/page/room',
    signupPage: '/page/signup',
    signinPage: '/page/signin',
    mainPage: '/page/main',
    axios: 'https://cdn.bootcss.com/axios/0.19.2/axios.min'
  },
  shim: {
    "bootstrap": ["jquery"]
  },
  map: {
    "*": {
      "@popperjs/core": "popper"
    }
  }
})

if (window.location.pathname === '/') {
  requirejs(['homePage'], function(undefined) {})
}

if (window.location.pathname.includes('/chatroom')) {
  requirejs(['chatRoomPage'], function(undefined) {})
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

// if (window.location.pathname === '/chatroom') {
//   requirejs(['chatRoomPage'], function(undefined) {})
// }
