<?php 

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
	
	$authors = trim($xpath->query("//p[2]/text()",$r);
	
	foreach($authors as $key => $author){
		$newPaper['author'][] = $author->nodeValue;
	}
	
	$newPaper['author'] = trim($xpath->query("//p[2]/text()",$r)->item(1)->nodeValue);
	$newPaper['author'] = trim($xpath->query("//p[2]/text()",$r)->item(3)->nodeValue);
	$newPaper['author'] = trim($xpath->query("//p[2]/text()",$r)->item(6)->nodeValue);
	
	$newPaper['doi'] = trim($xpath->query("//p[2]/text()",$r)->item(9)->nodeValue);
	
	$newPaper['references'] = trim($xpath->query("//p[57]",$r)->item(0)->nodeValue);
	$newPaper['references'] = trim($xpath->query("//p[58]",$r)->item(0)->nodeValue);
	
	$newPaper['comment'] =  trim($xpath->query("//p/b/text()",$r)->item(0)->nodeValue);
	
//		/html/body/form/table[3]/tbody/tr/td/table[5]/tbody/tr/td/table[1]/tbody/tr/td[2]/table[2]/tbody/tr/td[2]/p/b

//	/html/body/form/table[3]/tbody/tr/td/table[5]/tbody/tr/td/table[1]/tbody/tr/td[2]/p[58]/a[1]


/*	$newPaper['authors'] = trim($xpath->query("td[2]/strong/text()",$r)->item(0)->nodeValue);
	$newPaper['title'] = trim($xpath->query("td[3]/text()",$r)->item(0)->nodeValue);
	$newPaper['year'] = trim($xpath->query("td[4]/text()",$r)->item(0)->nodeValue);*/
		
	$papersList[] = $newPaper;
	}
	
print_r($papersList);


?>
