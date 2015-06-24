<?php


use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\ClientException;

/**
 * Class Data_Scraping
 */
class Data_Scraping
{

    /**
     * @return string
     */
    public static function getData()
    {
        return '[
                      {
                "id":1,
                        "user_id":1,
                        "user_firstname":"Federico",
                        "user_lastname":"Sarti",
                        "start_time":"2015-02-21T18:56:48Z",
                        "end_time":"2015-02-21T20:33:10Z",
                        "comment": "Initial project setup."
                      },
            {
                "id":2,
                        "user_id":1,
                        "user_firstname":"Edoardo",
                        "user_lastname":"Cloriti",
                        "start_time":"2015-02-27T10:22:42Z",
                        "end_time":"2015-02-27T14:08:10Z",
                        "comment": "Review of project requirements and notes for getting started."
                      },
            {
                "id":3,
                        "user_id":1,
                        "user_firstname":"Riccardo",
                        "user_lastname":"Masetti",
                        "start_time":"2015-03-03T09:55:32Z",
                        "end_time":"2015-03-03T12:07:09Z",
                        "comment": "Front-end and backend setup."
                      }
            ]';
    }

    public static function dLibScraping()
    {
        $papersSources = array(
            array(
                'url' => 'http://www.dlib.org/dlib/november14/11contents.html',
                'xpathQuery' => "//table[3]//table[5]//table//td//p[@class='contents']/a",
                'preurl' => 'http://www.dlib.org/dlib/november14/'
            ),
            array(
                'url' => 'http://www.dlib.org/dlib/may15/05contents.html',
                'xpathQuery' => "//table[3]//table[5]//table//td//p[@class='contents']/a",
                'preurl' => 'http://www.dlib.org/dlib/may15/'
            ),

            /*Array(
                'url' => 'http://rivista-statistica.unibo.it/issue/view/467',
                'xpathQuery' => '//*[@id="content"]/table'
            ),
            Array(
                'url' => 'http://ipotesidipreistoria.unibo.it/issue/current/showToc',
                'xpathQuery' => '//*[@id="content"]/table'
            ),
            Array(
                'url' => 'http://jfr.unibo.it/issue/current',
                'xpathQuery' => '//*[@id="content"]/table'
            )*/
        );

        $papersList = array();
        $client = new Client();
        $doc = new DOMDocument();

        foreach ($papersSources as $source) {
            try {
                $res = $client->get($source['url']);
            } catch (ClientException $e) {
                return json_encode(array('message' => $e->getMessage(), 'class' => 'warning'));
            }
            $body = $res->getBody();
            
            $doc->loadHTML($body);

            $xpath = new DOMXpath($doc);

            $rows = $xpath->query($source['xpathQuery']);

            foreach ($rows as $r) {

                $newPaper = array();

                $newPaper['label'] = trim($xpath->query("text()", $r)->item(0)->nodeValue);
                $newPaper['link'] = trim($xpath->query("@href", $r)->item(0)->nodeValue);
                $newPaper['link'] = $source['preurl'] . trim($xpath->query("@href", $r)->item(0)->nodeValue);

                $papersList[] = $newPaper;
            }
        }

        return json_encode($papersList);
    }
}