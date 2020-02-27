requirejs(['axios', 'jquery', 'io', 'popper', 'bootstrap'], function(axios, $, io) {
  const UIComponents = {
    roomsList: $('.rooms-list')
  }
  const chatCom = io.connect('/chat_com')

  // 获取用户在浏览器中存储的token，发给服务器，用来绑定服务器中的socket
  const token = localStorage.getItem('token')
  console.log(token)
  var data = {
    type: 'bindSocket',
    token: token,
  }
  console.log(data);
  chatCom.emit('bindSocket', JSON.stringify(data))

  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    e.target // newly activated tab
    e.relatedTarget // previous active tab
    console.log(e.target)
  })

  const id = localStorage.getItem('uid')
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
        message: Math.random() + 'hahah',
        receiver: roomsId,
      }
      chatCom.send(JSON.stringify(data))
    })

    chatCom.on('message', e => {console.log(e)})
    console.log(res)
  })
})
