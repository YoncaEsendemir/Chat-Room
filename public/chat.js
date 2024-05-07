

  const app=document.querySelector('.app');
  const socket= io.connect('http://localhost:5000');
  let uname;

  app.querySelector(".join-screen #join-user").addEventListener("click",function (){
      let username= app.querySelector(".join-screen #username").value;
      console.log(username);
      if(username.length==0){
        return;
      }
      /*Bu kod parçası, bir WebSocket bağlantısı üzerinden belirli bir olayı tetikler ve bu olaya ilişkin
     bir veri göndererek,sunucu veya diğer istemciler tarafından dinlenen bu olaya bir tepki alınmasını sağlar*/ 
      socket.emit("newuser",username)
      uname=username
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
  });

  //Bu JavaScript kodu, mevcut sayfanın URL'sini yeniden yüklemek için kullanılır. İşte bu kodun 
  app.querySelector(" .chat-screen #exit-chat").addEventListener("click",function(){
    socket.emit("exituser",uname);
    window.location.href=window.location.href;
  })
      
  app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
    // inpubox2tan değer alma 
    let message=app.querySelector(".chat-screen #message-input").value;
    if(message.length==0){
      return;
    }
    //messaj oluşturmak 
    renderMessage("my",{
      username:uname,
      text:message
    });

    socket.emit("chat",{
        username:uname,
        text:message
    });

    app.querySelector(".chat-screen #message-input").value="";
  });
 // serveda updat olayi tetikler
        socket.on("update",function(update){
        renderMessage("update",update);
        });
// chat olayi tetikler mesaj gönderilir  
        socket.on("chat",function(message){
            renderMessage("other",message);
        });

  function renderMessage(type,message){
    let messageContainer = app.querySelector(".chat-screen .message1");
    if(type=='my'){
        let el=document.createElement('div');
        el.setAttribute("class","message my-message");
        el.innerHTML=`<div>
        <div class="name">You</div>
        <div class="text">${message.text}</div>
        </div>
        `;
        
        messageContainer.appendChild(el);
    }
    else if(type=="other"){
        let el=document.createElement('div');
        el.setAttribute("class","message other-message");
        el.innerHTML=`<div>
        <div class="name">${message.username}</div>
        <div class="text">${message.text}</div>
        </div>
        `;
        messageContainer.appendChild(el);        
    }

    else if(type=="update"){
        let el=document.createElement('div');
        el.setAttribute("class","update");
        el.innerText=message
        messageContainer.appendChild(el);        
    }
    //
    messageContainer.scrollTop=messageContainer.scrollHeight - messageContainer.clientHeight;
  }