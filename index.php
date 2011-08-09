<?php
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

$u_type = $_GET['u'];
$user = 'viewer';

if($u_type == 'artist') {
	$user = 'artist';
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>LoopTube</title>
<!--
  _                      _____     _          
| |                    |_   _|   | |         
| |      ___   ___  _ __ | |_   _| |__   ___ 
| |     / _ \ / _ \| '_ \| | | | | '_ \ / _ \
| |____| (_) | (_) | |_) | | |_| | |_) |  __/
\_____/ \___/ \___/| .__/\_/\__,_|_.__/ \___|
                   | |                       
                   |_|                       
 
 -->
 <meta name="description" content="Live video stream and synced YouTube" />
<meta name="keywords" content="OpenTok TokBox YouTube" />
<meta name="author" content="Ezra Velazquez" />                                               
<link rel="stylesheet" type="text/css" href="css/stage.css" />
<script src="http://www.google.com/jsapi"></script>
<script src="http://static.opentok.com/v0.91/js/TB.min.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" src="libraries/io/dist/socket.io.js"></script>
<script type="text/javascript" src="js/jquery-1.5.1.min.js"></script>
<script type="text/javascript" src="js/stage.js"></script>
</head>
<script>
    google.load("swfobject", "2.1");
</script>
<script type="text/javascript">
	var ytplayer;
	var unique_id;
	var user_type;
	var u_type;
	
	$(document).ready(function() {
		startJS(<?php echo '"'.$user.'"'; ?>);
	});
</script>
<body OnUnload="remove_user()">
	<div id="container">	
		<div id="concert_container">
			<div id="user_camera_container_backdrop"></div>
			<div id="user_camera_container">
			</div>
			<div id="stage_container">
				<div class="stage_speakers"></div>
				<div id="stage_feed">
					<div id="ytapiplayer"></div>
					<div id="driverplayer"></div>
					<?php if($user == 'viewer') {
						echo <<<_END
							
						<div id="button_view" class="start_button">hang back<br/>and just watch</div>
						<div id="button_participate" class="start_button">join the dancers<br/>and the crowd</div>
_END;
					}?>
					
				</div>
				<div class="stage_speakers"></div>
				<div id="stage_floor">TOKBOX presents DANCING GOES VIRAL</div>
				<div id="smb_pole"></div>
				<div id="smb_holder">
					<iframe src="http://www.facebook.com/plugins/like.php?app_id=212876905421046&amp;href=http%3A%2F%2Fhttp%3A%2F%2Fezraezraezra.com%2Ftb%2Flooptube%2F&amp;send=false&amp;layout=button_count&amp;width=55&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:55px; height:21px;" allowTransparency="true"></iframe>
					<a href="http://twitter.com/share" class="twitter-share-button" data-text="Watch Keenan throw down some sick moves at TokTube" data-count="horizontal">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
				</div>
			</div>
			<div id="audience_container" class="checkered">
				<div class="audience_member" style="margin-left:90px;" id="audience_member_3">
					<div class="audience_head" id="audience_head_3"></div>
					<img class="audience_body" src="assets/audience_3.png"/>
				</div>
				<div class="audience_member" id="audience_member_1">
					<div class="audience_head" id="audience_head_1"></div>
					<img class="audience_body" src="assets/audience_2.png"/>
				</div>
				<?php if($user == 'artist') {
						echo <<<_END
							<div class="audience_member" id="user_member_button"">
								Let the<br/>crowd<br/>see me!
							</div>
_END;
						}
						else {
							echo  <<<_END
								<div class="audience_member" id="user_member" id="audience_member_0">
									<div class="audience_head" id="audience_head_0"></div>
									<img class="audience_body" src="assets/audience.png"/>
								</div>
_END;
						} ?>
				
				
				<div class="audience_member" id="audience_member_2">
					<div class="audience_head" id="audience_head_2"></div>
					<img class="audience_body" src="assets/audience_1.png"/>
				</div>
				<div class="audience_member" id="audience_member_4">
					<div class="audience_head" id="audience_head_4"></div>
					<img class="audience_body" src="assets/audience_1.png"/>
				</div>
				<div class="audience_member" style="margin-left:90px;" id="audience_member_8">
					<div class="audience_head" id="audience_head_8"></div>
					<img class="audience_body" src="assets/audience_3.png"/>
				</div>
				<div class="audience_member" id="audience_member_6">
					<div class="audience_head" id="audience_head_6"></div>
					<img class="audience_body" src="assets/audience_2.png"/>
				</div>
				<div class="audience_member" id="audience_member_5">
					<div class="audience_head" id="audience_head_5"></div>
					<img class="audience_body" src="assets/audience_1.png"/>
				</div>
				<div class="audience_member" id="audience_member_7">
					<div class="audience_head" id="audience_head_7"></div>
					<img class="audience_body" src="assets/audience_2.png"/>
				</div>
				<div class="audience_member" id="audience_member_9">
					<div class="audience_head" id="audience_head_9"></div>
					<img class="audience_body" src="assets/audience.png"/>
				</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>