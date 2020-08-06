<!DOCTYPE html>
	<html lang="en">
	<?php
		$pagetitle = "Neverwinter Guild Information Center";
		include_once("includes/header.php");
	?>

	<body>
	<div class="container">
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<?php require_once("includes/navigation.php"); ?>
			</div>
		</div>

		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<h1>Neverwinter Guild Data</h1>
				<ul class="list-group">
					<li class="list-group-item"><a href="roster.php">View Roster</a></li>
					<li class="list-group-item"><a href="activity.php">View Guild Activity</a></li>
					<li class="list-group-item"><a href="getdata.php">Upload Datafile</a></li>
				</ul>
			</div>
		</div>
	</div>
  </body>
</html>