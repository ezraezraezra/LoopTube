<?php
header('Content-type: application/json; charset=utf-8');
require "info.php";
require_once '../sdk/API_Config.php';
require_once '../sdk/OpenTokSDK.php';

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

if($_POST['comm'] == 'join') {
	$user_type = $_POST['user_type'];
	$stage_num = $_POST['stage_num'];

	$connection = mysql_connect($hostname, $user, $pwd);
	if(!$connection) {
		die("Error ".mysql_errno()." : ".mysql_error());
	}
	$db_selected = mysql_select_db($database, $connection);
	if(!$db_selected) {
		die("Error ".mysql_errno()." : ".mysql_error());
	}
	
	/**
	 *  PHP Talks to MySQL
	 *  A) Get first session younger than 6hrs & less than (9 people OR 199 viewers)
	 *  		1) Increase user count +1
	 *  		2) Gather data in row
	 *  B) Create new session
	 *  		1) increase user count +1
	 *  		2) Gather data in row
	 *  
	 */
	
	
	# A
	$curr_time = time();
	$counter = 0;
	if($user_type == 1) {
		$conditional = "view_num <= '199'";
		$conditional_entry = 'view_num';
		$other_entry = 'full_num';
	}
	else if ($user_type == 2) {
		$conditional = "full_num <= '9'";
		$conditional_entry = "full_num";
		$other_entry = "view_num";
	}
	
	$session_request = "SELECT * FROM looptube WHERE '$curr_time' - birth <= '26000' AND $conditional AND stage = '$stage_num' ORDER BY unique_id ASC LIMIT 1";
	$session_request = submit_info($session_request, $connection, true);
	while(($rows[] = mysql_fetch_assoc($session_request)) || array_pop($rows));
	# 1)
	foreach ($rows as $row):
		$unique_id =  "{$row['unique_id']}";
		$sess_id = "{$row['sess_id']}";
		$sess_tk = "{$row['sess_tk']}";
		$the_conditional_value = "{$row[$conditional_entry]}";
		$counter = $counter + 1;
	endforeach;
	
	# 2)
	if($counter != 0) {
		$the_conditional_value = $the_conditional_value + 1;
		$add_user = "UPDATE concert SET $conditional_entry = '$the_conditional_value' where unique_id = '$unique_id'";
		submit_info($add_user, $connection, false);
	}
	# B
	
	else {
		/*
		 * - Create TB vars
		 * - Add them to table
		 * - Populate table with neceserry data
		 */
		
		/**
	 	* Create the TokBox variables
	 	*/
		$tok_apiObj = new OpenTokSDK(API_Config::API_KEY, API_Config::API_SECRET);
		
		$tok_session = $tok_apiObj->create_session($_SERVER["REMOTE_ADDR"]);
		
		$sess_id = (string) $tok_session->getSessionId();
		$sess_tk = $tok_apiObj->generate_token();
		
		/**
		 * Add tb vars to table & increase necessary field by one.
		 */
		$the_conditional_value = 1;
		$add_user = "INSERT INTO looptube(sess_id, sess_tk, $conditional_entry, $other_entry, stage, birth) VALUES('$sess_id','$sess_tk','1', '0', '$stage_num', '$curr_time')";
		submit_info($add_user, $connection, false);
		$unique_id = mysql_insert_id($connection);
		
	}
	
	$tok_apiObj = new OpenTokSDK(API_Config::API_KEY, API_Config::API_SECRET);
	$sess_dvr_tk = $tok_apiObj->generate_token('2e5d6c4860dfaff8f3c938b41a94790311dfee07', RoleConstants::MODERATOR);
	
	
	mysql_close($connection);
	
	$arr = array("message"=>'200', "user_amount"=> $the_conditional_value, "unique_id"=>$unique_id, "tb_id"=>$sess_id, "tb_token"=>$sess_tk, "stage_num"=>$stage_num, "tb_dvr_tk"=>$sess_dvr_tk);
	$output = json_encode($arr);
	echo $output;
}
else if($_GET['comm'] == 'leave'){
	$unique_id = $_GET['table_id'];
	$viewer_type = $_GET['viewer_type'];
	
	if($unique_id != 'none') {
		$connection = mysql_connect($hostname, $user, $pwd);
		if(!$connection) {
			die("Error ".mysql_errno()." : ".mysql_error());
		}
		$db_selected = mysql_select_db($database, $connection);
		if(!$db_selected) {
			die("Error ".mysql_errno()." : ".mysql_error());
		}
		/**
		 *  PHP Talks to MySQL
		 *  A) Get first session younger than 6hrs & less than (9 people OR 199 viewers)
		 *  		1) Increase user count +1
		 *  		2) Gather data in row
		 *  B) Create new session
		 *  		1) increase user count +1
		 *  		2) Gather data in row
		 *
		 */
		if($viewer_type == '1') {
			$conditional = "view_num = view_num - '1'";
		}
		else {
			$conditional = "full_num = full_num - '1'";
		}

		$remove_user = "UPDATE looptube SET $conditional WHERE unique_id = '$unique_id'";
		submit_info($remove_user, $connection, false);
		mysql_close($connection);
	}
	
	
}
else {
	echo time();
}

function submit_info($data, $conn, $return) {
	$result = mysql_query($data,$conn);
	if(!$result) {
		die("Error ".mysql_errno()." : ".mysql_error());
	}
	else if($return == true) {
		return $result;
	}
}

?>