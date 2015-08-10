<!-- index.html -->

<!doctype html>
<html>
<head>
    <title>Semantic Annotator :: Read & Edit</title>
    <link rel="icon" href="../app/src/nerdherd.ico" />

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="../app/css/main.css">
    <link rel="stylesheet" href="../../bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../../bower_components/bootstrap-flat/css/bootstrap-flat.min.css">
    <link rel="stylesheet" href="../../bower_components/bootstrap-flat/css/bootstrap-flat-extras.min.css">
    <link rel="stylesheet" href="../../bower_components/angular-toggle-switch/angular-toggle-switch.css">
    <link rel="stylesheet" href="../../bower_components/angular-toggle-switch/angular-toggle-switch-bootstrap.css">
    <script type="text/javascript">
        var init_conf = {{ angularConfig|json_encode()|raw }};
    </script>
</head>
<body ng-app="semanticNotations">

<nav class="navbar navbar-default navbar-fixed-top" ng-controller="NavBar">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-2">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
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
                <li><toggle-switch ng-model="annotator.status" knob-label="Annotator &nbsp;&nbsp;&nbsp;&nbsp;f"><toggle-switch></li>
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
</nav>

<!-- Main view rendered by Angular -->
<div id="wrapper" ng-view></div>

<!-- Preloade css3 animation -->
<div class="sk-circle doc-preloader-hide">
  <div class="sk-circle1 sk-child"></div>
  <div class="sk-circle2 sk-child"></div>
  <div class="sk-circle3 sk-child"></div>
  <div class="sk-circle4 sk-child"></div>
  <div class="sk-circle5 sk-child"></div>
  <div class="sk-circle6 sk-child"></div>
  <div class="sk-circle7 sk-child"></div>
  <div class="sk-circle8 sk-child"></div>
  <div class="sk-circle9 sk-child"></div>
  <div class="sk-circle10 sk-child"></div>
  <div class="sk-circle11 sk-child"></div>
  <div class="sk-circle12 sk-child"></div>
</div>

</body>

<!-- UTILS -->
<script type="text/javascript" src="../app/scripts/utils/utils.js"></script>
<script type="text/javascript" src="../../bower_components/tinymce/tinymce.js"></script>

<!-- Application Dependencies -->
<script type="text/javascript" src="../../bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="../../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../../bower_components/angular/angular.js"></script>
<script type="text/javascript" src="../../bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
<script type="text/javascript" src="../../bower_components/angular-resource/angular-resource.js"></script>
<script type="text/javascript" src="../../bower_components/angular-route/angular-route.js"></script>
<script type="text/javascript" src="../../bower_components/angular-toggle-switch/angular-toggle-switch.js"></script>
<script type="text/javascript" src="../../bower_components/angular-ui-tinymce/src/tinymce.js"></script>
<script type="text/javascript" src="../../bower_components/moment/moment.js"></script>

<!-- Application Scripts -->
<script type="text/javascript" src="../app/scripts/app.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/NavBar.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/SearchSearchBar.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/DocumentsManager.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/WidgetMeta.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/modal/WidgetMetaModal.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/modal/FragmentModal.js"></script>
<script type="text/javascript" src="../app/scripts/services/Search.SearchBar.js"></script>
<script type="text/javascript" src="../app/scripts/services/Widget.DocumentsList.js"></script>
<script type="text/javascript" src="../app/scripts/services/Widget.Meta.js"></script>
<script type="text/javascript" src="../app/scripts/services/Fragment.js"></script>
</html>