<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

/**
 * Autoload by composer package manager
 */
require 'vendor/autoload.php';

/**
 * Require common configuration files needed
 */
$view = require 'app/config/view.php';
$xpath = require 'app/config/xpath.php';

/**
 * Init slim application
 */
$app = new \Slim\Slim(array(
        'debug' => true,
        'templates.path' => $view['slim.view.path'],
        'view' => new \Slim\Views\Twig()
    )
);

/**
 * Set twig parser extension to facilitate view rendering
 */
$twigView = $app->view();
$twigView->parserExtensions = array(
    new \Slim\Views\TwigExtension(),
);

function hostMatch ($params){
    $url = empty($params['url']) ? $params['source'] : $params['url'];
    $urlScheme = parse_url($url);
    $domain = $urlScheme['host'];
    $match = 'generic';

    if(preg_match('(dlib.)',$domain)){
        $match = 'dlib';
    }
    if(preg_match('(rivista-statistica.)',$domain)){
        $match = 'rstat';
    }

    return $match;
}

/**
 * General routing not grouped
 */
$app->get('/', function () use ($app, $view, $xpath) {
    /**
     * We are passing some data to the view
     * in array format
     */
    $app->render('index.php',
        array('angularConfig' =>
            array(
                'partialsView' => $view['angular.view.path']
            ),
            'rootXpath' => $xpath['root']
        )
    );
});

/**
 * Grouping api or services under grouped rout
 */
$app->group('/api', function () use ($app) {


    $app->group('/search', function() use ($app){
        $app->map('/get.json', function () use ($app){
            $app->response->headers->set('Content-Type', 'application/json');
            $params = $app->request()->params();
            $client = new Sparql_Client();
            $json = $client->documentSearch($params)->getSearchJson();
            echo $json;
        })->via('GET', 'POST');
    });

    $app->group('/annotations', function () use ($app){
        $app->map('/get.json', function () use ($app){
            $app->response->headers->set('Content-Type', 'application/json');
            $params = $app->request()->params();
            $client = new Sparql_Client();
            $json = $client->getAnnotationsByDocument($params)->getAnnotationsJson(hostMatch($params));
            echo $json;
        })->via('GET', 'POST');
        $app->map('/get.html', function () use ($app){
            $app->response->headers->set('Content-Type', 'text/html charset=utf-8');
            $client = new Sparql_Client();
            $params = $app->request()->params();
            $html = $client->getAnnotationsByDocument($params)->dumpHtml();
            echo $html;
        })->via('GET', 'POST');
        $app->map('/update', function () use ($app){
            $app->response->headers->set('Content-Type', 'text/html charset=utf-8');
            $client = new Sparql_Client();
            $params = $app->request()->params();
            $response = $client->updateDocumentAnnotation($params);
            echo $response;
        })->via('GET', 'POST');
        $app->map('/create-from-collection', function () use ($app){
            $app->response->headers->set('Content-Type', 'text/html charset=utf-8');
            $client = new Sparql_Client();
            $params = $app->request()->params();
            $response = $client->updateDocumentAnnotationCollection($params);
            echo $response;
        })->via('GET', 'POST');
    });

    /**
     * Scraping group
     */
    $app->group('/scraping', function () use ($app) {

        /**
         * Get all graph availables and return in json
         */
        $app->map('/graphlist', function () use ($app) {

            $app->response->headers->set('Content-Type', 'application/json');

            $sparqlClient = new Sparql_Client();
            echo $sparqlClient->getGraphList()->getGraphListJson();
            
        })->via('GET', 'POST');
        
        /**
         * 
         * Get ready graph (consegnati)
         * 
         */
        $app->map('/readygraph', function () use ($app) {
          
            $app->response->headers->set('Content-Type', 'application/json');

            echo Data_Scraping::readyGraphGroupScraping();
            
        })->via('GET', 'POST');

        /**
         * dLib Scraping
         */
        $app->map('/all', function () use ($app) {

            /**
             * JSON content type or anything else
             */
            $app->response->headers->set('Content-Type', 'application/json');

            echo Data_Scraping::getAllDocuments();
        })->via('GET', 'POST');

        /**
         * dLib Scraping
         */
        $app->map('/dlib', function () use ($app) {

            /**
             * JSON content type or anything else
             */
            $app->response->headers->set('Content-Type', 'application/json');

            echo Data_Scraping::dLibScraping();
        })->via('GET', 'POST');

        /**
         * Rivista statistica Scraping
         */
        $app->map('/rstat', function () use ($app) {

            /**
             * JSON content type or anything else
             */
            $app->response->headers->set('Content-Type', 'application/json');

            echo Data_Scraping::rivistaStatisticaScraping();
        })->via('GET', 'POST');

        /**
         * Generic dispatcher api that routing request to
         * get document method
         * Get document takes two params
         */
        $app->map('/get/document', function () use ($app) {

            $link = $app->request()->params('link');
            $from = $app->request()->params('from');
            
            $app->response->headers->set('Content-Type', 'application/json');

            echo Data_Scraping::getDocument($link, $from);
        })->via('GET', 'POST');
        
        
        $app->map('/document', function () use ($app) {

            $params = $app->request()->params();
            $client = new Data_Scraping();

            $match = hostMatch($params);

            $app->response->headers->set('Content-Type', 'application/json');

            echo $client->autoScraping($params['url'],$match)->getAutoScrapingJson();
        })->via('GET', 'POST');
        
    });
});

/**
 * Running up the app
 */
$app->run();