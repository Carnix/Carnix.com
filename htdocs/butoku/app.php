<?php
	$servername = 'localhost';
	$username = 'root';
	$password = '';
	$dbname = "cutmonth";

	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		die('Connection failed: ' . $conn->connect_error);
	}
	else{

		$sql = 'SELECT name, count FROM cuts';
		$result = $conn->query($sql);
		$output = '{"results": [';
		if ($result->num_rows > 0){
			while($row = $result->fetch_assoc()){
				$output .= '{ "name": "' . $row["name"] . '", "count": ' . $row["count"] . '},';
			}
		}
		else{
			echo '{"name": "none", "count": 0}';
		}
		$output .= "]}";
		$output = preg_replace("/,(?!.*,)/", "", $output);

		echo $output;
	}

	$conn->close();
?>
