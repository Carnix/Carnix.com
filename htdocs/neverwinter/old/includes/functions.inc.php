<?php
	define("INACTIVE_DAYS",21);


	function getAccessKey(){
		return "KSCS-S9L6-GVH3-712X-JKTC-54KZ";
	}

	function getAccountCount($guild, $db){
		$output = "0";
		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);

		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		$fieldname = $guild . "_accounts";

		$sql = "SELECT $fieldname as Count FROM trends";
		$result = $conn->query($sql);
		while($row = $result->fetch_assoc()){ $output = $row["Count"]; }

		$conn->close();
		return $output;
	}

	function getLastUpdatedDate($db){
		$output = "0";
		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);

		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		$sql = "SELECT updated FROM trends ORDER BY id DESC LIMIT 1;";
		$result = $conn->query($sql);
		while($row = $result->fetch_assoc()){ $output = $row["updated"]; }

		$conn->close();
		return $output;
	}

	function getPopulationCount($flag, $db){
		$output = "0";
		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);

		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		if($flag != "characters" && $flag != "accounts"){
			$sql = "SELECT count(*) as Count FROM member_characters INNER JOIN guilds ON member_characters.member_of=guilds.guild_id WHERE guilds.name='$flag'";
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){ $output = $row["Count"]; }
		}
		elseif($flag == "characters"){
			$sql = "SELECT count(*) as Count FROM member_characters";
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){ $output = $row["Count"]; }
		}
		elseif($flag == "accounts"){
			$sql = "SELECT count(DISTINCT handle) as Count FROM member_accounts";
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){ $output = $row["Count"]; }
		}
		$conn->close();
		return $output;
	}

	function getPreviousAccountCount($guild, $db){
		$output = "0";
		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		$fieldname = $guild . "_accounts";
		$sql = "SELECT $fieldname as Count FROM trends ORDER BY id DESC LIMIT 1,1";
		$result = $conn->query($sql);
		while($row = $result->fetch_assoc()){ $output = $row["Count"]; }
		$conn->close();
		return $output;
	}


	function getPreviousPopulationCount($flag, $db){
		$output = "0";
		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		if($flag != "characters" && $flag != "accounts"){
			$sql = "SELECT count(*) as Count FROM member_characters_previous INNER JOIN guilds ON member_characters_previous.member_of=guilds.guild_id WHERE guilds.name='$flag'";
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){ $output = $row["Count"]; }
		}
		elseif($flag == "characters"){
			$sql = "SELECT count(*) as Count FROM member_characters_previous";
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){ $output = $row["Count"]; }
		}
		elseif($flag == "accounts"){
			$sql = "SELECT count(DISTINCT handle) as Count FROM member_accounts_previous";
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){ $output = $row["Count"]; }
		}
		$conn->close();
		return $output;
	}


	function downloadKickList($guild, $db){
		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		$filename = $guild. ".txt";
		$file = fopen("kicklists/".$filename, "w") or die("Unable to open file!");
		$content = $guild." kicklist, generated: ".  date("Y-m-d H:i:s", time()) . "\n\n";

		$sql = "SELECT character_name_full, last_seen, rank, rank_name FROM member_characters INNER JOIN guilds ON member_characters.member_of=guilds.guild_id WHERE guilds.name='".$guild."'";
		$result = $conn->query($sql);
		while($row = $result->fetch_assoc()){
			$now = time();
			$your_date = strtotime($row["last_seen"]);
			$datediff = $now - $your_date;
			$days_inactive = floor($datediff/(60*60*24));
			if($days_inactive >= INACTIVE_DAYS){
				$content .= "/guild_kick \"" . $row["character_name_full"] . "\"\n";
				$forumpost .= "[tr][td]". $row["character_name_full"] ."[/td][td]Rank ". $row["rank"] . " (" .$row["rank_name"].")[/td][td]".$days_inactive." days ago[/td][/tr]\n";
			}
		}
		$forumpost = "\n\n\n\n\n[b]".$guild."[/b]\n[table]\n[tr][td]Character[/td][td]Rank[/td][td]Last Logout[/td][/tr]\n" . $forumpost . "[/table]";
		fwrite($file, $content);
		fwrite($file, $forumpost);
		fclose($file);

		$conn->close();
		return $filename;
	}


	function json_to_xml($json) {
		$serializer = new XML_Serializer();
		$obj = json_decode($json);
		if ($serializer->serialize($obj)) {
			return $serializer->getSerializedData();
		}
		else {
			return null;
		}
	}

	function process_json($json){
		try{
			$obj = json_decode($json);
		}
		catch(Exception $e){
			echo 'Caught exception: ',  $e->getMessage(), "\n";
			exit;
		}
		if($obj){return $obj;}
		else{
			echo "JSON Error: " . $obj;
//			echo $json;
//			echo "<br>";
//			echo $obj;
			exit;
		}
		
	}

	function preprocess_data($raw){
		$json = substr($raw, 4); //clip the stupid characters off the front
		//if(get_magic_quotes_gpc()){ //just in case there's bad voodoo
		//$json = stripslashes($_POST['param']);
		//}

		return $json;
	}

	function update_database($jsonobj,$db,$updateTrendsOnly){
		set_time_limit(90);
		//if($updateTrendsOnly === TRUE){ return TRUE; } //PUNT!

		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		$guild_name = $jsonobj->args[0]->id;
		$guild_id = $jsonobj->args[0]->container->id;

		//UPDATE MEMBERSHIP DATA
		$memberlist = $jsonobj->args[0]->container->members;

		foreach($memberlist as $member){
			$account_id = $member->id;
			$character = $member->name;
			$handle = $member->publicaccountname;
			$rank = $member->rank + 1; //NW indexes by 0 for some dumb reason
			$rank_name = $member->officerrank;
			$date_joined = date("Y-m-d H:i:s", strtotime($member->joined));
			$date_last_seen = date("Y-m-d H:i:s", strtotime($member->logouttime));
			$character_name_full = $character.$handle;


			$sql = 'INSERT INTO member_accounts (member_id, handle, characters_in_guild)
					VALUES (
						"'.$account_id.'",
						"'.$handle.'",
						(SELECT Count( * ) FROM member_characters WHERE handle = "$handle")
					)
					ON DUPLICATE KEY UPDATE
							characters_in_guild=(SELECT Count( * ) FROM member_characters WHERE handle = "'.$handle.'")
					';

			if ($conn->query($sql) === TRUE) {}
			else{}

			$sql = 'INSERT INTO member_characters (character_name_full, character_name, handle, joined, last_seen, member_id, member_of, rank, rank_name)
					VALUES	(
						"'.$character_name_full.'",
						"'.$character.'",
						"'.$handle.'",
						"'.$date_joined.'",
						"'.$date_last_seen.'",
						"'.$account_id.'",
						"'.$guild_id.'",
						"'.$rank.'",
						"'.$rank_name.'"
					)
					ON DUPLICATE KEY UPDATE
						joined="'.$date_joined.'",
						last_seen="'.$date_last_seen.'",
						rank="'.$rank.'",
						rank_name="'.$rank_name.'"
			';

			//echo $sql;

			if ($conn->query($sql) === TRUE){}else{}
			
			//Just run a quick cleanup incase new characters were added to an existing account.
			$sql = 'UPDATE member_accounts SET characters_in_guild=(SELECT Count( * ) FROM member_characters WHERE handle = "'.$handle.'") WHERE handle = "'.$handle.'";';
			if ($conn->query($sql) === TRUE) {} else {}
		}

		//UPDATES GUILD ACTIVITY
		$activitylist = $jsonobj->args[0]->container->activityentries;

		foreach($activitylist as $activity){
			$activity_time = date("Y-m-d H:i:s", strtotime($activity->time));
			$activity_type = $activity->type;
			$activity_text = $activity->string;
			$activity_text = str_replace("'", "''", $activity_text);
			$guid = hash('md5', $activity_type.$activity_time.$activity_text);
			$sql = 'INSERT IGNORE INTO activity (guild_id, activity_type, activity_text, activity_time, guid)
					VALUES (
						"'.$guild_id.'",
						"'.$activity_type.'",
						"'.$activity_text.'",
						"'.$activity_time.'",
						"'.$guid.'"
					)';
			if ($conn->query($sql) === TRUE) {}
			else{}
		}
		$conn->close();
		return TRUE;
	}

	function getPopulationTrendsTable($guild_id, $db){
		$limit = 7;
		$deltaStyle = "";
		$showDeltas = FALSE;//hide this since it's broken....

		$output = "";
		$lastCounts = array(
			"accounts"=> 0,
			"characters"=> 0,
			"greycloaks"=> 0,
			"whitecloaks" => 0,
			"blackcloaks" => 0,
			"browncloaks" => 0,
			"goldcloaks" => 0,
			"bluecloaks" => 0,
		);

		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}


		if($guild_id === 1){//All Characters
			$sql = "SELECT total_characters, updated FROM trends ORDER BY updated DESC LIMIT " . $limit;
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){
				$change = ($row['total_characters'] * 1) - $lastCounts['characters'];

				$output .= '<tr><td>'. date("Y-m-d", strtotime($row["updated"])) . '</td><td>' . $row['total_characters'] . '</td></tr>';
				$lastCounts['characters'] = ($row['total_characters'] * 1);
			}
		}
		elseif($guild_id === 2){//All Accounts
			$sql = "SELECT total_accounts, updated FROM trends ORDER BY updated DESC LIMIT " . $limit;;
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){
				$change = ($row['total_accounts'] * 1) - $lastCounts['accounts'];
				$output .= '<tr><td>'. date("Y-m-d", strtotime($row["updated"])) . '</td><td>' . $row['total_accounts'] . '</td></tr>';
				$lastCounts['accounts'] = ($row['total_accounts'] * 1);
			}
		}
		else{//Counts by guild
			$sql = 'SELECT name FROM guilds WHERE guild_id='.$guild_id;
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){
				$guild_name = strtolower($row['name']);
			}

			$sql = "SELECT ".$guild_name."_accounts, ".$guild_name."_characters, updated FROM trends ORDER BY updated DESC LIMIT " . $limit;
			$result = $conn->query($sql);

			while($row = $result->fetch_assoc()){
				$change = ($row[$guild_name."_characters"] * 1) - $lastCounts[$guild_name];
				$output .= '<tr><td>' . date("Y-m-d", strtotime($row["updated"])) . '</td><td>' . $row[$guild_name."_accounts"] . '</td><td>' . $row[$guild_name."_characters"] . '</td></tr>';
				$lastCounts[$guild_name] = ($row[$guild_name."_characters"] * 1);

			}
		}

		$conn->close();

		$deltahack = "";
		if($showDeltas === FALSE){$deltahack = '<style>.delta{display:none;}</style>';}
		if($guild_id == 1 || $guild_id == 2){
			return '<table class="trendingTable"><tr><th>Date</th><th>Count</th><th class="delta">Change</th></tr>' . $output . '</table>'.$deltahack;
		}
		else{
			return '<table class="trendingTable byGuildView"><tr><th>Date</th><th>Accounts</th><th>Characters</th><th class="delta">Change</th></tr>' . $output . '</table>'.$deltahack;
		}		
	}


	function getPopulationTrends($guild_id, $db, $use_characters){
		$ydata = array();
		$xdata = array();
		$output = "";
		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}


		if($guild_id === 1){//All Characters
			$sql = "SELECT total_characters, updated FROM trends";
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){
				array_push($ydata,$row['total_characters']);
				array_push($xdata,strtotime($row["updated"]));
			}
		}
		elseif($guild_id === 2){//All Accounts
			$sql = "SELECT total_accounts, updated FROM trends";
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){
				array_push($ydata,$row['total_accounts']);
				array_push($xdata,strtotime($row["updated"]));
			}
		}
		else{//Counts by guild
			$sql = "SELECT name FROM guilds WHERE guild_id = $guild_id";
			$result = $conn->query($sql);
			while($row = $result->fetch_assoc()){
				$guild_name = strtolower($row['name']);
			}

			$sql = "SELECT ".$guild_name."_characters,".$guild_name."_accounts, updated FROM trends";
			$result = $conn->query($sql);

			while($row = $result->fetch_assoc()){
				$count = $row[$guild_name."_accounts"];
				if($use_characters == 1){
					$count = $row[$guild_name."_characters"];
				}
				array_push($ydata,$count);
				array_push($xdata,strtotime($row["updated"]));
			}
		}
		$conn->close();

		$dateUtils = new DateScaleUtils();
		
		// Setup a basic graph
		$width=500; $height=300;
		$graph = new Graph($width, $height);

		// We set the x-scale min/max values to avoid empty space
		// on the side of the plot
		if($guild_id > 2){//by guild view
			$graph->SetScale('intlin',0,max($ydata),min($xdata),max($xdata));
		}
		else{
			$graph->SetScale('intlin',0,max($ydata)*1.25,min($xdata),max($xdata));
		}

		$graph->SetMargin(40,10,10,10);//left,right,top,bottom
