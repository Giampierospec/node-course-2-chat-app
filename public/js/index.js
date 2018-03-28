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
        
    });
    socket.on('connect', function () {
        console.log('Connected to server');
    });
    socket.on('disconnect', function () {
        console.log('Disconnected from server');
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