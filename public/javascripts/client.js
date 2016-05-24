var socket = io.connect(document.location.protocol+'//'+document.location.host);
var room='';
var connected = false;
var inRoom = false;

var userName = $('#username').val();
var userAge = $('input[name=userAge]').val();
var userSex = $('input[name=userSex]:checked').val();;
var userLocation = $('#userLocation').val();
var userPreferSex = $('#userPreferSex').val();;
var userPreferAgeMin = $('#userPreferAgeMin').val();
var userPreferAgeMax = $('#userPreferAgeMax').val();
var theSamePlace = $('#theSamePlace').val();



socket.on('connect', function(){
	connected=true;
	socket.emit('new client', {
		userName: userName, 
		userAge: userAge, 
		userSex: userSex, 
		userLocation: userLocation, 
		userPreferSex: userPreferSex,
		userPreferAgeMin: userPreferAgeMin, 
		userPreferAgeMax: userPreferAgeMax});
	console.log('ok1')
});

socket.on('chat start', function(data){
	room = data.room;
	inRoom = true;
	showServerMessage(data);
});

socket.on('message', function(data){
	showMessage(data)
});

socket.on('chat end', function(){
	showDisconnectScreen();
	socket.leave(room);
	room='';
});

socket.on('disconnect', function(){
	showDisconnectScreen();
	inRoom = false
});

socket.on('userCount', function(userCount){
	$('#counter').html(userCount+ ' online')
});

socket.on('typing', function(data){
	
});

var showServerMessage = function(data){
	$('#status').html(data.data);
}

var showMessage = function (data) {
	
	if(data.serverinfo)
	$('#status').html(data.data);
	$('#conversation').append('<li class="mar-btm"><div class="media-left"><img src="http://bootdey.com/img/Content/avatar/avatar1.png" class="img-circle img-sm" alt="Profile Picture"></div><div class="media-body pad-hor"><div class="speech"><a href="#" class="media-heading">Gość</a><p>'+data.data+'</p><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>'+data.time+'</p></div></div></li>');
	
	var elem = document.getElementById('conversation');
	elem.scrollTop = elem.scrollHeight;
}

var showMyMessage = function(data){
	currentTime = new Date();
	time=currentTime.getHours()+':'+currentTime.getMinutes();
	$('#conversation').append('<li class="mar-btm"><div class="media-right"><img src="http://bootdey.com/img/Content/avatar/avatar2.png" class="img-circle img-sm" alt="Profile Picture"></div><div class="media-body pad-hor speech-right"><div class="speech"><a href="#" class="media-heading">Ty</a><p>'+data+'</p><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>'+time+'</p></div></div></li>');
	
	var elem = document.getElementById('conversation');
	elem.scrollTop = elem.scrollHeight;
}

var showDisconnectScreen = function(){
	
	$('#status').html('Gość się rozłączył');
	//clear screen
	//someone has disconnected
	//new connect button
}

var sendMessage = function(message){
	if(connected)
		socket.emit('message', message)
}

var leaveChat = function() {
	if(connected){
		io.disconnect();
		room='';
		inRoom=false;
		showDisconnectScreen();	
	}
}


$(function(){
	$('#datasend').click( function() {
		var message = $('#data').val();
		
		if (message.length<3)
			alert('Wiadomość za krótka. Napisz coś więcej');
		else 
			{$('#data').val('');
		if(inRoom){
			sendMessage(message);
			showMyMessage(message);
		}
		else
			showDisconnectScreen();
		$('#data').focus();}
	});

	// when the client hits ENTER on their keyboard
	$('#data').keypress(function(e) {
		if(e.which == 13) {
			$(this).blur();
			$('#datasend').focus().click();
		}
	});
	
	$(document).keypress(function(e) {
		if ((e.keyCode == 27))  
			leaveChat();
    });
	
	$('#clearscreen').click(function(){
		$('#conversation').empty();
	});
	
	var slider = new Slider('#ex1', {
	formatter: function(value) {
		return 'Current value: ' + value;
	}
});

});



