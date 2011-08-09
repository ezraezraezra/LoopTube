/*
 * Project:     LoopTube
 * Description: Watch synced videos together with the option of having
 *              a live video feed of an artist show up.
 * Website:     http://looptube.opentok.com
 * 
 * Author:      Ezra Velazquez
 * Website:     http://ezraezraezra.com
 * Date:        July 2011
 * 
 */

var io = require('socket.io').listen(8000);
var ut_array = new Array();

ut_array[0] = new Array("jSzT_ahH5PA", 617);
ut_array[1] = new Array("HwiqrtTBYBg", 584);
ut_array[2] = new Array("4s-eH2aJU4w", 551);
ut_array[3] = new Array("TLtSfYX8tJk", 196);

var counter = 0;
var index_array = 0;
var vid_change = false;
var mod_id = 'none';

var tester = setInterval(function() {
	if(counter == ut_array[index_array][1])
	{
		counter = 0;
		index_array = index_array + 1;
		vid_change = true;		
	}
	if(index_array == ut_array.length) {
		index_array = 0;
	}
	
	counter = counter + 1;
		
	console.log("Timer on Server: " + counter);
}, 1000);

	io.sockets.on('connection', function (socket) {
	socket.emit('values', {id: ut_array[index_array][0], time: counter });
	
	socket.on('mod_stream_added', function (data) {
		mod_id = data.id;
		console.log('moderator logged in');
	});
	
	socket.on('stream_added', function (data) {
		if(data.id == mod_id) {
			socket.emit('response', { this_is_mod : 'true' });
		}
		else {
			socket.emit('response', { this_is_mod : 'false' });
		}
	});
		
	var tester_1 = setInterval(function() {
		if(vid_change == true) {
			vid_change = false;
			socket.emit('values', {id: ut_array[index_array][0], time: counter });
			socket.broadcast.emit('values', {id: ut_array[index_array][0], time: counter });
		}
	}, 500);
});