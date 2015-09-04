<?php 


require '/vendor/autoload.php';

$client = new GuzzleHttp\Client();

$res = $client->get('http://vitali.web.cs.unibo.it/TechWeb15/ProgettoDelCorso');

$body = $res->getBody();

$doc = new DOMDocument();

$doc->loadHTML($body);

$xpath = new DOMXpath($doc);

$rows = $xpath->query('//table//tr[position()>1]');



$papersList = array();

foreach ($rows as $r) {
	
		$newPaper = array();
	
	
	$newPaper['idgroup'] = trim($xpath->query("th[1]",$r)->item(0)->nodeValue);
	$newPaper['nome'] = trim($xpath->query("th[2]",$r)->item(0)->nodeValue);

    

	$papersList[] = $newPaper;
	
	}
	
	print_r($papersList);

?>
