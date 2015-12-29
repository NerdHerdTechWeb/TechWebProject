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
	
	preg_match('/\d+/',trim($xpath->query("//p[1]/text()",$r)->item(0)->nodeValue),$match);

	$newPaper['date']['date'] = $match[0];	
	$newPaper['date']['xpath'] = $xpath->query("//p[1]",$r)->item(0)->getNodePath();
	$newPaper['date']['start'] = $xpath->query("//p[1]/text()",$r)->item(0)->length-4;
	$newPaper['date']['end'] = $xpath->query("//p[1]/text()",$r)->item(0)->length;
  	
		$final[] = $newPaper['date'];	
				
	$newPaper['title']['title'] = trim($xpath->query("//h3[2]/text()",$r)->item(0)->nodeValue);
	$newPaper['title']['xpath'] = $xpath->query("//h3[2]",$r)->item(0)->getNodePath();
	$newPaper['title']['start'] = "0";
   	$newPaper['title']['end'] = $xpath->query("//h3[2]/text()",$r)->item(0)->length;
	
		$final[] = $newPaper['title'];
  
	
	$authors = $xpath->query("//p[2]/text()",$r);
	$oldPaper = $xpath->query("//p[2]",$r)->item(0)->nodeValue;
	 
	 
	foreach($authors as $key => $author){
	    $module = $key % 3;
	    if($module === 0)
		    $newPaper['author'][] = trim($xpath->query("//p[2]/text()",$r)->item($key)->nodeValue);
			
		
	}  
	$newPaper['author'] = str_replace("and",",",$newPaper['author']);
		foreach ($newPaper['author'] as $key=>$el){
			
			if (strpos($el,",")){
				$temp =explode(",",$el);
		 		array_splice($newPaper['author'],$key,1,$temp);
			}	
		}
	$lastElement = end($newPaper['author']);
	
		foreach ($newPaper['author'] as $key=>$el){
			
			if($el != $lastElement){
				$base['author']['author'] =$newPaper['author'][$key];
				$base['author']['xpath']=$xpath->query("//p[2]",$r)->item(0)->getNodePath();
				$base['author']['start'] =stripos($oldPaper,$newPaper['author'][$key]);
				$base['author']['end'] =$base['author']['start'] + strlen($newPaper['author'][$key]);
		
					$final[]=$base;
			}
			else{
				$basedoi['doi']['doi']=$newPaper['author'][$key];
				$basedoi['doi']['xpath']=$xpath->query("//p[2]",$r)->item(0)->getNodePath();
				$basedoi['doi']['start']=stripos($oldPaper,$newPaper['author'][$key]);
				$basedoi['doi']['end']=$basedoi['doi']['start']+ strlen($newPaper['author'][$key]);	
			
					$final[]=$basedoi;
			}
		
		}
			
	$references = $xpath->query("//p/a[@name]/text()",$r);
		foreach($references as $key => $reference){
			 $newPaper['references']['reference'] = $xpath->query("//p/a[@name]",$r)->item($key)->parentNode->nodeValue;
			$newPaper['references']['xpath'] = $xpath->query("//p/a[@name]",$r)->item($key)->parentNode->getNodePath();
			$newPaper['references']['start'] = "0";
			$newPaper['references']['end'] = strlen($newPaper['references']['reference']);
	
				$final[]=$newPaper['references'];
		}
	//	$newPaper['url'] = $res->getEffectiveUrl();  -------  $DOCUMENT
	}
//	print_r($final);
// 
