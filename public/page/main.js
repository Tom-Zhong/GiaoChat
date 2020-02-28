requirejs(['axios', 'jquery', 'io', 'popper', 'bootstrap'], function(axios, $, io) {
  const UIComponents = {
    roomsList: $('.rooms-list'),
    textBox: $('#message'),
    friendsList: $('.friend-list'),
    friendRequestBox: $('#friend-request'),
    friendSendRequestBtn: $('#send-friend-request')
  }
  const chatCom = io.connect('/chat_com')

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

  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    e.target // newly activated tab
    e.relatedTarget // previous active tab
    console.log(e.target)
  })
  const id = localStorage.getItem('uid')
  UIComponents.friendSendRequestBtn.click(() => {
    const formData = {
      friendData: UIComponents.friendRequestBox.val(),
    }
    axios.post(`/v1/friends/${id}`, formData)
  })

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
      console.log('聊天列表ID: ', e.target.dataset.id)
      const roomsId = e.target.dataset.id
      const data = {
        type: 'chatMessage',
        message: UIComponents.textBox.val(),
        receiver: roomsId,
      }
      chatCom.send(JSON.stringify(data))
    })

    chatCom.on('message', e => {console.log(e)})
    console.log(res)
  })

  axios.get(`/v1/friends/${id}`).then(res => {
    const { data } = res
    const { friendsList } = data;
    UIComponents.friendsList.empty('li')
    console.log(friendsList)
    friendsList.length > 0 && friendsList.map(item => {
      const firendData = item.friend
      var li = `<li class="list-group-item" data-id="${ firendData._id }" data-email="${ firendData.email }"> ${ firendData.name } 在线状态: ${ firendData.onLineStatus ? '在线' : '离线'  } </li>`
      UIComponents.friendsList.append(li)
    })
    // UIComponents.friendsList.children('li').click((e)=>{
    //   console.log('聊天列表ID: ', e.target.dataset.id)
    //   // const roomsId = e.target.dataset.id
    //   // const data = {
    //   //   type: 'chatMessage',
    //   //   message: Math.random() + 'hahah',
    //   //   receiver: roomsId,
    //   // }
    //   chatCom.send(JSON.stringify(data))
    // })

    chatCom.on('message', e => {console.log(e)})
    console.log(res)
  })

  document.addEventListener('visibilitychange', function () {
    // 用户离开了当前页面
    if (document.visibilityState === 'hidden') {
      document.title = '页面不可见';
      chatCom.close()
    }

    // 用户打开或回到页面
    if (document.visibilityState === 'visible') {
      document.title = '页面可见';
      chatCom.connect()
      bindSocket()
    }
  });
})
