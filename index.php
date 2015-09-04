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

/**
 * General routing not grouped
 */
$app->get('/', function () use ($app, $view) {
    /**
     * We are passing some data to the view
     * in array format
     */
    $app->render('index.php',
        array('angularConfig' =>
            array(
                'partialsView' => $view['angular.view.path']
            )
        )
    );
});

/**
 * Grouping api or services under grouped rout
 */
$app->group('/api', function () use ($app) {


    $app->group('/annotations', function () use ($app){
        /**
         * JSON content type or anything else
         */
        $app->response->headers->set('Content-Type', 'application/json');
        $app->map('/get.json', function () use ($app){
            $client = new Sparql_Client();
            $json = $client->getAnnotationsByDocument()->getAnnotationsJson();
            echo $json;
        })->via('GET', 'POST');
        $app->map('/get.html', function () use ($app){
            $app->response->headers->set('Content-Type', 'text/html charset=utf-8');
            $client = new Sparql_Client();
            $json = $client->getAnnotationsByDocument()->dumpHtml();
            echo $json;
        })->via('GET', 'POST');
    });

    /**
     * Scraping group
     */
    $app->group('/scraping', function () use ($app) {

        /**
         * Generic RDF query
         */
        $app->map('/rdf/:query', function ($query) use ($app) {

            /**
             * JSON content type or anything else
             */
            $app->response->headers->set('Content-Type', 'application/json');

            /**
             * We can passing a query param
             * from the controller to the scraping method
             */
            echo Data_Scraping::getData();
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
            /**
             * JSON content type or anything else
             */
            $app->response->headers->set('Content-Type', 'application/json');

            echo Data_Scraping::getDocument($link, $from);
        })->via('GET', 'POST');
    });
});

/**
 * Running up the app
 */
$app->run();