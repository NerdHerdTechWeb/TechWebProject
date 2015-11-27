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
     * Root xpath to combine with application document part xpath
     * @var string
     */
    static $dLibRootXPATH = '/html/body/form/table[3]/tr/td/table[5]/tr/td/';

    /**
     *
     * @var string
     */
    public $results;


    /**
     * Return active graph to manage (solo consegnati)
     * @return string
     */
    public static function readyGraphGroupScraping()
    {

        try {
            $res = file_get_contents('http://vitali.web.cs.unibo.it/TechWeb15/GrafiGruppi');
        } catch (Exception $e) {
            return json_encode(array(array('message' => $e->getMessage(), 'class' => 'warning')));
        }

        $body = $res;

        $doc = new DOMDocument();

        $doc->loadHTML($body);

        $xpath = new DOMXpath($doc);

        $rows = $xpath->query('//*[@class="twikiTopic"]/a');

        $papersList = array();
        foreach ($rows as $r) {
            $papersList[] = $xpath->query('//*[@class="twikiTopic"]/a/text()', $r)->item(1)->nodeValue;
        }

        return json_encode(array_unique($papersList));

    }

    /**
     * Static method that implements Guzzle, DOMDocument & DOMXpath
     * Parsing xhtml document from DLIB site then
     * returns a json representation of parsed data
     * @param boolean $isArray
     * @return string|json
     */
    public static function dLibScraping($isArray = false)
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
        $doc = new DOMDocument();

        foreach ($papersSources as $source) {

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
                $newPaper['imagepath'] = preg_replace('([^\/]+$)', '', $newPaper['link']);
                $newPaper['from'] = 'dlib';

                $papersList[] = $newPaper;
            }
        }

        if (!$isArray)
            return json_encode($papersList);
        else
            return $papersList;
    }

    /**
     * Create the left menu object documents list from a collection of uri
     * @param array $collection collection of dLib documents uri
     * @return string
     */
    public static function dLibScrapingUrlCollection($collection = array())
    {
        //TODO check empty collection
        $doc = new DOMDocument();

        foreach ($collection as $key => $val) {

            try {
                $res = file_get_contents($val);
            } catch (Exception $e) {
                return json_encode(array(array('message' => $e->getMessage(), 'class' => 'warning')));
            }

            $body = $res;

            $doc->loadHTML($body);

            $xpath = new DOMXpath($doc);

            $title = $xpath->query('//html//body//form//table[3]//tr//td//table[5]//tr//td//table[1]//tr[1]//td[2]//h3[2]')->item(0)->nodeValue;

            $newPaper = array();

            $newPaper['label'] = trim($title);
            $newPaper['link'] = $val;
            $newPaper['imagepath'] = preg_replace('([^\/]+$)', '', $newPaper['link']);
            $newPaper['from'] = 'dlib';

            $papersList[] = $newPaper;

        }

        return json_encode($papersList);

    }

    /**
     * Create the left menu object documents list from a collection of uri
     * @param array $collection collection of rstat documents uri
     * @return string
     */
    public static function rivistaStatisticaScrapingUrlCollection($collection = array())
    {
        //TODO check empty collection
        $doc = new DOMDocument();

        foreach ($collection as $key => $val) {

            try {
                $res = file_get_contents($val);
            } catch (Exception $e) {
                return json_encode(array(array('message' => $e->getMessage(), 'class' => 'warning')));
            }

            $body = $res;

            $doc->loadHTML($body);

            $xpath = new DOMXpath($doc);

            $title = $xpath->query('//html//body//form//table[3]//tr//td//table[5]//tr//td//table[1]//tr[1]//td[2]//h3[2]')->item(0)->nodeValue;

            $newPaper = array();

            $newPaper['label'] = trim($title);
            $newPaper['link'] = $val;
            $newPaper['imagepath'] = preg_replace('([^\/]+$)', '', $newPaper['link']);
            $newPaper['from'] = 'dlib';

            $papersList[] = $newPaper;

        }

        return json_encode($papersList);

    }

    /**
     * Static method that implements Guzzle, DOMDocument & DOMXpath
     * Parsing xhtml document from rivista-statistica.unibo.it site then
     * returns a json representation of parsed data
     * @param boolean $isArray
     * @return string|json
     */
    public static function rivistaStatisticaScraping($isArray = false)
    {
        $papersList = array();
        $doc = new DOMDocument();

        try {
            $res = file_get_contents(self::$rivistaStatisticaUri);
        } catch (ClientException $e) {
            return json_encode(array('message' => $e->getMessage(), 'class' => 'warning'));
        }

        $body = $res;

        $doc->loadHTML($body);

        $xpath = new DOMXpath($doc);

        $rows = $xpath->query('//*[@class="tocArticle"]//*[@class="tocTitle"]/a');

        foreach ($rows as $row) {
            $link = $xpath->query('@href', $row)->item(0)->nodeValue;
            $label = $xpath->query('text()', $row)->item(0)->nodeValue;

            $newPaper['label'] = trim($label);
            $newPaper['link'] = $link;
            $newPaper['imagepath'] = preg_replace('([^\/]+$)', '', $newPaper['link']);
            $newPaper['from'] = 'rstat';

            $papersList[] = $newPaper;
        }

        if (!$isArray)
            return json_encode($papersList);
        else
            return $papersList;

    }

    /**
     * Create a unique array from all provenance
     * @return string
     */
    public static function getAllDocuments()
    {
        try {
            $dlib = self::dLibScraping(true);
            $rstat = self::rivistaStatisticaScraping(true);
            $merge = array_merge($dlib, $rstat);
        } catch (Exception $e) {
            return json_encode(array('message' => $e->getMessage(), 'class' => 'warning'));
        }

        return json_encode($merge);
    }

    /**
     * Scraping dispatcher
     */
    public function autoScraping($document, $match = 'generic')
    {
        if (strcasecmp($match, 'dlib') === 0) {
            $this->dlibAutoScraping($document);
        }
        if (strcasecmp($match, 'rstat') === 0) {
            $this->rstatAutoScraping($document);
        }
        if (strcasecmp($match, 'generic') === 0) {
            //TODO generic scraping
        }

        return $this;
    }

    /**
     *
     *
     */
    protected function dlibAutoScraping($document)
    {

        $doc = new DOMDocument();

        try {
            $res = file_get_contents($document);
        } catch (Exception $e) {
            return json_encode(array('message' => $e->getMessage(), 'class' => 'warning'));
        }

        $body = $res;
        $doc->loadHTML($body);
        $xpath = new DOMXpath($doc);
        $rows = $xpath->query("/html/body/form/table[3]");
        $papersList = array();

        foreach ($rows as $r) {

            $newPaper = array();

            preg_match('/\d+/', trim($xpath->query("//p[1]/text()", $r)->item(0)->nodeValue), $match);

            $newPaper['date']['date'] = $match[0];
            $newPaper['date']['xpath'] = $xpath->query("//p[1]", $r)->item(0)->getNodePath();
            $newPaper['date']['start'] = $xpath->query("//p[1]/text()", $r)->item(0)->length - 4;
            $newPaper['date']['end'] = $xpath->query("//p[1]/text()", $r)->item(0)->length;

            $final['date'][] = $newPaper['date'];

            $newPaper['title']['title'] = trim($xpath->query("//h3[2]/text()", $r)->item(0)->nodeValue);
            $newPaper['title']['xpath'] = $xpath->query("//h3[2]", $r)->item(0)->getNodePath();
            $newPaper['title']['start'] = "0";
            $newPaper['title']['end'] = $xpath->query("//h3[2]/text()", $r)->item(0)->length;

            $final['title'][] = $newPaper['title'];


            $authors = $xpath->query("//p[2]/text()", $r);
            $oldPaper = $xpath->query("//p[2]", $r)->item(0)->nodeValue;


            foreach ($authors as $key => $author) {
                $module = $key % 3;
                if ($module === 0)
                    $newPaper['author'][] = trim($xpath->query("//p[2]/text()", $r)->item($key)->nodeValue);


            }
            $newPaper['author'] = str_replace("and", ",", $newPaper['author']);
            foreach ($newPaper['author'] as $key => $el) {

                if (strpos($el, ",")) {
                    $temp = explode(",", $el);
                    array_splice($newPaper['author'], $key, 1, $temp);
                }
            }
            $lastElement = end($newPaper['author']);

            foreach ($newPaper['author'] as $key => $el) {

                if ($el != $lastElement) {
                    $base['author']['author'] = $newPaper['author'][$key];
                    $base['author']['xpath'] = $xpath->query("//p[2]", $r)->item(0)->getNodePath();
                    $base['author']['start'] = stripos($oldPaper, $newPaper['author'][$key]);
                    $base['author']['end'] = $base['author']['start'] + strlen($newPaper['author'][$key]);

                    $final['author'][] = $base['author'];
                } else {
                    $basedoi['doi']['doi'] = $newPaper['author'][$key];
                    $basedoi['doi']['xpath'] = $xpath->query("//p[2]", $r)->item(0)->getNodePath();
                    $basedoi['doi']['start'] = stripos($oldPaper, $newPaper['author'][$key]);
                    $basedoi['doi']['end'] = $basedoi['doi']['start'] + strlen($newPaper['author'][$key]);

                    $final['doi'][] = $basedoi['doi'];
                }

            }

            $references = $xpath->query("//p/a[@name]/text()", $r);
            foreach ($references as $key => $reference) {
                $newPaper['references']['reference'] = $xpath->query("//p/a[@name]", $r)->item($key)->parentNode->nodeValue;
                $newPaper['references']['xpath'] = $xpath->query("//p/a[@name]", $r)->item($key)->parentNode->getNodePath();
                $newPaper['references']['start'] = "0";
                $newPaper['references']['end'] = strlen($newPaper['references']['reference']);

                $final['references'][] = $newPaper['references'];
            }
        }

        $this->results = $final;

        return $this;
    }

    /**
     *
     *
     */
    protected function rstatAutoScraping($document)
    {
        $doc = new DOMDocument();

        try {
            $res = file_get_contents($document);
        } catch (Exception $e) {
            return json_encode(array('message' => $e->getMessage(), 'class' => 'warning'));
        }

        $body = $res;

        $doc->loadHTML($body);
        $xpath = new DOMXpath($doc);
        $rows = $xpath->query("/html/body/div");

        foreach ($rows as $r) {

            $newPaper = array();

            $newPaper['title']['title'] = $xpath->query("//*[@id='articleTitle']", $r)->item(0)->nodeValue;
            $newPaper['title']['xpath'] = $xpath->query("//*[@id='articleTitle']", $r)->item(0)->getNodePath();
            $newPaper['title']['start'] = "0";
            $newPaper['title']['end'] = strlen($xpath->query("//*[@id='articleTitle']", $r)->item(0)->nodeValue);

            $finale['title'][] = $newPaper['title'];

            $newPaper['author'][] = $xpath->query("//*[@id='authorString']", $r)->item(0)->nodeValue;
            $oldPaper = $xpath->query("//*[@id='authorString']", $r)->item(0)->nodeValue;
            $newPaper['author'] = str_replace("and", ",", $newPaper['author']);

            foreach ($newPaper['author'] as $key => $el)

                if (strpos($el, ",")) {
                    $temp = explode(",", $el);
                    array_splice($newPaper['author'], $key, 1, $temp);
                }

            foreach ($newPaper['author'] as $key => $el) {

                $basea['author']['author'] = $newPaper['author'][$key];
                $basea['author']['xpath'] = $xpath->query("//*[@id='authorString']", $r)->item(0)->getNodePath();
                $basea['author']['start'] = stripos($oldPaper, $newPaper['author'][$key]);
                $basea['author']['end'] = $basea['author']['start'] + strlen($newPaper['author'][$key]);

                $finale['author'][] = $basea['author'];
            }

            foreach ($xpath->query("//*[@id='articleCitations']//p", $r) as $key => $val) {

                $newPaper['references'][] = $xpath->query("//*[@id='articleCitations']//p", $r)->item($key)->nodeValue;
            }

            foreach ($newPaper['references'] as $key => $reference) {

                $baser['references']['reference'] = $xpath->query("//*[@id='articleCitations']//p", $r)->item($key)->nodeValue;
                $baser['references']['xpath'] = $xpath->query("//*[@id='articleCitations']//p", $r)->item($key)->getNodePath();
                $baser['references']['start'] = "0";
                $baser['references']['end'] = strlen($baser['references']['reference']);

                $finale['references'][] = $baser['references'];
            }

            $newPaper['doi']['doi'] = $xpath->query("//*[@id='pub-id::doi']", $r)->item(0)->nodeValue;
            $newPaper['doi']['xpath'] = $xpath->query("//*[@id='pub-id::doi']", $r)->item(0)->getNodePath();
            $newPaper['doi']['start'] = "0";
            $newPaper['doi']['end'] = strlen($xpath->query("//*[@id='pub-id::doi']", $r)->item(0)->nodeValue);

            $finale['doi'][] = $newPaper['doi'];
        }

        $this->results = $finale;
        return $this;
    }

    /**
     *
     * Returns auto scraping list as json
     * Returns json object instead that an array of json objects
     *
     */
    public function getAutoScrapingJson()
    {
        return json_encode($this->results);
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

        $doc = new DOMDocument();

        /**
         * Try catching pattern
         */
        try {
            $res = file_get_contents($link);
        } catch (ClientException $e) {
            return json_encode(array('message' => $e->getMessage(), 'class' => 'warning'));
        }

        $body = $res;

        $doc->loadHTML($body);

        $xpath = new DOMXpath($doc);

        //TODO
        switch ($from) {
            case 'rstat':
                return self::getRstatDocument($xpath, $body);
                break;
            case 'dlib';
                return self::getDlibDocument($xpath, $body);
                break;
            default:
                return self::getDlibDocument($xpath, $body);
                break;
        }

    }

    /**
     * Serialize single RStat article to JSON
     * The single article of Rivista statica needs custom xpath query
     * @param \DOMXPath $xpath
     * @param $body
     * @internal param $citationsCollection
     * @return string|json
     */
    protected static function getRstatDocument(DOMXPath $xpath, $body)
    {
        $doc = new DOMDocument();
        $doc->loadHTML($body);
        $childs = $doc->getElementById('content')->childNodes;
        $content = '';
        foreach ($childs as $elem) {
            $content .= $doc->saveHTML($elem);
        }

        $papersList = array(
            'articleContent' => '<div id="content">' . $content . '</div>',
        );
        return json_encode(array($papersList));
    }

    /**
     * Serialize single DLib Magazine article to JSON
     * The single article of DLib Magazine needs custom xpath query
     * @param \DOMXPath $xpath
     * @param $body
     * @internal param $citationsCollection
     * @return string|json
     */
    protected static function getDlibDocument(DOMXPath $xpath, $body)
    {
        $doc = new DOMDocument();
        $doc->loadHTML($body);
        $elements = $doc->getElementsByTagName('table')->item(9);
        $childs = $elements->childNodes;
        $content = '';
        foreach ($childs as $element) {
            #echo $element->getNodePath()."\n";
            $content = $doc->saveHTML($element) . "\n";
        }

        $papersList = array(
            'articleContent' => $content,
        );
        return json_encode(array($papersList));
    }

    /**
     * Serialize single Rstat article to JSON
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
        if (!$ACD) $articleContent = $articleContentDiv->nodeValue;
        if (!$ACP) $articleContent = $articleContentP->nodeValue;

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