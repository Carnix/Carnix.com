<?php
	header("Content-Type: application/xml; charset=ISO-8859-1");

	require_once("includes/connection.php");
	require_once("includes/functions.inc.php");

	$pd = getPopulationData($db);
	$last_Updated = getLastUpdatedDate($db);
	$last_updated_date = date("j F Y, G:i:s",strtotime($last_Updated));

	echo '<?xml version="1.0"?>';
?>


<rdf:RDF 
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns="http://purl.org/rss/1.0/"
>
	<channel>
		<title>Cloaks Guild Stats for <?php echo $last_updated_date;?></title>
		<link>http://greycloaks.enjin.com/</link>
		<description>The Cloaks guild data feed, generated: <?php echo $last_updated_date;?></description>
	</channel>
	<item>
		<title>All Accounts: <?php echo $pd['current']['accounts']; ?> (<?php echo getSign($pd['delta']['accounts']).$pd['delta']['accounts']; ?>)</title>
		<link>#</link>
		<description><?php echo $last_updated_date;?></description>
	</item>
	<item>
		<title>All Characters: <?php echo $pd['current']['total']; ?> (<?php echo getSign($pd['delta']['total']).$pd['delta']['total']; ?>)</title>
		<link>#</link>
		<description><?php echo $last_updated_date;?></description>
	</item>
	<item>
		<title>Greycloaks: <?php echo $pd['currentacc']['greycloaks']; ?> (<?php echo getSign($pd['accdelta']['greycloaks']).$pd['accdelta']['greycloaks']; ?>) | <?php echo $pd['current']['greycloaks']; ?> (<?php echo getSign($pd['delta']['greycloaks']).$pd['delta']['greycloaks']; ?>)</title>
		<link>#</link>
		<description><?php echo $last_updated_date;?></description>
	</item>
	<item>
		<title>Whitecloaks: <?php echo $pd['currentacc']['whitecloaks']; ?> (<?php echo getSign($pd['accdelta']['whitecloaks']).$pd['accdelta']['whitecloaks']; ?>) | <?php echo $pd['current']['whitecloaks']; ?> (<?php echo getSign($pd['delta']['whitecloaks']).$pd['delta']['whitecloaks']; ?>)</title>
		<link>#</link>
		<description><?php echo $last_updated_date;?></description>
	</item>
	<item>
		<title>Blackcloaks: <?php echo $pd['currentacc']['blackcloaks']; ?> (<?php echo getSign($pd['accdelta']['blackcloaks']).$pd['accdelta']['blackcloaks']; ?>) | <?php echo $pd['current']['blackcloaks']; ?> (<?php echo getSign($pd['delta']['blackcloaks']).$pd['delta']['blackcloaks']; ?>)</title>
		<link>#</link>
		<description><?php echo $last_updated_date;?></description>
	</item> 
	<item>
		<title>Browncloaks: <?php echo $pd['currentacc']['browncloaks']; ?> (<?php echo getSign($pd['accdelta']['browncloaks']).$pd['accdelta']['browncloaks']; ?>) | <?php echo $pd['current']['browncloaks']; ?> (<?php echo getSign($pd['delta']['browncloaks']).$pd['delta']['browncloaks']; ?>)</title>
		<link>#</link>
		<description><?php echo $last_updated_date;?></description>
	</item>
	<item>
		<title>Goldlcloaks: <?php echo $pd['currentacc']['goldcloaks']; ?> (<?php echo getSign($pd['accdelta']['goldcloaks']).$pd['accdelta']['goldcloaks']; ?>) | <?php echo $pd['current']['goldcloaks']; ?> (<?php echo getSign($pd['delta']['goldcloaks']).$pd['delta']['goldcloaks']; ?>)</title>
		<link>#</link>
		<description><?php echo $last_updated_date;?></description>
	</item>
	<item>
		<title>Bluecloaks: <?php echo $pd['currentacc']['bluecloaks']; ?> (<?php echo getSign($pd['accdelta']['bluecloaks']).$pd['accdelta']['bluecloaks']; ?>) | <?php echo $pd['current']['bluecloaks']; ?> (<?php echo getSign($pd['delta']['bluecloaks']).$pd['delta']['bluecloaks']; ?>)</title>
		<link>#</link>
		<description><?php echo $last_updated_date;?></description>
	</item>
</rdf:RDF>