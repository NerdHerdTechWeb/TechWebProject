<?php

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
    $app->group('/scraping', function () use ($app) {
        $app->map('/rdf/:query', function ($query) use ($app) {
            /**
             * JSON content type or anything else
             */
            $app->response->headers->set('Content-Type', 'application/json');
            /**
             * Testing purpose - this is insane I know :)
             */
            echo Data_Scraping::getData();
        })->via('GET', 'POST');
    });
});

/**
 * Running up the app
 */
$app->run();