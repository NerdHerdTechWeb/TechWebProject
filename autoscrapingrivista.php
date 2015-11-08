<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
/***
*
* NOTE: install Guzzle or use a different HTTP client
*
***/
require 'vendor/autoload.php';

$client = new GuzzleHttp\Client();

$res = $client->get('http://rivista-statistica.unibo.it/article/view/4594');

$body = $res->getBody();

$doc = new DOMDocument();

$doc->loadHTML($body);

$xpath = new DOMXpath($doc);

$rows = $xpath->query("/html/body/div");

$papersList = array();

foreach ($rows as $r) {
	
	$newPaper = array();
	
		$newPaper['title'] = $xpath->query("//*[@id='articleTitle']",$r)->item(0)->nodeValue;
		$newPaper['author'] = $xpath->query("//*[@id='authorString']",$r)->item(0)->nodeValue;
		foreach($xpath->query("//*[@id='articleCitations']//p",$r) as $key => $val){
		    $newPaper['references'][] = $xpath->query("//*[@id='articleCitations']//p",$r)->item($key)->nodeValue;
		}
		$newPaper['doi'] = $xpath->query("//*[@id='pub-id::doi']",$r)->item(0)->nodeValue;
		$newPaper['url'] = 'http://rivista-statistica.unibo.it/article/view/4594';
		
	$papersList[] = $newPaper;
	}
	
print_r($papersList);