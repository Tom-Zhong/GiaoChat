requirejs(['io', 'jquery', 'axios', 'betterScroll', 'recorder'], function(io, $, axios, BtterScroll, Recorder) {
  $(function() {
    var chatCom = io.connect('/chat_com')
    const roomName = decodeURI(
      (RegExp('room' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    )

    let page = 0;
    let noMoreMsgLoad = false;
    let bs = BtterScroll.createBScroll('.scroll-wrapper', {
      // wheel:true,
      scrollbar: true,
      pullDownRefresh: {
        threshold: 70,
        stop: 56,
      },
      scrollY: true,
      boundTime: 800
    })
    let UIComponents = {
      file: $('#file'),
    }

    function renderChatHistoryNode (msg, way) {
      if (way === 'get') {
        if (msg.from._id === localStorage.getItem('uid')) {
          $('.pulldown-list .chat-history ul').append(
              `<li>
                  <div class="message-data">
                    <span class="message-data-name" >${msg.from.name}</span> <i class="fa fa-circle me"></i>
                    <span class="message-data-time" >${msg.createTime}</span> &nbsp; &nbsp;
                  </div>
                  <div class="message my-message">
                    ${msg.content}
                  </div>
                </li>`
          )
        } else {
          $('.pulldown-list .chat-history ul').append(
              `<li class="clearfix">
                  <div class="message-data align-right">
                    <span class="message-data-time" >${msg.createTime}</span> &nbsp; &nbsp;
                    <span class="message-data-name" >${msg.from.name}</span> <i class="fa fa-circle me"></i>
                    
                  </div>
                  <div class="message other-message float-right">
                    ${msg.content}
                  </div>
                </li>`
          )
        }

        return
      }

      if (msg.from._id === localStorage.getItem('uid')) {
        $('.pulldown-list .chat-history ul').prepend(
            `<li>
                  <div class="message-data">
                    <span class="message-data-name" >${msg.from.name}</span> <i class="fa fa-circle me"></i>
                    <span class="message-data-time" >${msg.createTime}</span> &nbsp; &nbsp;
                  </div>
                  <div class="message my-message">
                    ${msg.content}
                  </div>
                </li>`
        )
        return
      }

      $('.pulldown-list .chat-history ul').prepend(
          `<li class="clearfix">
                  <div class="message-data align-right">
                    <span class="message-data-time" >${msg.createTime}</span> &nbsp; &nbsp;
                    <span class="message-data-name" >${msg.from.name}</span> <i class="fa fa-circle me"></i>
                    
                  </div>
                  <div class="message other-message float-right">
                    ${msg.content}
                  </div>
                </li>`
      )
    }
    function getMessages (cb) {
      axios.post(`/v1/messages/${roomName}/${page}`, {
        token: localStorage.getItem('token')
      })
          .then(res => {
            const { data = {} } = res
            // console.log(data)
            if (data.length === 0) {
              noMoreMsgLoad = true
              return
            }
            data.length > 0 && $.each(data.messages, (i, msg) => {
              renderChatHistoryNode(msg)
            })
            typeof cb === 'function' && cb()
          })
          .catch(err => {
            console.log(err)
            // alert('服务器未知错误')
          })
    }

    function initChatRoom () {
      // 获取用户在浏览器中存储的token，发给服务器，用来绑定服务器中的socket
      function bindSocket () {
        const token = localStorage.getItem('token')
        var data = {
          type: 'bindSocket',
          token: token,
        }
        // console.log(data);
        chatCom.emit('bindSocket', JSON.stringify(data))
      }

      bindSocket()

      bs.on('pullingDown', async () => {
        if (!noMoreMsgLoad) {
          await getMessages(page++)
        }
        setTimeout(() => {
          bs.finishPullDown()
          bs.refresh()
        }, 30)
      })

      getMessages(() => {
        bs.refresh()
        bs.scrollTo(0, bs.maxScrollY)
      })

      UIComponents.file.on('change', function () {
        let formData = new FormData()
        let file = this.files[0]
        console.log(file)
        formData.append('file', file)

        const config = {};

        axios.post("/file-upload", formData, config).then(res => {
          console.log(res);
        });
      })

      let recorder = new Recorder({
        type:"wav",   //此处的type类型是可修改的
        bitRate:16,
        sampleRate:16000,
        bufferSize:8192,
      })
      if (navigator.mediaDevices.getUserMedia) {
        const constraints = { audio: true };
        navigator.mediaDevices.getUserMedia(constraints).then(
            stream => {
              // recording()
              console.log("授权成功！");
            },
            () => {
              console.error("授权失败！");
            }
        );
      } else {
        console.error("浏览器不支持 getUserMedia");
      }

      function recording () {
        recorder.start()

        setTimeout(() => {
          recorder.stop();
          recorder.play();
          const wavBlob = recorder.getWAVBlob();
          let formData = new FormData()
          let file = wavBlob
          console.log(file)
          formData.append('file', file, Math.random() * 1e8 + '.wav')

          const config = {};

          axios.post("/file-upload", formData, config).then(res => {
            console.log(res);
          });
        }, 5000)
      }
    }

    chatCom.on('message', function(data) {
      console.log(data)
      if (data) {
        renderChatHistoryNode(data, 'get')
        bs.refresh()
        bs.scrollTo(0, bs.maxScrollY)
      }
    });

    $('#play').click(function () {
      function toggleSound() {
        var music = document.getElementById("audioPlay")
        if (music.paused) {
          music.paused = false
          music.play()
        }
      }
      toggleSound()
    })

    $('#send').click(function() {
      const token = localStorage.getItem('token')
      // console.log(token)
      var data = {
        message: $('#message').val(),
        sender: token,
        receiver: roomName
      }
      // console.log('data', data)
      chatCom.send(JSON.stringify(data))
      $('#message').val('')
    })

    initChatRoom();
  })
})
