module.exports = function(io){
	
var queue = [];
var rooms = {};
var allUsers = {};
var userCount = 0;



var findStranger = function(socket){
	if(queue.length>0)
	{
		console.log(queue.length);
		var stranger = queue.pop();
		var room=socket.id+'#'+stranger.id;

		stranger.join(room);
		socket.join(room);
		
		rooms[stranger.id] = room;
		rooms[socket.id] = room;
		
		stranger.emit('chat start', {room: room, data: 'Ktoś się połączył'})
		socket.emit('chat start', {room: room, data: 'Ktoś się połączył'})
	}
	else
		{
			queue.push(socket);
		}
		
}

io.on('connection', function (socket) {

	console.log ('User '+socket.id+' connected')
	
	socket.on('new client', function () {
		allUsers[socket.id] = socket;
		findStranger(socket);
		socket.emit('userCount', ++userCount);
	});
	
	socket.on('typing', function(){
		
	});
		
	socket.on('message', function (data) {
		var room = rooms[socket.id];
		currentTime = new Date();
		if(currentTime.getMinutes()<10)
			time=currentTime.getHours()+':0'+currentTime.getMinutes();
		else
			time=currentTime.getHours()+':'+currentTime.getMinutes();
		if (time=='21:37')
			time += " pamiętaj o papieżu";
		socket.broadcast.to(room).emit('message', {data:data, time:time});
		socket.emit('userCount', userCount)
		
    });

	socket.on('disconnect', function(){
		
		/* if(rooms[socket.id]){
			
			
			var room = rooms[socket.id];
			socket.broadcast.to(room).emit('chat end');
			var peerID = room.split('#');
			peerID = peerID[0] === socket.id ? peerID[1] : peerID[0];
			findStranger(allUsers[peerID]);
			
		}
		*/
		socket.emit('userCount', --userCount);	
		delete allUsers[socket.id];
		console.log ('User '+socket.id+' disconnected')
	});	
	
});

}