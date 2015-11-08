<?php 

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
		$newPaper['references'] = $xpath->query("//*[@id='articleCitations']",$r)->item(0)->nodeValue;
		$newPaper['doi'] = $xpath->query("//*[@id='pub-id::doi']",$r)->item(0)->nodeValue;
		$newPaper['url'] = $res->getEffectiveUrl();
		$newPaper['references'] = $xpath->query("//*[@id='articleCitations']",$r)->item(0)->nodeValue;

		
	$papersList[] = $newPaper;
	}
	
