<?php
require 'app.php';
?>
<!-- index.html -->

<!doctype html>
<html>
<head>
    <title>Semantic Annotator :: Read & Edit</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
</head>
<body ng-app="semanticNotations">

<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-2">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#/homeproject">Semantic Annotator</a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2" ng-controller="SearchSearchBar as vm">
            <form class="navbar-form navbar-left" role="search">
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Search" ng-model="search.searchCriteria">
                </div>
                <button type="submit" class="btn btn-default">Submit</button>
            </form>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="#/help">Help</a></li>
                <li><a href="#/about">About</a></li>
                <li><a href="#/annotator">Annotator</a></li>
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
</nav>

<div ng-view></div>

</body>

<!-- Application Dependencies -->
<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
<script type="text/javascript" src="bower_components/angular-resource/angular-resource.js"></script>
<script type="text/javascript" src="bower_components/angular-route/angular-route.js"></script>
<script type="text/javascript" src="bower_components/moment/moment.js"></script>

<!-- Application Scripts -->
<script type="text/javascript" src="scripts/app.js"></script>
<script type="text/javascript" src="scripts/controllers/SearchSearchBar.js"></script>
<script type="text/javascript" src="scripts/controllers/WidgetDocumentsList.js"></script>
<script type="text/javascript" src="scripts/controllers/WidgetMeta.js"></script>
<script type="text/javascript" src="scripts/controllers/modal/WidgetMetaModal.js"></script>
<script type="text/javascript" src="scripts/services/Search.SearchBar.js"></script>
<script type="text/javascript" src="scripts/services/Widget.DocumentsList.js"></script>
<script type="text/javascript" src="scripts/services/Widget.Meta.js"></script>
</html>