//		$graph->SetMargin(40,10,10,100);//If x-axis is not hidden
		
		// Setup the titles
//		$graph->title->SetFont(FF_ARIAL,FS_BOLD,12);
		$graph->title->SetFont(FF_FONT2,FS_ITALIC,12);


		$graph->title->Set('Accounts');
		if($use_characters == 1){
			$graph->title->Set('Characters');
		}
		if($guild_id === 1 || $guild_id === 2){
			$graph->title->Set('');
		}

//		$graph->subtitle->SetFont(FF_ARIAL,FS_ITALIC,10);
		$graph->subtitle->SetFont(FF_FONT2,FS_ITALIC,8);

		$graph->subtitle->Set('');
		
		// Setup the labels to be correctly format on the X-axis

		$graph->xaxis->SetFont(FF_FONT2,FS_ITALIC,8);
		//$graph->xaxis->SetFont(FF_ARIAL,FS_NORMAL,8);//pretty font, not available on GoDaddy.
		$graph->xaxis->SetLabelAngle(90);
		
		// The second paramter set to 'true' will make the library interpret the
		// format string as a date format. We use a Month + Year format
		$graph->xaxis->SetLabelFormatString('Y-m-d',true);
		$graph->xaxis->HideLabels(true);//hides the labels


		// Get manual tick every second year
		list($tickPos,$minTickPos) = $dateUtils->getTicks($xdata,DSUTILS_DAY1);  //DSUTILS_DAY1, DSUTILS_WEEK1
		$graph->xaxis->SetTickPositions($tickPos,$minTickPos);

		// First add an area plot
		$lp1 = new LinePlot($ydata,$xdata);
		$lp1->SetWeight(0);
		$lp1->SetFillColor('orange@0.85');
		$graph->Add($lp1);
		
		// And then add line. We use two plots in order to get a
		// more distinct border on the graph
		$lp2 = new LinePlot($ydata,$xdata);
		$lp2->SetColor('orange');
		$graph->Add($lp2);
		
		// And send back to the client
		$graph->Stroke();
	}

	function processDataFile($file,$db){
		$json_file = fopen($file, "r") or die("Unable to open file!");
		$json_list = fread($json_file,filesize($file));
		$json_array = explode("\n", $json_list);

		$tmpdirpath = getcwd() . '/guild_data/tmp';
		if(!file_exists($tmpdirpath)){
			$mktmpdir = mkdir(getcwd() . '/guild_data/tmp', 0660);
		}

		$inc = 0;
		$timestamp = microtime();
		$timestamp = str_replace(".","_",$timestamp);
		$timestamp = str_replace(" ","_",$timestamp);
		$tmpmanifest = fopen( $tmpdirpath. "/tmp_manifest_".$timestamp.".txt", "w") or die("Unable to open file!");
		while (list(,$json_string) = each($json_array)){
			$tmpfile = $tmpdirpath. "/tmp_".$timestamp.$inc.".json";
			$tmphandle = fopen($tmpfile, "w") or die("Unable to open file!");
			fwrite($tmphandle, $json_string);
			fclose($tmphandle);
			fwrite($tmpmanifest, $tmpfile."\n");
			$inc++;
		}
		fclose($tmpmanifest);

		return $timestamp;
	}

	function jsonProcDispatch($currentStep,$fileid,$db,$updateTrendsOnly){
		$result = 'FAILURE <a href="?step='.$currentStep.'&fileid='.$fileid.'">Try Again</a>';

		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}
		$sql = "SELECT count(id) AS Count FROM guilds";
		$result = $conn->query($sql);
		while($row = $result->fetch_assoc()){ $guild_count = $row["Count"]; }
		$trendUpdateStep = $guild_count + 1;

		$tmpdirpath = getcwd() . '/guild_data/tmp';
		$manifest_file = $tmpdirpath. "/tmp_manifest_".$fileid.".txt";
		$manifest = fopen($manifest_file, "r") or die("Unable to open manifest!");
		$manifest_content = fread($manifest,filesize($manifest_file));
		fclose($manifest);

		$filelist = preg_split("/\n/",$manifest_content);

		$inc = 0;

		if($currentStep === 0){
			$sql = "TRUNCATE TABLE member_characters";
			if ($conn->query($sql) === TRUE){}else{}
			$sql = "TRUNCATE TABLE member_accounts";
			if ($conn->query($sql) === TRUE){}else{}
		}

		if($currentStep < $guild_count){
			while (list(,$filename) = each($filelist)){
				if($filename !== "" && $currentStep === $inc){
					$results_from_processor = processJSONFile($filename,$db,$updateTrendsOnly);
					if($results_from_processor === TRUE){
						$filename = str_replace('\\', '/', $filename);;
						$filename_parts = explode('/',$filename);
						$filename_itself = array_pop($filename_parts);
						$result = 'SUCCESS (' . $filename_itself . ').<br>Next step will begin in a second, or <a href="?step='. ($currentStep+1) .'&fileid='.$fileid.'">Click Here</a>';
					}
				}
				$inc++;
			}
		}
		else{
			updatePopulationTrends($fileid,$db);

			$files = glob($tmpdirpath.'/*');
			foreach($files as $file){
				if(is_file($file)){
					unlink($file);
				}
			}

			$result = 'DONE';
		// Ok, no more files up update, but need to update the trending system.

		}


		return $result;
	}


	function updatePopulationTrends($manifest_id, $db){
		$output = "0";
		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		$sql = "INSERT INTO trends (manifest_id) VALUES('$manifest_id')";
		if ($conn->query($sql) === TRUE){}else{}

		$sql_guilds_ids = "SELECT guild_id, name FROM guilds";
		$result = $conn->query($sql_guilds_ids);
		while($row = $result->fetch_assoc()){
			$guild_id = $row["guild_id"];
			$guild_name = strtolower($row["name"]);

			//updates character count by guild
			$sql2 = 'SELECT count(*) as Count FROM member_characters WHERE member_of = ' . $guild_id;
			$result2 = $conn->query($sql2);
			while($row2 = $result2->fetch_assoc()){
				$sql3 = 'UPDATE trends SET '.$guild_name.'_characters='. $row2['Count'] .' WHERE manifest_id="' . $manifest_id . '"';
				$result3 = $conn->query($sql3);
			}

			//updates account count by guild
			$sql2 = 'SELECT count(DISTINCT handle) as Count FROM member_characters WHERE member_of = ' . $guild_id;
			$result2 = $conn->query($sql2);
			while($row2 = $result2->fetch_assoc()){
				$sql3 = 'UPDATE trends SET '.$guild_name.'_accounts='. $row2['Count'] .' WHERE manifest_id="' . $manifest_id . '"';
				$result3 = $conn->query($sql3);
			}

			//updates total characters
			$sql2 = "SELECT count(*) as Count FROM member_characters";
			$result2 = $conn->query($sql2);
			while($row2 = $result2->fetch_assoc()){
				$sql3 = 'UPDATE trends SET total_characters='. $row2['Count'] .' WHERE manifest_id="' . $manifest_id . '"';
				$result3 = $conn->query($sql3);
			}
			//updates total accounts
			$sql2 = "SELECT count(DISTINCT handle) as Count FROM member_accounts";
			$result2 = $conn->query($sql2);
			while($row2 = $result2->fetch_assoc()){
				$sql3 = 'UPDATE trends SET total_accounts='. $row2['Count'] .' WHERE manifest_id="' . $manifest_id . '"';
				$result3 = $conn->query($sql3);
			}

		}
		$sql4 = 'UPDATE trends SET updated="'. date("Y-m-d H:i:s", time()) .'" WHERE manifest_id="' . $manifest_id . '"';
		$result4 = $conn->query($sql4);
		$conn->close();
		return $output;
	}

	function jsonUpdateFirstRun($db){
		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		$sql = "DROP TABLE member_characters_previous;";
		if ($conn->query($sql) === TRUE){}else{}
		$sql = "CREATE TABLE member_characters_previous LIKE member_characters;";
		if ($conn->query($sql) === TRUE){}else{}
		$sql = "INSERT INTO member_characters_previous SELECT * FROM member_characters;";
		if ($conn->query($sql) === TRUE){}else{}
		$sql = "DROP TABLE member_accounts_previous;";
		if ($conn->query($sql) === TRUE){}else{}
		$sql = "CREATE TABLE member_accounts_previous LIKE member_accounts;";
		if ($conn->query($sql) === TRUE){}else{}
		$sql = "INSERT INTO member_accounts_previous SELECT * FROM member_accounts;";
		if ($conn->query($sql) === TRUE){}else{}

		$conn->close();
		return true;
	}


	function processJSONFile($file,$db,$updateTrendsOnly){
		$result = FALSE;
		$json_file = fopen($file, "r") or die("Unable to open file!");
		$json_string = fread($json_file,filesize($file));
		fclose($json_file);
		$json = preprocess_data($json_string);
		$jsonobj = process_json($json);

		if($jsonobj){
			$result = update_database($jsonobj,$db,$updateTrendsOnly);
		}
		else{
//			echo "<div>There was an error, no update occured!<div>";
//			echo "<div>json:<br> <textarea style='width:60%; height:100px'>".$json."</textarea></div>";
//			echo "<div>raw:<br><textarea style='width:60%; height:100px'>".$json_string."</textarea></div>";
		}

		return $result;
	}

	function getGuildActivity($guild_id,$db){
		$output = "";
		$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}
		$sql = "SELECT activity_text, activity_type, activity_time FROM activity WHERE guild_id=$guild_id ORDER BY activity_time desc";
		$result = $conn->query($sql);
		while($row = $result->fetch_assoc()){
			$output .= "<tr><td>" . $row['activity_type'] . "</td><td>" . $row['activity_text'] . "</td><td>" . $row['activity_time'] . "</td></tr>";
		}
		$output = "<table>".$output."</table>";
		return $output;
	}

	function verifyUploadedFile($uploadedfile){
		$filehandle = fopen($uploadedfile, "r") or die("Unable to open file!");
		$filecontents = fread($filehandle,filesize($uploadedfile));
		fclose($filehandle);
		$signature =  substr($filecontents, 0, 5);
		if($signature === "5:::{"){
			return TRUE;
		}
		else{
			return FALSE;
		}
	}

	function getDeltaStyle($delta, $mods){
		$output = "neutral";
		if($delta < 0){
			$output = 'negative';
		}
		elseif($delta > 0){
			$output = 'positive';
		}

		return $mods['prepend'] . $output . $mods['append'];
	}

	function getDelta($current,$previous){
		return $current - $previous;
	}

	function getPopulationData($db){
		$output = array(); //create the array.

		$output['current'] = array(
			"total" => getPopulationCount("characters", $db),
			"accounts" => getPopulationCount("accounts", $db),
			"greycloaks" => getPopulationCount("Greycloaks", $db),
			"whitecloaks" => getPopulationCount("Whitecloaks", $db),
			"goldcloaks" => getPopulationCount("Goldcloaks", $db),
			"browncloaks" => getPopulationCount("Browncloaks", $db),
			"blackcloaks" => getPopulationCount("Blackcloaks", $db),
			"bluecloaks" => getPopulationCount("Bluecloaks", $db)
		);

		$output['currentacc'] = array(
			"greycloaks" => getAccountCount("greycloaks", $db),
			"whitecloaks" => getAccountCount("whitecloaks", $db),
			"goldcloaks" => getAccountCount("goldcloaks", $db),
			"browncloaks" => getAccountCount("browncloaks", $db),
			"blackcloaks" => getAccountCount("blackcloaks", $db),
			"bluecloaks" => getAccountCount("bluecloaks", $db)
		);

		$output['previous'] = array(
			"total" => getPreviousPopulationCount("characters", $db),
			"accounts" => getPreviousPopulationCount("accounts", $db),
			"greycloaks" => getPreviousPopulationCount("Greycloaks", $db),
			"whitecloaks" => getPreviousPopulationCount("Whitecloaks", $db),
			"goldcloaks" => getPreviousPopulationCount("Goldcloaks", $db),
			"browncloaks" => getPreviousPopulationCount("Browncloaks", $db),
			"blackcloaks" => getPreviousPopulationCount("Blackcloaks", $db),
			"bluecloaks" => getPreviousPopulationCount("Bluecloaks", $db)
		);

		$output['accprevious'] = array(
			"greycloaks" => getPreviousAccountCount("greycloaks", $db),
			"whitecloaks" => getPreviousAccountCount("whitecloaks", $db),
			"goldcloaks" => getPreviousAccountCount("goldcloaks", $db),
			"browncloaks" => getPreviousAccountCount("browncloaks", $db),
			"blackcloaks" => getPreviousAccountCount("blackcloaks", $db),
			"bluecloaks" => getPreviousAccountCount("bluecloaks", $db)
		);

		$output['delta'] = array(
			"total" => getDelta($output['current']['total'],$output['previous']['total']),
			"accounts" => getDelta($output['current']['accounts'],$output['previous']['accounts']),
			"greycloaks" => getDelta($output['current']['greycloaks'],$output['previous']['greycloaks']),
			"whitecloaks" => getDelta($output['current']['whitecloaks'],$output['previous']['whitecloaks']),
			"goldcloaks" => getDelta($output['current']['goldcloaks'],$output['previous']['goldcloaks']),
			"browncloaks" => getDelta($output['current']['browncloaks'],$output['previous']['browncloaks']),
			"blackcloaks" => getDelta($output['current']['blackcloaks'],$output['previous']['blackcloaks']),
			"bluecloaks" => getDelta($output['current']['bluecloaks'],$output['previous']['bluecloaks'])
		);

		$output['accdelta'] = array(
			"greycloaks" => getDelta($output['currentacc']['greycloaks'],$output['accprevious']['greycloaks']),
			"whitecloaks" => getDelta($output['currentacc']['whitecloaks'],$output['accprevious']['whitecloaks']),
			"goldcloaks" => getDelta($output['currentacc']['goldcloaks'],$output['accprevious']['goldcloaks']),
			"browncloaks" => getDelta($output['currentacc']['browncloaks'],$output['accprevious']['browncloaks']),
			"blackcloaks" => getDelta($output['currentacc']['blackcloaks'],$output['accprevious']['blackcloaks']),
			"bluecloaks" => getDelta($output['currentacc']['bluecloaks'],$output['accprevious']['bluecloaks'])
		);

		$output['delta_style'] = array(
			"total" => getDeltaStyle($output['current']['total'],array('prepend'=>'delta_','append'=>'')),
			"accounts" => getDeltaStyle($output['current']['accounts'],array('prepend'=>'delta_','append'=>'')),
			"greycloaks" => getDeltaStyle($output['accdelta']['greycloaks'],array('prepend'=>'delta_','append'=>'')),
			"whitecloaks" => getDeltaStyle($output['accdelta']['whitecloaks'],array('prepend'=>'delta_','append'=>'')),
			"goldcloaks" => getDeltaStyle($output['accdelta']['goldcloaks'],array('prepend'=>'delta_','append'=>'')),
			"browncloaks" => getDeltaStyle($output['accdelta']['browncloaks'],array('prepend'=>'delta_','append'=>'')),
			"blackcloaks" => getDeltaStyle($output['accdelta']['blackcloaks'],array('prepend'=>'delta_','append'=>'')),
			"bluecloaks" => getDeltaStyle($output['accdelta']['bluecloaks'],array('prepend'=>'delta_','append'=>''))
		);

		return $output;
	}

	function getSign($num){
		$output = "";//zero and negatives already render as expected
		if($num > 0){
			$output = '+';
		}
		return $output;
	}

?>
