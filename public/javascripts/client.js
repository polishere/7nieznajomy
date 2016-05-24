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
	$('#disconnect').attr('onclick','leaveChat();').attr('value','Rozłącz');
});

socket.on('message', function(data){
	showMessage(data)
});

socket.on('chat end', function(){
	leaveChat();
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
	$('#conversation').append('<li class="mar-btm"><div class="media-left"><img src="/images/avatar1.png" class="img-circle img-sm" alt="Profile Picture"></div><div class="media-body pad-hor"><div class="speech"><span class="media-heading">Gość</span><p>'+data.data+'</p><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>'+data.time+'</p></div></div></li>');
	
	var elem = document.getElementById('conversations');
	elem.scrollTop = elem.scrollHeight;
}

var getTimeMsg = function(){
	currentTime = new Date();
		
	if (currentTime.getHours()<10)
		hours='0'+currentTime.getHours();
	else
		hours=currentTime.getHours();
	
	if (currentTime.getMinutes()<10)
		minutes='0'+currentTime.getMinutes();
	else
		minutes=currentTime.getMinutes();
	
	time=hours+':'+minutes;
	
	return time;
}

var showMyMessage = function(data){
	$('#conversation').append('<li class="mar-btm"><div class="media-right"><img src="/images/avatar2.png" class="img-circle img-sm" alt="Profile Picture"></div><div class="media-body pad-hor speech-right"><div class="speech"><span class="media-heading">Ty</span><p>'+data+'</p><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>'+getTimeMsg()+'</p></div></div></li>');
	
	var elem = document.getElementById('conversations');
	elem.scrollTop = elem.scrollHeight;
}

var showDisconnectScreen = function(){
	
	$('#status').html('Gość się rozłączył');
	$('#conversation').empty();
	$('#disconnect').attr('onclick','connectAgain();').attr('value','Połącz');
	
}

var sendMessage = function(message){
	if(connected)
		socket.emit('message', message)
}

var leaveChat = function() {
		socket.disconnect();
		room='';
		inRoom=false;
		showDisconnectScreen();	
}

var connectAgain = function() {
		socket.connect();
		$('#disconnect').attr('onclick','leaveChat();').attr('value','Rozłącz');
	
}


$(function(){
	$('#connect').hide();
	$('#datasend').click( function() {
		var message = $('#data').val();
		
		if (message.length<1)
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



