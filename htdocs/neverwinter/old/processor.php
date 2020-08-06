<?php
	require_once("includes/connection.php");
	require_once("includes/functions.inc.php");

	$error = 0;
	$error_message = "";
	$message = "";
	$fileid = "";
	$step = "";
	$updateTrendsOnly = FALSE;

	if(isset($_GET['updatetrendsonly']) && $_GET['updateTrends'] == "yes"){
		$updateTrendsOnly === TRUE;
	}


	if(isset($_GET['step'])){
		$step = $_GET['step'] * 1;
		$message .= '<div>Currently processing step: ' . ($step + 1) . ' of 7</div>';

	}
	else{
		$error = 1;
		$error_message = "Invalid request 00001";
	}

	if(isset($_GET['fileid'])){
		$fileid = strip_tags($_GET['fileid']);
		$message .= '<div>Currently processing file ID: ' . $fileid . '</div>';
	}
	else{
		$error = 1;
		$error_message = "Invalid request 00002";
	}

	if($error === 0){
		$result = jsonProcDispatch($step,$fileid,$db,$updateTrendsOnly);
		$message .= '<div>Processing Result: ' . $result . '</div>';
	}

//0_56896900_1422288267

?>
<!DOCTYPE html>
	<html lang="en">
	<?php
		$pagetitle = "Neverwinter Guild Information Center - Data Processor";
		include_once("includes/header.php");
	?>
	<body>
		<div class="container">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<h1>Data Processor</h1>
			</div>
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div class="panel panel-default">
					<div class="panel-body">
					<?php
						if($error > 0){
							echo '<p class="label label-danger">' . $error_message . '</p>';
						}
						else{
							echo '<div class="messages">' . $message . '</div>';
						}
					?>
					</div>
				</div>
			</div>
		</div>


		<script type="text/javascript">
			var cxCloaks = new Carnix.Neverwinter({});
			setTimeout(function(){
				var step = '<?php echo $step ?>';
				if((step*1) === 6){
					top.location.href="roster.php";
				}
				else{
					window.location.href="processor.php?step=<?php echo ($step + 1); ?>&fileid=<?php echo $fileid; ?>";
				}
			},5000);
		</script>

	</body>
</html>