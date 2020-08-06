<?php
	require_once("includes/connection.php");
	require_once('includes/functions.inc.php');

/*
	if(isset($_GET['do']) && $_GET['do'] == "updatetrends"){
		$conn = new mysqli($servername, $username, $password, $dbname);
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}
		$sql = "CALL procedure_update_guild_trends();";
		$results = $conn->prepare($sql);
		$results->execute();
		header("Location: trend.php");
	}
*/

	if(isset($_GET['type']) && $_GET['type'] == "character"){
		$use_characters = 1;
	}
	else{
		$use_characters = 0;
	}

?>

<!DOCTYPE html>
	<html lang="en">
	<?php
		$pagetitle = "Neverwinter Guild Information Center - Membership Trends";
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
				<h1>Cloak Empire Membership Trends</h1>
				<p><a href="roster.php">Back to Roster</a></p>
				<p>Display Guild Data:  <a href="?type=account"<?php if($use_characters != 1){echo ' class="activeGraphType"';} ?>>By Account</a> | <a href="?type=character"<?php if($use_characters == 1){echo ' class="activeGraphType"';} ?>>By Character</a></p>
			</div>
		</div>

		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>All Characters</h2>
				<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><img src="graph.php?gid=1&amp;uc=<?php echo $use_characters; ?>" class="isgraph" width="100%" data-guildid="1" data-uc="<?php echo $use_characters; ?>" data-toggle="modal" data-target="#fullgraph"></div>
				<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><?php echo getPopulationTrendsTable(1, $db); ?></div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>All Accounts</h2>
				<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><img src="graph.php?gid=2&amp;uc=<?php echo $use_characters; ?>" class="isgraph" width="100%" data-guildid="2" data-uc="<?php echo $use_characters; ?>" data-toggle="modal" data-target="#fullgraph"></div>
				<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><?php echo getPopulationTrendsTable(2, $db); ?></div>
			</div>
		</div>

		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Greycloaks</h2>
				<div class="row">
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><img src="graph.php?gid=100000006&amp;uc=<?php echo $use_characters; ?>" class="isgraph" width="100%" data-guildid="100000006" data-uc="<?php echo $use_characters; ?>" data-toggle="modal" data-target="#fullgraph"></div>
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><?php echo getPopulationTrendsTable(100000006, $db); ?></div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Goldcloaks</h2>
				<div class="row">
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><img src="graph.php?gid=500011099&amp;uc=<?php echo $use_characters; ?>" class="isgraph" width="100%" data-guildid="500011099" data-uc="<?php echo $use_characters; ?>" data-toggle="modal" data-target="#fullgraph"></div>
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><?php echo getPopulationTrendsTable(500011099, $db); ?></div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Whitecloaks</h2>
				<div class="row">
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><img src="graph.php?gid=100007950&amp;uc=<?php echo $use_characters; ?>" class="isgraph" width="100%" data-guildid="100007950" data-uc="<?php echo $use_characters; ?>" data-toggle="modal" data-target="#fullgraph"></div>
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><?php echo getPopulationTrendsTable(100007950, $db); ?></div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Blackcloaks</h2>
				<div class="row">
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><img src="graph.php?gid=500005831&amp;uc=<?php echo $use_characters; ?>" class="isgraph" width="100%" data-guildid="500005831" data-uc="<?php echo $use_characters; ?>" data-toggle="modal" data-target="#fullgraph"></div>
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><?php echo getPopulationTrendsTable(500005831, $db); ?></div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Browncloaks</h2>
				<div class="row">
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><img src="graph.php?gid=500005521&amp;uc=<?php echo $use_characters; ?>" class="isgraph" width="100%" data-guildid="500005521" data-uc="<?php echo $use_characters; ?>" data-toggle="modal" data-target="#fullgraph"></div>
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><?php echo getPopulationTrendsTable(500005521, $db); ?></div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
				<h2>Bluecloaks</h2>
				<div class="row">
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><img src="graph.php?gid=500015879&amp;uc=<?php echo $use_characters; ?>" class="isgraph" width="100%" data-guildid="500015879" data-uc="<?php echo $use_characters; ?>" data-toggle="modal" data-target="#fullgraph"></div>
					<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><?php echo getPopulationTrendsTable(500015879, $db); ?></div>
				</div>
			</div>
		</div>

		<!-- Modal -->
		<div class="modal fade" id="fullgraph" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					</div>
					<div class="modal-body"></div>
				</div>
			</div>
		</div>


	</div>

	<script type="text/javascript">
		$('#fullgraph').on('show.bs.modal', function (e) {
			var guildID = $(e.relatedTarget).data("guildid");
			var uc = $(e.relatedTarget).data("uc");
			$(".modal-body").empty().append('<img src="graph.php?gid='+guildID+'&uc='+uc+'">');
		});

		$('#fullgraph').on('hidden.bs.modal', function (e) {

		});
	</script>

  </body>
</html>