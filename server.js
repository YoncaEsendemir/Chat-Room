const express = require('express');
const path = require('path');

const app =  express();
/* Bu kod parçası, Express uygulamasının HTTP sunucusu üzerinde çalışmasını sağlar. 
Bu sayede, Express uygulaması,gelen istekleri işleyebilir ve istemcilere yanıt verebilir.
Örneğin, bir web sitesi sunmak veya bir API sağlamak için bu HTTP sunucusu kullanılabilir.*/
const server= require('http').createServer(app);

const io=require("socket.io")(server);
app.use(express.static(path.join(__dirname+"/public")));

//Gönderilen mesaj tetiklenen olayları yakalamak için kullanılan on metodu ile alınarak gönderilen değere ulaşılır.
io.on("connection", function(socket){
socket.on("newuser",function(username){
socket.broadcast.emit("update",username +"join in the conversation");
});

socket.on("exituser",function(username){
    socket.broadcast.emit("update",username +"left in the conversation");
    });

    socket.on("chat",function(message){
        socket.broadcast.emit("chat",message);
        });
});
server.listen(5000);