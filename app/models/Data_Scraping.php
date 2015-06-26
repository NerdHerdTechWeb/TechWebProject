<?php

/**
 * Using Guzzle Http Framework
 * to facilitate server side request
 * and taking control of complex response
 */
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

/**
 * Class Data_Scraping
 * A container class for all scraping method
 * callable via static call
 */
class Data_Scraping
{

    /**
     * DLib URI
     * Must have
     * @var string
     */
    static $dlibUri = 'http://www.dlib.org/dlib/november14/11contents.html';

    /**
     * Rivista statistica URI
     * Must have
     * @var string
     */
    static $rivistaStatisticaUri = 'http://rivista-statistica.unibo.it/issue/view/467';

    /**
     * Rivista statistica URI
     * Nice to have
     * @var string
     */
    static $journalsUnibo = 'http://journals.unibo.it/riviste/';

    /**
     * Rivista dlib URI
     * Nice to have
     * @var string
     */
    static $dlibUriNiceToHave = 'http://www.dlib.org/dlib/may15/05contents.html';

    /**
     * Testing purpose method
     * @return string | json
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

    /**
     * Static method that implements Guzzle, DOMDocument & DOMXpath
     * Parsing xhtml document from DLIB site then
     * returns a json representation of parsed data
     * @return string|json
     */
    public static function dLibScraping()
    {
        $mappings = array(
            array(
                'url' => self::$dlibUri,
                'xpathQuery' => "//table[3]//table[5]//table//td//p[@class='contents']/a",
                'preurl' => 'http://www.dlib.org/dlib/november14/'
            ),
            array(
                'url' => self::$dlibUriNiceToHave,
                'xpathQuery' => "//table[3]//table[5]//table//td//p[@class='contents']/a",
                'preurl' => 'http://www.dlib.org/dlib/may15/'
            )
        );

        $papersSources = $mappings;

        $papersList = array();
        $client = new Client();
        $doc = new DOMDocument();

        foreach ($papersSources as $source) {
            /**
             * Try catching pattern
             */
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
                $newPaperLink = trim($xpath->query("@href", $r)->item(0)->nodeValue);
                $newPaper['link'] = $source['preurl'] . $newPaperLink;
                $newPaper['from'] = 'rstat';

                $papersList[] = $newPaper;
            }
        }

