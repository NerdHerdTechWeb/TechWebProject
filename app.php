<?php
require 'vendor/autoload.php';

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;

$app = new Application();

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));

$app->get('/', function ($name) use ($app) {
    return new JsonResponse(array('tuttook' => true));
});

