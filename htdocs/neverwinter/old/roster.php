<?php
	require_once("includes/connection.php");
	require_once("includes/functions.inc.php");

	if(isset($_GET['do']) && $_GET['do'] == "kicklist"){
		$file = downloadKickList($_GET['guild'],$db);
		header('Location: /neverwinter/kicklists/' . $file);
		exit;
	}

	$pd = getPopulationData($db);
?>

<!DOCTYPE html>
	<html lang="en">
	<?php
		$pagetitle = "Neverwinter Guild Information Center - Roster";
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
				<h1>Citizens of the Cloak Empire</h1>
				<p>(<a href="#roster_container">Skip to roster</a>)</p>

			</div>

			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div class="jumbotron">
					<h2>At a glance:</h2>
					<div class="row">
						<h3 class="col-xs-12 col-sm-6 col-md-6 col-lg-6 well"><strong>Players Accounts:</strong> <?php echo $pd['current']['accounts']; ?> (<span class="<?php echo $pd['delta_style']['accounts']; ?>"><?php echo $pd['delta']['accounts']; ?></span>)</h3>
						<h3 class="col-xs-12 col-sm-6 col-md-6 col-lg-6 well"><strong>Total Characters:</strong> <?php echo $pd['current']['total']; ?> (<span class="<?php echo $pd['delta_style']['total']; ?>"><?php echo $pd['delta']['total']; ?></span>)</h3>
						<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 well"><strong>Greycloaks:</strong> <?php echo $pd['currentacc']['greycloaks']; ?> (<span class="<?php echo $pd['delta_style']['greycloaks'];?>"><?php echo $pd['accdelta']['greycloaks']; ?></span>) | <?php echo $pd['current']['greycloaks']; ?> (<span class="<?php echo $pd['delta_style']['greycloaks'];?>"><?php echo $pd['delta']['greycloaks']; ?></span>)</div>
						<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 well"><strong>Whitecloaks:</strong> <?php echo $pd['currentacc']['whitecloaks']; ?> (<span class="<?php echo $pd['delta_style']['whitecloaks'];?>"><?php echo $pd['accdelta']['whitecloaks']; ?></span>) | <?php echo $pd['current']['whitecloaks']; ?> (<span class="<?php echo $pd['delta_style']['whitecloaks']; ?>"><?php echo $pd['delta']['whitecloaks']; ?></span>)</div>
						<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 well"><strong>Goldcloaks:</strong> <?php echo $pd['currentacc']['goldcloaks']; ?> (<span class="<?php echo $pd['delta_style']['goldcloaks'];?>"><?php echo $pd['accdelta']['goldcloaks']; ?></span>) | <?php echo $pd['current']['goldcloaks']; ?> (<span class="<?php echo $pd['delta_style']['goldcloaks']; ?>"><?php echo $pd['delta']['goldcloaks']; ?></span>)</div>
						<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 well"><strong>Browncloaks:</strong> <?php echo $pd['currentacc']['browncloaks']; ?> (<span class="<?php echo $pd['delta_style']['browncloaks'];?>"><?php echo $pd['accdelta']['browncloaks']; ?></span>) | <?php echo $pd['current']['browncloaks']; ?> (<span class="<?php echo $pd['delta_style']['browncloaks']; ?>"><?php echo $pd['delta']['browncloaks']; ?></span>)</div>
						<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 well"><strong>Blackcloaks:</strong> <?php echo $pd['currentacc']['blackcloaks']; ?> (<span class="<?php echo $pd['delta_style']['blackcloaks'];?>"><?php echo $pd['accdelta']['blackcloaks']; ?></span>) | <?php echo $pd['current']['blackcloaks']; ?> (<span class="<?php echo $pd['delta_style']['blackcloaks']; ?>"><?php echo $pd['delta']['blackcloaks']; ?></span>)</div>
						<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 well"><strong>Bluecloaks:</strong> <?php echo $pd['currentacc']['bluecloaks']; ?> (<span class="<?php echo $pd['delta_style']['bluecloaks'];?>"><?php echo $pd['accdelta']['bluecloaks']; ?></span>) | <?php echo $pd['current']['bluecloaks']; ?> (<span class="<?php echo $pd['delta_style']['bluecloaks']; ?>"><?php echo $pd['delta']['bluecloaks']; ?></span>)</div>
					</div>
					<h3><a href="trend.php">View Trends</a></h3>
				</div>
			</div>
		</div>

		<div class="row" id="roster_container">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div class="panel panel-default">
					<div class="panel-heading">
						<div class="row">
							<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8"><h2>Full Roster</h2></div>
							<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 filter">
								<div>Filter: <input type="text" id="filtertext"></div>
								<div>Type: <select id="filtertype"><option value="fullname">Character Name</option><option value="guild">Guild Name</option><option value="rank">Rank</option></select></div>
							</div>
						</div>
					</div>

					<table class="table" id="roster_table">
						<thead>
							<tr>
								<!--<th data-sort="string">Row</th>-->
								<th data-sort="string">Character Name</th>
								<th data-sort="string">Rank</th>
								<th data-sort="string">Member of</th>
								<th data-sort="string">Joined (Days)</th>
								<th data-sort="string">Last Seen</th>
								<th data-sort="int">Days Inactive</th>
							</tr>
						</thead>
						<tbody>

					<?php
						$conn = new mysqli($db['server'], $db['user'], $db['pass'], $db['name']);
						if ($conn->connect_error) {
						    die("Connection failed: " . $conn->connect_error);
						}

						$sql = "SELECT * FROM member_characters INNER JOIN guilds ON member_characters.member_of=guilds.guild_id ORDER BY joined";

						$result = $conn->query($sql);

						if($result->num_rows > 0) {
							while($row = $result->fetch_assoc()) {

								$full_name = $row["character_name_full"];
								$rank = $row["rank"];
								$rank_name = $row["rank_name"];
								$guild = $row["name"];
								$joined = $row["joined"];
								$last_seen = $row["last_seen"];


								$now = time();
								$start_date = strtotime($last_seen);
								$datediff = $now - $start_date;
								$days_inactive = floor($datediff/(60*60*24));

								$end_date = strtotime($joined);
								$datediff = $now - $end_date;
								$days_member = floor($datediff/(60*60*24));

								$warning_class = "";
								if($days_inactive >= INACTIVE_DAYS){
									$warning_class = "warning";
								}

								echo "<tr class='".$warning_class."' data-fullname='".$full_name."' data-guild='".$guild."' data-rank='".$rank."'>";
								//echo "<td class='increment'></td>";
								echo "<td class='fullname'>".$full_name."</td>";
								echo "<td class='rank'>".$rank." : ".$rank_name."</td>";
								echo "<td class='guild'>".$guild."</td>";
								echo "<td class='joined'>".$joined." (".$days_member.")</td>";
								echo "<td class='last_seen'>".$last_seen."</td>";
								echo "<td class='days_inactive'>".$days_inactive."</td>";
								echo "</tr>";
							}
							
						}
						else{
							echo "0 results";
						}

						$conn->close();
					?></tbody>
					</table>
				</div>

			</div>
		</div>
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<p>Download Inactive Kicklist</p>
				<ul>
					<li><a href="?do=kicklist&amp;guild=Greycloaks" target="_blank">Greycloaks</a></li>
					<li><a href="?do=kicklist&amp;guild=Whitecloaks" target="_blank">Whitecloaks</a></li>
					<li><a href="?do=kicklist&amp;guild=Blackcloaks" target="_blank">Blackcloaks</a></li>
					<li><a href="?do=kicklist&amp;guild=Browncloaks" target="_blank">Browncloaks</a></li>
					<li><a href="?do=kicklist&amp;guild=Goldcloaks" target="_blank">Goldcloaks</a></li>
					<li><a href="?do=kicklist&amp;guild=Bluecloaks" target="_blank">Bluecloaks</a></li>
				</ul>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		var cxCloaks = new Carnix.Neverwinter({});
		cxCloaks.TableHandlers();
	</script>
  </body>
</html>