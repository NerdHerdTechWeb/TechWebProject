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
            echo '[
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
        })->via('GET', 'POST');
    });
});

/**
 * Running up the app
 */
$app->run();