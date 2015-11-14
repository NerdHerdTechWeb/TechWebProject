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

$res = $client->get('http://www.dlib.org/dlib/november14/beel/11beel.html');

$body = $res->getBody();

$doc = new DOMDocument();

$doc->loadHTML($body);

$xpath = new DOMXpath($doc);

$rows = $xpath->query("/html/body/form/table[3]");

$papersList = array();

foreach ($rows as $r) {
	
	$newPaper = array();
	

	// echo $r->nodeValue . "\n";
	// WARNING: error if the XPath expression returns NULL
	print_r($xpath->query("//p[1]/text()",$r)->item(0));
	$newPaper['date'] = trim($xpath->query("//p[1]/text()",$r)->item(0)->nodeValue);
	$newPaper['title'] = trim($xpath->query("//h3[2]/text()",$r)->item(0)->nodeValue);
	
	$authors = $xpath->query("//p[2]/text()",$r);
	
	foreach($authors as $key => $author){
	    $module = $key % 3;
	    if($module === 0)
		    $newPaper['author'][] = trim($xpath->query("//p[2]/text()",$r)->item($key)->nodeValue);
	}
	
	$references = $xpath->query("//p/a[@name]/text()",$r);
	foreach($references as $key => $reference){
	    $newPaper['references'][] = $xpath->query("//p/a[@name]",$r)->item($key)->parentNode->nodeValue;
	}
	
	$newPaper['comment'] =  trim($xpath->query("//p/b/text()",$r)->item(0)->nodeValue);
	$newPaper['url'] = $res->getEffectiveUrl();
	

		
	$papersList[] = $newPaper;
	}
	
#print_r($papersList);
