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

// Declare variables and click event listeners
function startJS(usr_type){
	u_type = usr_type;
	var id_map = 0;
	var socket;
	var moderator = 'n';
	var mod_id;
	var twitter_link_text = "http://twitter.com/share?original_referer=http%3A%2F%2Flocalhost%2FTokBox%2Fconcert%2Findex_2.html&source=tweetbutton&text=BLAH%20title%20here&url=http%3A%2F%2Flocalhost%2FTokBox%2Fconcert%2Findex_2.html";
	var keenan_live = false;
	var data_id;
	var data_time;
	var apiKey = 1551491;
	var sessionId;
	var sessionId_driver = '2e5d6c4860dfaff8f3c938b41a94790311dfee07';
	var token;
	var token_driver;
	var session;
	var session_driver;
	var publisher;
	var subscribers = {};
	var subscribers_array = new Array();
	var just_watch = false;
	var timer_counter = 1;
	var button_counter = 1;
	var auto_start = false;
	
	t=setTimeout(timedCount,1000);
	
	if (usr_type == 'viewer') {
		$("#button_view").click(function(){
			$("#button_view").css("visibility", "hidden");
			$("#button_participate").css("visibility", "hidden");
			just_watch = false;
			user_type = 1;
			$.post('php/join.php', {
				comm: 'join',
				user_type: '1',
				stage_num: id_map
			}, function(data){
				sessionId = data.tb_id;
				token = data.tb_token;
				unique_id = data.unique_id;
				token_driver = data.tb_dvr_tk;
				load_video_feed();
				connect();
			});
		});
		
		$("#button_participate").click(function(){
			$("#button_view").css("visibility", "hidden");
			$("#button_participate").css("visibility", "hidden");
			participate('true', 2, id_map);
		});
	}
	else {
		just_watch = false;
			user_type = 1;
			$.post('php/join.php', {
				comm: 'join',
				user_type: '1',
				stage_num: id_map
			}, function(data){
				sessionId = data.tb_id;
				token = data.tb_token;
				unique_id = data.unique_id;
				token_driver = data.tb_dvr_tk;
				console.log(token_driver);
				load_video_feed();
				artist_connect(1);
				
				$("#user_member_button").click(function() {
					console.log(button_counter);
					
					if (button_counter == 1) {
						auto_start = true;
						$("#myytplayer").css("margin-top", "-1000px");
						setVolume(0);
						artist_connect(2);
						$("#user_member_button").html('turn<br/>camera<br/>off');
					}
					else {
						if (button_counter % 2 == 1) {
							startPublishing();
							$("#user_member_button").html('turn<br/>camera<br/>off');
						}
						else {
							$("#user_member_button").html('let the<br/>crowd<br/>see me!');
							stopPublishing();
						}
					}
					button_counter += 1;
				});
			});
	}

	// Animate the speakers
	function timedCount(){
		if (timer_counter == 1) {
			timer_counter = 2;
			$(".stage_speakers").css("background-image", "url('assets/speakers.png')");
		}
		else {
			$(".stage_speakers").css("background-image", "url('assets/speakers_1.png')");
			timer_counter = 1;
		}
		
		t = setTimeout(timedCount, 2000);
	}
	
	// Declare type of user and give permission based on user
	function participate(a, b, c){
		just_watch = true;
		user_type = b;
		id_map = c;
		
		$.post('php/join.php', {
			comm: 'join',
			user_type: b,
			stage_num: c
		}, function(data){
			sessionId = data.tb_id;
			token = data.tb_token;
			unique_id = data.unique_id;
			token_driver = data.tb_dvr_tk;
			load_video_feed();
			connect();
		});
	}
	
	// Load YouTube videos & TokBox listeners
	function load_video_feed(){
		$("#ytapiplayer").css("display", "block");
		
		var params = {
			allowScriptAccess: "always",
			bgcolor: "#cccccc"
		};
		var atts = {
			id: "myytplayer"
		};
		swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer", "ytapiplayer", "640", "390", "8", null, null, params, atts);
		
		setTimeout(testtest, 3000);
		
		/*
		 * TOKBOX CODE
		 */
		
		TB.addEventListener("exception", exceptionHandler);
		
		if (TB.checkSystemRequirements() != TB.HAS_REQUIREMENTS) {
			alert("You don't have the minimum requirements to run this application." +
			"Please upgrade to the latest version of Flash.");
		}
		else {
			session = TB.initSession(sessionId);
			session_driver = TB.initSession(sessionId_driver);
			session.addEventListener('sessionConnected', sessionConnectedHandler);
			session.addEventListener('sessionDisconnected', sessionDisconnectedHandler);
			session.addEventListener('connectionCreated', connectionCreatedHandler);
			session.addEventListener('connectionDestroyed', connectionDestroyedHandler);
			session.addEventListener('streamCreated', streamCreatedHandler);
			session.addEventListener('streamDestroyed', streamDestroyedHandler);
			
			session_driver.addEventListener('sessionConnected', sessionConnectedHandler_driver);
			session_driver.addEventListener('sessionDisconnected', sessionDisconnectedHandler);
			session_driver.addEventListener('connectionCreated', connectionCreatedHandler);
			session_driver.addEventListener('connectionDestroyed', connectionDestroyedHandler);
			session_driver.addEventListener('streamCreated', streamCreatedHandler_driver);
			session_driver.addEventListener('streamDestroyed', streamDestroyedHandler_driver);
			
			if(usr_type == 'artist') {
				q=setTimeout(show_button,5000);
			}
		}
	}
	
	function show_button() {
		$("#user_member_button").css("visibility", "visible");
	}
	
	//--------------------------------------
	//  LINK CLICK HANDLERS
	//--------------------------------------
	function connect(){
		session.connect(apiKey, token);
		session_driver.connect(apiKey, token_driver);
	}
	
	function artist_connect(foo){
		if (foo == 1) {
			session.connect(apiKey, token);
		}
		else {
			session_driver.connect(apiKey, token_driver);
		}
	}
	
	function disconnect(){
		session.disconnect();
		session_driver.disconnect();
	}
	
	// Called when user wants to start publishing to the session
	function startPublishing(){
		if (!publisher) {
			if (usr_type == 'viewer') {
				$("#user_member").css("visibility", "visible");
				var parentDiv = document.getElementById("audience_head_0");
				var publisherDiv = document.createElement('div');
				publisherDiv.setAttribute('id', 'opentok_publisher');
				parentDiv.appendChild(publisherDiv);
				var publisherProps = {
					width: 130,
					height: 120,
					publishAudio: false
				};
				publisher = session.publish(publisherDiv.id, publisherProps);
				publisher.addEventListener('settingsButtonClick', settingsButtonClickHandler);
			}
			else {
			
				$("#myytplayer").css("margin-top", "-1000px");
				keenan_live = true;
				setVolume(0);
				$("#driverplayer").css("display", "block");
				$("#driverplayer").css("visibility", "visible");
				
				var parentDiv = document.getElementById("driverplayer");
				var publisherDiv = document.createElement('div'); // Create a div for the publisher to replace
				publisherDiv.setAttribute('id', 'opentok_publisher');
				parentDiv.appendChild(publisherDiv);
				var publisherProps = {
					width: 480,
					height: 303,
					publishAudio: true
				};
				publisher = session_driver.publish(publisherDiv.id, publisherProps); // Pass the replacement div id to the publish method
				publisher.addEventListener('settingsButtonClick', settingsButtonClickHandler);
			}
		}
	}
	
	function stopPublishing(){
		if (publisher) {
			session.unpublish(publisher);
		}
		publisher = null;
	}
	
	//--------------------------------------
	//  OPENTOK EVENT HANDLERS
	//--------------------------------------
	
	function sessionConnectedHandler(event){
		if (just_watch == true) {
			startPublishing();
		}
		
		// Subscribe to all streams currently in the Session
		for (var i = 0; i < event.streams.length; i++) {
			addStream(event.streams[i]);
		}
	}
	
	function sessionConnectedHandler_driver(event){
		for (var i = 0; i < event.streams.length; i++) {
			addStream_driver(event.streams[i]);
		}
		
		if (auto_start == true) {
			startPublishing();
			auto_start = false;
		}
	}
	
	function streamCreatedHandler(event){
		// Subscribe to the newly created streams
		for (var i = 0; i < event.streams.length; i++) {
			addStream(event.streams[i]);
		}
	}
	
	function streamCreatedHandler_driver(event){
		for (var i = 0; i < event.streams.length; i++) {
			addStream_driver(event.streams[i]);
		}
	}
	
	function streamDestroyedHandler(event){
		for (var i = 1; i < 10; i++) {
			if ($("#audience_head_" + i).children().size() != 0) {
				subscribers_array[i] = false;
				$("#audience_member_" + i).css("visibility", "hidden");
			}
			else {
				subscribers_array[i] = true;
			}
		}
	}
	
	function streamDestroyedHandler_driver(event){
		loadNewVideo(data_id, data_time);
		keenan_live = false;
		setVolume(100);
		$("#myytplayer").css("margin-top", "0px");
		$("#driverplayer").css("visibility", "hidden");
	}
	
	function sessionDisconnectedHandler(event){
		publisher = null;
	}
	
	function connectionDestroyedHandler(event){
		// This signals that connections were destroyed
	}
	
	function connectionCreatedHandler(event){
		// This signals new connections have been created.
	}
	
	function exceptionHandler(event){
		alert("Exception: " + event.code + "::" + event.message);
	}
	
	//--------------------------------------
	//  HELPER METHODS
	//--------------------------------------
	function addStream_driver(stream){
		if (stream.connection.connectionId == session_driver.connection.connectionId) {
			return;
		}
		
		$("#myytplayer").css("margin-top", "-1000px");
		keenan_live = true;
		setVolume(0);
		$("#driverplayer").css("display", "block");
		$("#driverplayer").css("visibility", "visible");
		
		var subscriberDiv = document.createElement('div');
		subscriberDiv.setAttribute('id', stream.streamId);
		document.getElementById("driverplayer").appendChild(subscriberDiv);
		
		var subscriberProps = {
			width: 480,
			height: 303,
			subscribeToAudio: true
		};
		subscribers[stream.streamId] = session_driver.subscribe(stream, subscriberDiv.id, subscriberProps);
	}
	
	function addStream(stream){
		// Check if this is the stream that I am publishing, and if so do not publish.
		if (stream.connection.connectionId == session.connection.connectionId) {
			return;
		}

		var subscriberDiv = document.createElement('div');
		subscriberDiv.setAttribute('id', stream.streamId);
		found_empty_div = false;
		index = 1;
		
		while (found_empty_div == false && index < 10) {
			if (subscribers_array[index] == true) {
				found_empty_div = false;
				index = index + 1;
			}
			else {
				found_empty_div = true;
				subscribers_array[index] = true;
				index = index;
				$("#audience_member_" + index).css("visibility", "visible");
			}
		}
		
		$("#audience_head_" + index).append(subscriberDiv);
		
		var subscriberProps = {
			width: 130,
			height: 120,
			subscribeToAudio: false
		};
		
		subscribers[stream.streamId] = session.subscribe(stream, subscriberDiv.id, subscriberProps);
	}
	
	function show(id){
		document.getElementById(id).style.display = 'block';
	}
	
	function hide(id){
		document.getElementById(id).style.display = 'none';
	}
	
	function settingsButtonClickHandler(event){
		event.preventDefault();
		
		var newDiv = document.createElement('div');
		newDiv.id = 'devicePanel';
		document.getElementById('user_camera_container').appendChild(newDiv);
		
		deviceManager = TB.initDeviceManager(apiKey);//1125822);
		devicePanel = deviceManager.displayPanel('devicePanel', publisher);
		devicePanel.addEventListener('closeButtonClick', closeButtonClickHandler);
		$("#user_camera_container_backdrop").css("display", "block");
		$("#user_camera_container").css("display", "block");
	}
	
	function closeButtonClickHandler(event){
		event.preventDefault();
		$("#user_camera_container").css("display", "none");
		$("#user_camera_container_backdrop").css("display", "none");
	}
	
	function testtest(){
		socket = io.connect('http://looptube.opentok.com:8000');
		socket.on('values', function(data){
			console.log(data.id);
			console.log(data.time);
			data_id = data.id;
			data_time = data.time;
			
			if (keenan_live == false) {
				loadNewVideo(data.id, data.time);
			}		
		});
	}
}

