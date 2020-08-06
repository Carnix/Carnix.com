<?php
	error_reporting(E_ALL);
	ini_set('display_errors', true);
	set_time_limit(30);
	$done = FALSE;

	if(isset($_GET['begin']) && $_GET['begin'] == "true"){
		require 'gateway.php';

		$configs = array(
			"greycloaks"=> 'greycloaks.php',
			"whitecloaks" => 'whitecloaks.php',
			"blackcloaks" => 'blackcloaks.php',
			"browncloaks" => 'browncloaks.php',
			"goldcloaks" => 'goldcloaks.php',
			"bluecloaks" => 'bluecloaks.php',
		);

		$filename = 'data_' . date("Y-m-d") . ".json";
		$filepath = realpath('../guild_data_backup') . '/' . $filename;
		$file = fopen($filepath, "w") or die("Unable to open file!");

		foreach($configs as $config){

			while(true){
				try{
					require($config);
					$gateway = new gateway($nwo_character .'@' .$nwo_account, false, $config);
					break;
				} catch(Exception $e){
					$gateway-> error('Daemon: ' .$e-> getMessage(), '11.0');
					
					sleep(60);
					continue;
				}
			}

			$guild = $gateway-> get('Client_RequestGuild', array(
				'id'		=>	$nwo_guildname,
				'params'	=>	array(),
			), 'Proxy_Guild');

			fwrite($file, '5:::{"name":"Proxy_Guild","args":['.json_encode($guild). ']}' . PHP_EOL);
		
		}
		$done = TRUE;
		fclose($file);
	}
?>

<html>
<body>

<?php if($done){ ?>
	<textarea name="checkstring" style="height:150px; width:950px;" wrap="off"><?php
		$datafile = fopen($filepath, "r") or die("Unable to open file!");
		$content = fread($datafile,filesize($filepath));
		fclose($datafile);
		echo $content;
	?></textarea>
	<p><a href="?begin=true">Try Again</a></p>
<?php } else { ?>
	<a href="?begin=true">Begin</a>
<?php } ?>




</body>
</html>