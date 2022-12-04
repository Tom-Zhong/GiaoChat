requirejs(['axios', 'jquery', 'popper', 'bootstrap'], function(axios, $) {
    console.log('[Page] Home Page Loaded');
    var UIComponents = {
        startBtn: $('#startchat'),
    }

    function initializePage () {

    }
    UIComponents.startBtn.click(function () {
        var token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/chatroom'
        } else {
            window.location.href = '/signup'
        }
    })
    initializePage()
})