function remove_user(){
	jQuery.ajaxSetup({
		async: false
	});
	$.get('php/join.php', {
		comm: 'leave',
		table_id: unique_id,
		viewer_type: user_type
	});
	jQuery.ajaxSetup({
		async: true
	});
	
	return;
}

function onYouTubePlayerReady(playerId){
	ytplayer = document.getElementById("myytplayer");
	setInterval(updateytplayerInfo, 250);
	updateytplayerInfo();
	ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
	ytplayer.addEventListener("onError", "onPlayerError");
}
	
function onPlayerError(errorCode){
	alert("An error occured: " + errorCode);
}
	
function onytplayerStateChange(newState){
	setytplayerState(newState);
}
	
function loadNewVideo(id, startSeconds){
	if (ytplayer) {
		ytplayer.loadVideoById(id, parseInt(startSeconds));
	}
}
	
function cueNewVideo(id, startSeconds){
	if (ytplayer) {
		ytplayer.cueVideoById(id, startSeconds);
	}
}
	
function getPlayerState(){
	if (ytplayer) {
		return ytplayer.getPlayerState();
	}
}
	
function seekTo(seconds){
	if (ytplayer) {
		ytplayer.seekTo(seconds, true);
	}
}
	
function setVolume(newVolume){
	if (ytplayer) {
		ytplayer.setVolume(newVolume);
	}
}
	
function getVolume(){
	if (ytplayer) {
		return ytplayer.getVolume();
	}
}
	
function clearVideo(){
	if (ytplayer) {
		ytplayer.clearVideo();
	}
}