<?php

//echo phpinfo();
//exit;

	require_once('includes/connection.php');
	require_once('includes/functions.inc.php');
	require_once('includes/jpgraph/src/jpgraph.php');
	require_once('includes/jpgraph/src/jpgraph_line.php');
	require_once('includes/jpgraph/src/jpgraph_utils.inc.php');

	if(isset($_GET['uc']) && $_GET['uc'] == "1"){
		$use_characters = 1;
	}
	else{
		$use_characters = 0;
	}

	if(isset($_GET['gid'])){
		$guild_id = intval($_GET['gid']);
		getPopulationTrends($guild_id, $db, $use_characters);
	}

?>