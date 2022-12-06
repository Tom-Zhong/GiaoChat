requirejs(['axios', 'jquery', 'io', 'popper', 'bootstrap'], function(axios, $, io) {
  const UIComponents = {
    roomsList: $('.rooms-list'),
    textBox: $('#message'),
    friendsList: $('.friend-list'),
    friendRequestBox: $('#friend-request'),
    friendSendRequestBtn: $('#send-friend-request')
  }
  const chatCom = io.connect('/chat_com')
  chatCom.on('message', e => {console.log(e)})

  function initMainPage () {

    var token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/signin'
      return
    }

    // 获取用户在浏览器中存储的token，发给服务器，用来绑定服务器中的socket
    function bindSocket () {
      const token = localStorage.getItem('token')
      console.log(token)
      var data = {
        type: 'bindSocket',
        token: token,
      }
      console.log(data);
      chatCom.emit('bindSocket', JSON.stringify(data))
    }

    bindSocket()

    axios.get(`/v1/room/${id}`).then(res => {
      const { data } = res
      const { roomList } = data;
      UIComponents.roomsList.empty('li')
      roomList.map(item => {
        console.log(item)
        var li = `<li class="list-group-item" data-id="${ item._id }" data-member="${ item.member }"> ${ item.title } </li>`
        UIComponents.roomsList.append(li);
      })
      UIComponents.roomsList.children('li').click((e)=>{
        console.log('聊天室ID: ', e.target.dataset.id)
        const roomsId = e.target.dataset.id
        if (roomsId) {
          window.location.href = `/chatroom?room=${roomsId}`
        }
        // const data = {
        //   type: 'chatMessage',
        //   message: UIComponents.textBox.val(),
        //   receiver: roomsId,
        // }
        // chatCom.send(JSON.stringify(data))
      })

      // chatCom.on('message', e => {console.log(e)})
      // console.log(res)
    })

    axios.get(`/v1/friends/${id}`).then(res => {
      const { data } = res
      const { friendsList } = data;
      UIComponents.friendsList.empty('li')

      friendsList.length > 0 && friendsList.map(item => {
        const firendData = item.friend || item.owner
        var li = `<li class="list-group-item" data-id="${ firendData._id }" data-email="${ firendData.email }"> ${ firendData.name } 在线状态: ${ firendData.onLineStatus ? '在线' : '离线'  } </li>`
        UIComponents.friendsList.append(li)
      })

      if (!friendsList || friendsList.length === 0) {
        alert('你还没有添加朋友')
      }

      UIComponents.friendsList.children('li').click((e)=>{
        // 使用朋友id创建聊调试
        console.log('朋友ID: ', e.target.dataset.id)
        const friendId = e.target.dataset.id
        const ownerId = localStorage.getItem('uid')
        const members = [friendId, ownerId]
        const data = {
          ownerId,
          members,
          title: '简单的聊天室'
        }
        axios.post(`/v1/room/${ownerId}`, data).then(res => {
          console.log(res);
        })
      })

      // console.log(res)
    })

    // document.addEventListener('visibilitychange', function () {
    //   // 用户离开了当前页面
    //   if (document.visibilityState === 'hidden') {
    //     document.title = '页面不可见';
    //     chatCom.close()
    //   }
    //
    //   // 用户打开或回到页面
    //   if (document.visibilityState === 'visible') {
    //     document.title = '页面可见';
    //     chatCom.connect()
    //     bindSocket()
    //   }
    // })
  }


  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    console.log(e.target)
  })
  const id = localStorage.getItem('uid')
  UIComponents.friendSendRequestBtn.click(() => {
    const formData = {
      friendData: UIComponents.friendRequestBox.val(),
    }
    axios.post(`/v1/friends/${id}`, formData)
        .then(res => {
           const { data = {} } = res;
           alert(`行为代码: ${data.code}, ${data.msg}`)
        })
        .catch(err => {
           alert('服务器未知错误')
        })
  })

  initMainPage()
})
