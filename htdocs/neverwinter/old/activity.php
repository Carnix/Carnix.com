<?php
	require_once("includes/connection.php");
	require_once("includes/functions.inc.php");

	if($env==="dev"){
		require("XML/Serializer.php");
	}else{
		require("includes/pear/XML/Serializer.php");
	}
?>

<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="">
		<title>Neverwinter Guild Information Center - Activity History</title>
		<link href="/css/bootstrap.css" rel="stylesheet">
		<link href="/css/custom.css" rel="stylesheet">
		<link href="/fonts/css/font-awesome.min.css" rel="stylesheet">
		<style>
		.activity-container{
			height:200px;
			overflow-y:scroll;
		}
		.activity-container td{ padding: 5px; }
		</style>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
		<script type="text/javascript" src="/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="/neverwinter/includes/cloaks.js"></script>
	</head>

	<body>
	<div class="container">
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<?php require_once("includes/navigation.php"); ?>
			</div>
		</div>

		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<h1>Cloak Empire Activity History</h1>
			</div>

			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Greycloaks</h2>
				<div class="activity-container">
					<?php echo getGuildActivity(100000006,$db); ?>
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Whitecloaks</h2>
				<div class="activity-container">
					<?php echo getGuildActivity(100007950,$db); ?>
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Goldcloaks</h2>
				<div class="activity-container">
					<?php echo getGuildActivity(500011099,$db); ?>
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Blackcloaks</h2>
				<div class="activity-container">
					<?php echo getGuildActivity(500005831,$db); ?>
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Browncloaks</h2>
				<div class="activity-container">
					<?php echo getGuildActivity(500005521,$db); ?>
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Bluecloaks</h2>
				<div class="activity-container">
					<?php echo getGuildActivity(500015879,$db); ?>
				</div>
			</div>			

		</div>
	</div>
  </body>
</html>