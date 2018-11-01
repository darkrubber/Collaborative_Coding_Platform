var redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 1800;

module.exports = function(io){
	//collab sessions
	var collaborations ={};
	//map from socketId to sessionId
	var socketIdToSessionId = {};

	var sessionPath = '/temp_sessions/';

	//waiting for connection from client
	io.on('connection', (socket) => {
		// socket id = abcd, session id = 1
		// get session id, which is the problem id
		let sessionId = socket.handshake.query['sessionId'];

		// given a socket id, indicate which problem it's working
		socketIdToSessionId[socket.id] = sessionId;

		// add current socket id to collaboration session participants
		// add redis
		if (sessionId in collaborations){
			collaborations[sessionId]['participants'].push(socket.id);

			let participants = collaborations[sessionId]['participants'];
			for( i=0; i< participants.length; i++){
				io.to(participants[i]).emit('userChange', participants);
			}
		} else {
			redisClient.get(sessionPath + sessionId, (data) => {

				if (data) {
					console.log('session restored from server.');
					collaborations[sessionId] = {
						'participants': [],
						'cachedInstructions': JSON.parse(data)
					};

				} else {
					console.log('Creating new session...');
					collaborations[sessionId] = {
						'participants':[],
						'cachedInstructions': []
					};
				}
				//given a problem id, indicate all participants
				collaborations[sessionId]['participants'].push(socket.id);

				let participants = collaborations[sessionId]['participants'];
				for( i=0; i< participants.length; i++){
					io.to(participants[i]).emit('userChange', participants);
				}
				// get all particioants of the current session
				console.log(collaborations[sessionId]['participants']);
			});

			//get here right after redisCient GET (line 26)
		}

		//socket event listeners
		// receive 'change' event from client
		socket.on('change', delta => {

			console.log('Revision ' + socketIdToSessionId[socket.id] + ': ' + delta);
			let sessionId = socketIdToSessionId[socket.id];

			// forward to all participants, excluding the sender
			if(sessionId in collaborations){
				collaborations[sessionId]['cachedInstructions'].push(
					["change", delta, Date.now()]);

				let participants = collaborations[sessionId]['participants'];
				for(let i=0; i<participants.length; i++){
					if(socket.id != participants[i]){
						io.to(participants[i]).emit('change', delta);
					}
				}
			}else{
				console.log('warning: could not find socket id in collaborations');
			}
		});

		// radis buffer; when receive restoreBuffer event from client
		socket.on('restoreBuffer', () => {
			let sessionId = socketIdToSessionId[socket.id];
			console.log('restore buffer for sesssion-' + sessionId +' and socket-'+ socket.id);

			if(sessionId in collaborations){
				let instructions = collaborations[sessionId]['cachedInstructions'];

				for (let i =0; i<instructions.length ; i++){
					socket.emit(instructions[i][0], instructions[i][1]);
				}
			}else{
				console.log('no collaboration found for this socket');
			}
		});
		// when client disconnect from the server
		socket.on('disconneted', () => {
			let sessionId = socketIdToSessionId[socket.id];
			console.log('dsiconnect sesssion - ' + sessionId +' and socket-'+ socket.id);

			console.log(collaborations[sessionId]['participants']);

			let found = false;

			if(sessionId in collaborations){
				let participants = collaborations[sessionId]['participants'];
				let index = participants.indexOf(socket.id);

				if(index >= 0){
					participants.splice(index, 1);
					found = true;

					//if participants = 0 this is the last one
					//leaving the session
					if(participants.length === 0){
						console.log('last participant is leaving; commit to redis')

						let key = sessionPath +sessionId;
						let value = JSON.stringify(
							collaborations[sessionId]['cachedInstructions']);

						redisClient.set(key, value, redisClient.redisPrint);
						redisClient.expire(key, TIMEOUT_IN_SECONDS);
						delete collaborations[sessionId];
					}
				}


				for( i=0; i< participants.length; i++){
					io.to(participants[i]).emit('userChange', participants);
				}
			}
			if(!found){
				console.log('warning: could not find socket id in collaborations');
			}
		});
	})
}