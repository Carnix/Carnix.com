<?php
	if($_SERVER["HTTP_HOST"] === "aribalocal.carnix.com" || $_SERVER["HTTP_HOST"] === "local.carnix.com"){
		$env = "dev";
	}else{
		$env = "prod";
	}

	if($env==="dev"){
		$servername = "localhost";
		$username = "root";
		$password = "";
		$dbname = "cxneverwinter";
	}
	else{
		$servername = "fdb17.awardspace.net";
		$username = "2461848_cloaks";
		$password = "L0927-kss2g_YYh23";
		$dbname = "2461848_cloaks";
	}

	$db = array(
		"server"=>$servername,
		"user"=>$username,
		"pass"=>$password,
		"name" => $dbname
	);

/*

//L0927-kss2g_YYh23



	check_running();
	$user=$username;
	$password=$password;

	$hosts=array(
		'localhost', '127.0.0.1', $_SERVER['HTTP_HOST'], $_SERVER['SERVER_ADDR'], $servername
	);

	foreach ($hosts as $addr) {
		try_con($addr, $user, $password);
		try_con($addr . ':3306', $user, $password);
	}

	function try_con($host, $user, $password)
	{
		$dbh=mysql_connect($host, $user, $password);
		if ($dbh) {
			print "Connected OK to $host<br />\n";
		}
		else {
			print "Failed with $host<br />\n";
		}
	}

	function check_running()
	{
	// this assumes that you are using Apache on a Unix/Linux box
		$chk=`ps -ef | grep httpd | grep -v grep`;
		if ($chk) {
			print "Checking for mysqld process: " . `ps -ef | grep mysqld | grep -v grep` . "<br />\n";
		}
		else {
			print "Cannot check mysqld process<br />\n";
		}
	}




	$connection = mysql_connect($servername,$username,$password);
	if (!$connection) {
		die('Could not connect: ' . mysql_error());
	}
	//echo 'Connected successfully';
	mysql_close($connection);
*/
	
/*
CREATE EVENT `event_update_guild_trends`
ON SCHEDULE EVERY '1' DAY
ON COMPLETION NOT PRESERVE ENABLE
DO call proceedure_update_guild_trends();

--OR Cron: mysql -u CXNeverwinter –p'X@Zs!@@0##g#t!@%@@!#%%%9z' CXNeverwinter -e 'CALL procedure_update_guild_trends()'


DROP PROCEDURE IF EXISTS `procedure_update_guild_trends`; 

DELIMITER //
CREATE PROCEDURE procedure_update_guild_trends ()
BEGIN
	DECLARE guildID, done INT;
	DECLARE memberCountPerGuild,memberCountAll,memberCountUnique INT;
	DECLARE updated DATETIME;
	DECLARE results CURSOR FOR SELECT member_of AS guild_id, count(*) AS count FROM member_characters GROUP BY member_of;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
	SET updated = NOW();
	SET done = 0;

	OPEN results;
    UpdateByGuild: LOOP
        FETCH results INTO guildID,memberCountPerGuild;
        IF done = 1 THEN
            LEAVE UpdateByGuild;
        END IF;
		INSERT INTO historical_data (guild_id,last_capture_date,last_capture_value) VALUES (guildID,updated,memberCountPerGuild);
    END LOOP UpdateByGuild;
	CLOSE results;

	SET guildID = 1;
	SELECT count(*) as Count INTO memberCountAll FROM member_characters;
    INSERT INTO historical_data (guild_id,last_capture_date,last_capture_value) VALUES (guildID,updated,memberCountAll);

	SET guildID = 2;
	SELECT count(DISTINCT handle) as Count INTO memberCountUnique FROM member_accounts;
    INSERT INTO historical_data (guild_id,last_capture_date,last_capture_value) VALUES (guildID,updated,memberCountUnique);
END //
DELIMITER ;

*/

?>