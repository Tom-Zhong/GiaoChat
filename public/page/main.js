requirejs(['axios', 'jquery', 'io', 'popper', 'bootstrap'], function(axios, $, io) {
  const UIComponents = {
    roomsList: $('.rooms-list')
  }
  const chatCom = io.connect('/chat_com')
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
      console.log(e.target.dataset.id)
      const roomsId = e.target.dataset.id
      const token = localStorage.getItem('token')
      console.log(token)
      var data = {
        message: Math.random() + 'hahah',
        type: 'userMessage',
        sender: token,
        receiver: roomsId,
      }
      chatCom.send(JSON.stringify(data))
    })

    chatCom.on('message', e => {console.log(e)})
    console.log(res)
  })
})
