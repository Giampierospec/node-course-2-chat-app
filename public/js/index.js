var socket = io();
(function(){
    socket.on('connect', function () {
        console.log('Connected to server');
    });
    socket.on('disconnect', function () {
        console.log('Disconnected from server');
    });
    socket.on('newMessage',function(msg){
        console.log('New message', msg);
        var li = $("<li></li>");
        li.text(`${msg.from}: ${msg.text}`);
        $("#messages").append(li);
    });
    socket.on('welcome',function(msg){
        console.log('Welcome message', msg);
    });
    socket.on('otherUsers', function(msg){
        console.log('Msg',msg);
    });

    $("#message-form").submit((e)=>{
            socket.emit('createMessage',{
                from:'User',
                text: $("[name='message']").val()
            },function(){
                
            });
            return false;
    });
})();