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
	
	$newPaper['title']['title'] = $xpath->query("//*[@id='articleTitle']",$r)->item(0)->nodeValue;
	$newPaper['title']['xpath'] = $xpath->query("//*[@id='articleTitle']",$r)->item(0)->getNodePath();
	$newPaper['title']['start'] = "0";
   	$newPaper['title']['end'] =strlen($xpath->query("//*[@id='articleTitle']",$r)->item(0)->nodeValue);
		
		$finale[] =$newPaper['title'];
			
	$newPaper['author'][] = $xpath->query("//*[@id='authorString']",$r)->item(0)->nodeValue;
	$oldPaper = $xpath->query("//*[@id='authorString']",$r)->item(0)->nodeValue;
	$newPaper['author'] = str_replace("and",",",$newPaper['author']);
		
		foreach ($newPaper['author'] as $key=>$el)
			
			if (strpos($el,",")){
				$temp =explode(",",$el);
		 		array_splice($newPaper['author'],$key,1,$temp);
			}
	
		foreach ($newPaper['author'] as $key=>$el){
			
			$basea['author']['author'] =$newPaper['author'][$key];
			$basea['author']['xpath']=$xpath->query("//*[@id='authorString']",$r)->item(0)->getNodePath();
			$basea['author']['start'] =stripos($oldPaper,$newPaper['author'][$key]);
			$basea['author']['end'] =$basea['author']['start'] + strlen($newPaper['author'][$key]);
			
				$finale[]=$basea;
			}
				
		foreach($xpath->query("//*[@id='articleCitations']//p",$r) as $key => $val){
		    
			$newPaper['references'][] = $xpath->query("//*[@id='articleCitations']//p",$r)->item($key)->nodeValue;
		}
		
		foreach($newPaper['references'] as $key => $reference){
	    	
			$baser['references']['reference'] = $xpath->query("//*[@id='articleCitations']//p",$r)->item($key)->nodeValue;
			$baser['references']['xpath'] = $xpath->query("//*[@id='articleCitations']//p",$r)->item($key)->getNodePath();
			$baser['references']['start'] = "0";
			$baser['references']['end'] = strlen($baser['references']['reference']);
			
				$finale[]=$baser;
		}
					
		$newPaper['doi']['doi'] = $xpath->query("//*[@id='pub-id::doi']",$r)->item(0)->nodeValue;
		$newPaper['doi']['xpath'] = $xpath->query("//*[@id='pub-id::doi']",$r)->item(0)->getNodePath();
		$newPaper['doi']['start'] = "0";
		$newPaper['doi']['end'] =strlen($xpath->query("//*[@id='pub-id::doi']",$r)->item(0)->nodeValue);
		$finale[] =$newPaper['doi'];
	
	//	$newPaper['url'] = $res->getEffectiveUrl();*------$DOCUMENT
		
	
	}
	
//print_r($finale);
