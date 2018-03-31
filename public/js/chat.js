var socket = io();
var locationButton = $("#sendLocation");
locationButton.click(function(e){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }
    locationButton.attr('disabled', 'true').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.removeAttr("disabled").text('Send Location');
    },function(){
     alert('Unable to fetch Location');
        locationButton.removeAttr("disabled").text('Send Location');
    })
});
(function(){
    function scrollToBottom(){
        //Selectors
        var messages = $("#messages");
        var newMessage = messages.children("li:last-child");
        // Heights
        var clientHeight = messages.prop("clientHeight");
        var scrollTop = messages.prop('scrollTop');
        var scrollHeight = messages.prop('scrollHeight');
        var newMessageHeight = newMessage.innerHeight();
        var lastMessageHeight = newMessage.prev().innerHeight();

        if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
            messages.scrollTop(scrollHeight);
        

    }
    socket.on('newLocationMessage',function(msg){
        var formattedTime = moment(msg.createdAt).format('h:mm a');
        var template = $("#location-message-template").html();
        var html = Mustache.render(template,{
            text: msg.text,
            from: msg.from,
            createdAt: formattedTime,
            url: msg.url
        });
        $("#messages").append(html);
        scrollToBottom();
        
    });
    socket.on('connect', function () {
        console.log('Connected to server');
        var params = $.deparam(window.location.search);
        socket.emit('join',params,function(err){
            if(err)
             {
                 alert(err);
                window.location.href = "/";
             }
             else{
                console.log("No error");
             }
        });
    });
    socket.on('disconnect', function () {
        console.log('Disconnected from server');
    });
    socket.on('updateUserList',function(users){
        var ol = $("<ol></ol>");
        users.forEach(function(user){
            ol.append($("<li></li>").text(user));
        });
        $("#users").html(ol);
    });
    socket.on('newMessage',function(msg){
        var template = $("#message-template").html();
        var formattedTime = moment(msg.createdAt).format('h:mm a');
        var html = Mustache.render(template,{
            text:msg.text,
            from: msg.from,
            createdAt: formattedTime
        });
        $("#messages").append(html);
        scrollToBottom();
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
                $("[name='message']").val("");
            });
            return false;
    });
})();