        return json_encode($papersList);
    }

    /**
     * Static method that implements Guzzle, DOMDocument & DOMXpath
     * Parsing xhtml document from rivista-statistica.unibo.it site then
     * returns a json representation of parsed data
     * @return string|json
     */
    public static function rivistaStatisticaScraping()
    {
        $papersList = array();
        $client = new Client();
        $doc = new DOMDocument();

        /**
         * Try catching pattern
         */
        try {
            $res = $client->get(self::$rivistaStatisticaUri);
        } catch (ClientException $e) {
            return json_encode(array('message' => $e->getMessage(), 'class' => 'warning'));
        }

        $body = $res->getBody();

        $doc->loadHTML($body);

        $xpath = new DOMXpath($doc);

        $rows = $xpath->query('//table[@class="tocArticle"]//td[@class="tocTitle"]/a');

        foreach ($rows as $row) {
            $link = $xpath->query('@href', $row)->item(0)->nodeValue;
            $label = $xpath->query('text()', $row)->item(0)->nodeValue;

            $papersList[] = array('label' => $label, 'link' => $link, 'from' => 'rstat');
        }

        return json_encode($papersList);

    }

    /**
     * Scraping node
     * Get document dispatcher to retrieve single article
     * from DLib, Rivista Statica and anything else
     * @param null|string $link
     * @param null|string $from
     * @return string|json
     */
    public static function getDocument($link = null, $from = null)
    {
        $link = !empty($link) ? $link : 'http://rivista-statistica.unibo.it/article/view/4594';
        $from = !empty($from) ? $from : 'dlib';

        $client = new Client();
        $doc = new DOMDocument();
        $citationsCollection = array();

        /**
         * Try catching pattern
         */
        try {
            $res = $client->get($link);
        } catch (ClientException $e) {
            return json_encode(array('message' => $e->getMessage(), 'class' => 'warning'));
        }

        $body = $res->getBody();

        $doc->loadHTML($body);

        $xpath = new DOMXpath($doc);

        //TODO
        switch ($from) {
            case 'rstat':
                return self::getRstatDocument($xpath, $citationsCollection);
                break;
            case 'dlib';
                return self::getRstatDocument($xpath, $citationsCollection);
                break;
            default:
                return self::getRstatDocument($xpath, $citationsCollection);
                break;
        }

    }

    /**
     * Serialize single RStat article to JSON
     * The single article of Rivista statica needs custom xpath query
     * @param $xpath
     * @param $citationsCollection
     * @return string|json
     */
    protected static function getRstatDocument($xpath, $citationsCollection)
    {
        /**
         * Rivista statistica
         */
        $titleh3 = $xpath->query('//div[@id="content"]//div[@id="articleTitle"]/h3')->item(0)->nodeValue;
        $authors = $xpath->query('//div[@id="content"]//div[@id="authorString"]/em')->item(0)->nodeValue;
        $articleContentAbstracth4 = $xpath->query('//div[@id="content"]//div[@id="articleAbstract"]/h4')->item(0)->nodeValue;
        $articleContent = $xpath->query('//div[@id="content"]//div[@id="articleAbstract"]/div/p')->item(0)->nodeValue;
        $keywords = $xpath->query('//div[@id="content"]//div[@id="articleSubject"]/div')->item(0)->nodeValue;
        $citations = $xpath->query('//div[@id="content"]//div[@id="articleCitations"]/div/p');

        foreach ($citations as $cit) {
            array_push($citationsCollection, ($xpath->query('text()', $cit)->item(0)->nodeValue));
        }

        $papersList = array(
            'titleh3' => $titleh3,
            'authors' => $authors,
            'articleContentAbstracth4' => $articleContentAbstracth4,
            'articleContent' => $articleContent,
            'keywords' => $keywords,
            'citations' => $citationsCollection,
        );
        return json_encode($papersList);
    }

    /**
     * Serialize single DLib Magazine article to JSON
     * The single article of DLib Magazine needs custom xpath query
     * @param $xpath
     * @param $citationsCollection
     * @return string|json
     */
    protected static function getDlibDocument(DOMXPath $xpath, $citationsCollection)
    {
        $titleCollection = array();
        /**
         * DLib Magazine
         */
        $titleh3 = $xpath->query('//form//table[3]//tr[1]//td[1]//table[5]//tr[1]//td[1]//table[1]//tr/td[2]/h3');
        $authors = $xpath->query('//div[@id="content"]//div[@id="authorString"]/em');
        $articleContentAbstracth4 = $xpath->query('//div[@id="content"]//div[@id="articleAbstract"]/h4');
        $articleContent = $xpath->query('//div[@id="content"]//div[@id="articleAbstract"]/div/p');
        $keywords = $xpath->query('//div[@id="content"]//div[@id="articleSubject"]/div');
        $citations = $xpath->query('//div[@id="content"]//div[@id="articleCitations"]/div/p');

        foreach ($citations as $cit) {
            array_push($citationsCollection, ($xpath->query('text()', $cit)->item(0)->nodeValue));
        }

        foreach($titleh3 as $title){
            array_push($titleCollection, ($xpath->query('text()', $title)->item(0)->nodeValue ));
        }

        $papersList = array(
            'titleh3' => $titleCollection,
            'authors' => $authors,
            'articleContentAbstracth4' => $articleContentAbstracth4,
            'articleContent' => $articleContent,
            'keywords' => $keywords,
            'citations' => $citationsCollection,
        );
        return json_encode($papersList);
    }
}