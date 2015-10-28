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
	
//	

//  /html/body/form/table[3]/tbody/tr/td/table[5]/tbody/tr/td/table[1]/tbody/tr/td[2]/h3[2]
//  /html/body/form/table[3]/tbody/tr/td/table[5]/tbody/tr/td/table[1]/tbody/tr/td[2]/p[2]

	// echo $r->nodeValue . "\n";
	// WARNING: error if the XPath expression returns NULL
	$newPaper['date'] = trim($xpath->query("//p[1]/text()",$r)->item(0)->nodeValue);
	$newPaper['title'] = trim($xpath->query("//h3[2]/text()",$r)->item(0)->nodeValue);
	
	$authors = $xpath->query("//p[2]/text()",$r);
	
	foreach($authors as $key => $author){
	    $module = $key % 3;
	    if($module === 0)
		    $newPaper['author'][] = trim($xpath->query("//p[2]/text()",$r)->item($key)->nodeValue);
	}
	
	#$newPaper['author'] = trim($xpath->query("//p[2]/text()",$r)->item(1)->nodeValue);
	#$newPaper['author'] = trim($xpath->query("//p[2]/text()",$r)->item(3)->nodeValue);
	#$newPaper['author'] = trim($xpath->query("//p[2]/text()",$r)->item(6)->nodeValue);
	
	#$newPaper['doi'] = trim($xpath->query("//p[2]/text()",$r)->item(9)->nodeValue);
	
	$references = $xpath->query("//p/a[@name]/text()",$r);
	foreach($references as $key => $reference){
	    $newPaper['references'][] = $xpath->query("//p/a[@name]",$r)->item($key)->parentNode->nodeValue;
	}
	
	$newPaper['comment'] =  trim($xpath->query("//p/b/text()",$r)->item(0)->nodeValue);
	
//		/html/body/form/table[3]/tbody/tr/td/table[5]/tbody/tr/td/table[1]/tbody/tr/td[2]/table[2]/tbody/tr/td[2]/p/b

//	/html/body/form/table[3]/tbody/tr/td/table[5]/tbody/tr/td/table[1]/tbody/tr/td[2]/p[58]/a[1]


/*	$newPaper['authors'] = trim($xpath->query("td[2]/strong/text()",$r)->item(0)->nodeValue);
	$newPaper['title'] = trim($xpath->query("td[3]/text()",$r)->item(0)->nodeValue);
	$newPaper['year'] = trim($xpath->query("td[4]/text()",$r)->item(0)->nodeValue);*/
		
	$papersList[] = $newPaper;
	}
	
print_r($papersList);
