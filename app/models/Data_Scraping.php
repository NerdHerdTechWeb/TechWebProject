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
        #$client = new Client();
        $doc = new DOMDocument();

        foreach ($papersSources as $source) {
            /**
             * Try catching pattern
             */
            try {
                $res = file_get_contents($source['url']);
            } catch (Exception $e) {
                return json_encode(array('message' => $e->getMessage(), 'class' => 'warning'));
            }

            #$body = $res->getBody();
            $body = $res;

            $doc->loadHTML($body);

            $xpath = new DOMXpath($doc);

            $rows = $xpath->query($source['xpathQuery']);

            foreach ($rows as $r) {

                $newPaper = array();

                $newPaper['label'] = trim($xpath->query("text()", $r)->item(0)->nodeValue);
                $newPaperLink = trim($xpath->query("@href", $r)->item(0)->nodeValue);
                $newPaper['link'] = $source['preurl'] . $newPaperLink;
                $newPaper['from'] = 'dlib';

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
        #$client = new Client();
        $doc = new DOMDocument();

        /**
         * Try catching pattern
         */
        try {
            $res = file_get_contents(self::$rivistaStatisticaUri);
        } catch (ClientException $e) {
            return json_encode(array('message' => $e->getMessage(), 'class' => 'warning'));
        }

        #$body = $res->getBody();
        $body = $res;

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

        #$client = new Client();
        $doc = new DOMDocument();
        $citationsCollection = array();

        /**
         * Try catching pattern
         */
        try {
            $res = file_get_contents($link);
        } catch (ClientException $e) {
            return json_encode(array('message' => $e->getMessage(), 'class' => 'warning'));
        }

        #$body = $res->getBody();
        $body = $res;

        $doc->loadHTML($body);

        $xpath = new DOMXpath($doc);

        //TODO
        switch ($from) {
            case 'rstat':
                return self::getRstatDocument($xpath, $citationsCollection, $body);
                break;
            case 'dlib';
                return self::getDlibDocument($xpath, $citationsCollection, $body);
                break;
            default:
                return self::getRstatDocument($xpath, $citationsCollection, $body);
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
    protected static function getRstatDocument(DOMXPath $xpath, $citationsCollection, $body)
    {
        $doc = new DOMDocument();
        $doc->loadHTML($body);
        $elements = $doc->getElementsByTagName('table')->item(9);
        $childs = $elements->childNodes;
        $content = '';
        foreach ($childs  as $element) {
            #echo $element->getNodePath()."\n";
            $content = $doc->saveHTML($element)."\n";
        }

        $papersList = array(
            'articleContent' => $content,
        );
        return json_encode(array($papersList));
    }

    /**
     * Serialize single DLib Magazine article to JSON
     * The single article of DLib Magazine needs custom xpath query
     * @param $xpath
     * @param $citationsCollection
     * @return string|json
     */
    protected static function getDlibDocument(DOMXPath $xpath, $citationsCollection, $body)
    {
        $doc = new DOMDocument();
        $doc->loadHTML($body);
        $elements = $doc->getElementsByTagName('table')->item(9);
        $childs = $elements->childNodes;
        $content = '';
        foreach ($childs  as $element) {
            #echo $element->getNodePath()."\n";
            $content = $doc->saveHTML($element)."\n";
        }

        $papersList = array(
            'articleContent' => $content,
        );
        return json_encode(array($papersList));
    }

    /**
     * Serialize single RStat article to JSON
     * The single article of Rivista statica needs custom xpath query
     * @param $xpath
     * @param $citationsCollection
     * @return string|json
     * @deprecated
     */
    protected static function deprecated_getRstatDocument(DOMXPath $xpath, $citationsCollection)
    {
        /**
         * Rivista statistica
         */
        $titleh3 = $xpath->query('//div[@id="content"]//div[@id="articleTitle"]/h3')->item(0)->nodeValue;
        $authors = $xpath->query('//div[@id="content"]//div[@id="authorString"]/em')->item(0)->nodeValue;
        $articleContentAbstracth4 = $xpath->query('//div[@id="content"]//div[@id="articleAbstract"]/h4')->item(0)->nodeValue;
        $articleContentDiv = $xpath->query('//div[@id="content"]//div[@id="articleAbstract"]/div')->item(0);
        $articleContentP = $xpath->query('//div[@id="content"]//div[@id="articleAbstract"]/div/p')->item(0);
        $keywords = $xpath->query('//div[@id="content"]//div[@id="articleSubject"]/div')->item(0)->nodeValue;
        $citations = $xpath->query('//div[@id="content"]//div[@id="articleCitations"]/div/p');

        foreach ($citations as $cit) {
            array_push($citationsCollection, ($xpath->query('text()', $cit)->item(0)->nodeValue));
        }

        $ACD = empty($articleContentDiv);
        $ACP = empty($articleContentP);
        if(!$ACD) $articleContent = $articleContentDiv->nodeValue;
        if(!$ACP) $articleContent = $articleContentP->nodeValue;

        $papersList = array(
            'titleh3' => $titleh3,
            'authors' => $authors,
            'articleContentAbstracth4' => $articleContentAbstracth4,
            'articleContent' => $articleContent,
            'keywords' => $keywords,
            'citations' => $citationsCollection,
        );
        return json_encode(array($papersList));
    }
}