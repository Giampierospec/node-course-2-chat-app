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
        var li = $("<li></li>");
        var a = $("<a target='_blank'>My current Location</a>");
        li.text(`${msg.from} ${formattedTime}: `);
        a.attr('href',msg.url);

        li.append(a);
        $("#messages").append(li);
    });
    socket.on('connect', function () {
        console.log('Connected to server');
    });
    socket.on('disconnect', function () {
        console.log('Disconnected from server');
    });
    socket.on('newMessage',function(msg){
        var formattedTime = moment(msg.createdAt).format('h:mm a');
        console.log('New message', msg);
        var li = $("<li></li>");
        li.text(`${msg.from} ${formattedTime}: ${msg.text}`);
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
                $("[name='message']").val("");
            });
            return false;
    });
})();