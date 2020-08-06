<?php
	require_once("includes/connection.php");
	require_once("includes/functions.inc.php");

	$initiate_processor = FALSE;

	if($env==="dev"){
		require("XML/Serializer.php");
	}else{
		require("includes/pear/XML/Serializer.php");
	}

	$uploadOk = 1;
	$upload_error = "";
	if(isset($_POST["submit"]) && isset($_FILES["datafile"])) {
		$target_dir = "guild_data/";
		$targed_dir_backup = "guild_data_backup/";
		$target_file = $target_dir . basename($_FILES["datafile"]["name"]);
		$target_file_backup = $targed_dir_backup . basename($_FILES["datafile"]["name"]);

		$uploadOk = 1;
		$fileType = pathinfo($target_file,PATHINFO_EXTENSION);

		if (file_exists($target_file)) {
			$upload_error .= '<div class="btn btn-warning">Sorry, file already exists.</div>';
			$uploadOk = 0;
		}

		if ($_FILES["datafile"]["size"] > 1000000) {
			$upload_error .= '<div class="btn btn-warning">Sorry, your file is too large.</div>';
			$uploadOk = 0;
		}

		if($fileType != "json") {
			$upload_error .= '<div class="btn btn-warning">Only JSON files are allowed.</div>';
			$uploadOk = 0;
		}

		if ($uploadOk == 0) {
			$upload_error .= '<div><div class="btn btn-danger">Your file was rejected.</div></div>';
		}
		else {
			if (move_uploaded_file($_FILES["datafile"]["tmp_name"], $target_file)){
				//move_uploaded_file($_FILES["datafile"]["tmp_name"], $target_file_backup)
				$fileVerified = verifyUploadedFile($target_file);
				if($fileVerified === TRUE){
					jsonUpdateFirstRun($db);
					$fileID = processDataFile($target_file,$db);
					$initiate_processor = TRUE;
				}
				else{
					$uploadOk == 0;
					$upload_error .= '<div><div class="btn btn-danger">Your file did not contain the correct signature and was rejected.</div></div>';
				}
			}
			else {
				$upload_error .= '<div><div class="btn btn-danger">Uh Oh, an internal error was detected after your file was uploaded.  Epic Fail!</div></div>';
			}
		}
	}
?>
<html>
<?php
	$pagetitle = "Neverwinter Guild Information Center - Data Input";
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
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="data_uploader">
				<h1>Input Guild Data File</h1>
				<?php
					if($uploadOk === 0){
						echo '<div>'.$upload_error.'</div>';
					}
				?>
				<p>Note:  The file must be in the correct format.  If you don't know what that format is, you shouldn't be using this tool...</p>
				<form action="getdata.php" method="post" enctype="multipart/form-data" class="form-inline" name="uploadeform">
					<div class="form-group">
						<label class="sr-only" for="datafile">Select Data File</label>
						<div class="input-group">
							<input type="file" name="datafile" id="datafile">
						</div>
					</div>
					<button type="submit" name="submit" class="btn btn-primary">Begin Upload</button>
				</form>
			</div>
		</div>

		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="processor_container"></div>
		</div>

		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="capture_container">
				<button type="button" class="btn btn-info" id="capturebutton">Launch Capture System</button>
			</div>
		</div>
		

	</div>

	<?php if($initiate_processor === TRUE){ ?>			
	<script type="text/javascript">
		$("#data_uploader").hide();
		$("#processor_container").append('<iframe style="height:100%; width:100%; border:0px" id="processor_frame">');
		$("#processor_frame").attr("src","processor.php?step=0&fileid=<?php echo $fileID; ?>");
	</script>
	<?php } ?>
	<script type="text/javascript">
		$("#capturebutton").on("click",function(){
			if($("#capturebutton").hasClass("btn-info")){
				$("#capturebutton").removeClass("btn-info").addClass("btn-warning").html("Close Capture System");
				$("#capture_container").append('<iframe width="100%" height="250" src="http://local.carnix.com/neverwinter/fetch/downloader.php"></iframe>');
			}
			else{
				$("#capturebutton").removeClass("btn-warning").addClass("btn-info").html("Open Capture System");
				$("#capture_container iframe").remove();
			}
		});
	</script>

</body>
</html>

<?php

/*

	if(isset($_POST['rawdata'])){
		if(in_array(strtolower(ini_get( 'magic_quotes_gpc' )),array( '1', 'on' ))){
			$_POST = array_map( 'stripslashes', $_POST ); //bad juju from GoDaddy.
		}

		if($_POST['rawdata'] == "TEST___DATA"){
			header('Content-Type: application/json');
			echo "{'data':{'response':'TestSuccess','request_data':'".$_POST['rawdata']."'}}";
			exit;
		}
		elseif($_POST['rawdata'] == "INVALID"){
			header('Content-Type: application/json');
			echo "{'data':{'response':'error','request_data':'You have to wait until there is data to send!'}}";
			exit;
		}
		else{
			$json = preprocess_data();

			//var_dump($json);
			//exit;
			//$xml = json_to_xml($json);
			$jsonobj = process_json($json);

			if($jsonobj){$result = update_database($jsonobj, $servername, $username, $password, $dbname);}
			else{
				echo "<div>There was an error, no update occured!<div>";
				echo "<div>jsonobj:<br><textarea style='width:60%; height:100px'>".$jsonobj."</textarea></div>";
				echo "<div>json:<br> <textarea style='width:60%; height:100px'>".$json."</textarea></div>";
				echo "<div>raw:<br><textarea style='width:60%; height:100px'>".$_POST['rawdata']."</textarea></div>";
			}
		}
	}
*/
?>