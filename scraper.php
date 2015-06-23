<?php


require 'vendor/autoload.php';

$papersSources = Array(
                       Array(
                             'url'        => 'http://www.dlib.org/dlib/november14/11contents.html',
                             'xpathQuery' => "//table[3]//table[5]//table//td//p[@class='contents']/a",
							 'preurl'     => 'http://www.dlib.org/dlib/november14/'
                            ),
							 Array(
                             'url'        => 'http://www.dlib.org/dlib/may15/05contents.html',
                             'xpathQuery' => "//table[3]//table[5]//table//td//p[@class='contents']/a",
							 'preurl'     => 'http://www.dlib.org/dlib/may15/'
                            ),
/*                      Array(
                             'url'        => 'http://rivista-statistica.unibo.it/issue/view/467',
                             'xpathQuery' => '//*[@id="content"]/table'
                            ),
                       Array(
                             'url'        => 'http://ipotesidipreistoria.unibo.it/issue/current/showToc',
                             'xpathQuery' => '//*[@id="content"]/table'
                            ),
                       Array(
                             'url'        => 'http://jfr.unibo.it/issue/current',
                             'xpathQuery' => '//*[@id="content"]/table'
                            )*/
                      );

$papersList = array();

foreach($papersSources as $source)
   {
    $client = new GuzzleHttp\Client();

    $res = $client->get($source['url']);

    $body = $res->getBody();

    $doc = new DOMDocument();

    $doc->loadHTML($body);

    $xpath = new DOMXpath($doc);

    $rows = $xpath->query($source['xpathQuery']);

    foreach ($rows as $r)
       {
	   
        $newPaper = array();

        $newPaper['label'] = trim($xpath->query("text()",$r)->item(0)->nodeValue);
        $newPaper['link'] = trim($xpath->query("@href",$r)->item(0)->nodeValue);
		$newPaper['link'] = $source['preurl'].trim($xpath->query("@href",$r)->item(0)->nodeValue);
		
   

        $papersList[] = $newPaper;
       }
   }print_r ($papersList);




?>
