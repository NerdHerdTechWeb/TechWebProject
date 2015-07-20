<!-- index.html -->

<!doctype html>
<html>
<head>
    <title>Semantic Annotator :: Read & Edit</title>
    <link rel="icon" href="../app/src/nerdherd.ico" />
    <link rel="stylesheet" href="../app/css/main.css">
    <link rel="stylesheet" href="../../bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../../bower_components/bootstrap-flat/css/bootstrap-flat.min.css">
    <link rel="stylesheet" href="../../bower_components/bootstrap-flat/css/bootstrap-flat-extras.min.css">
    <script type="text/javascript">
        var init_conf = {{ angularConfig|json_encode()|raw }};
    </script>
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
            <button class="btn-info navbar-btn">
                <span class="glyphicon glyphicon-th-list"></span>
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
                <li><a href="#/annotator">Annotator</a></li>
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
</nav>

<div ng-view></div>

</body>

<!-- UTILS -->
<script type="text/javascript" src="../app/scripts/utils/utils.js"></script>

<!-- Application Dependencies -->
<script type="text/javascript" src="../../bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="../../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../../bower_components/angular/angular.js"></script>
<script type="text/javascript" src="../../bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
<script type="text/javascript" src="../../bower_components/angular-resource/angular-resource.js"></script>
<script type="text/javascript" src="../../bower_components/angular-route/angular-route.js"></script>
<script type="text/javascript" src="../../bower_components/moment/moment.js"></script>

<!-- Application Scripts -->
<script type="text/javascript" src="../app/scripts/app.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/SearchSearchBar.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/WidgetDocumentsList.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/WidgetMeta.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/modal/WidgetMetaModal.js"></script>
<script type="text/javascript" src="../app/scripts/services/Search.SearchBar.js"></script>
<script type="text/javascript" src="../app/scripts/services/Widget.DocumentsList.js"></script>
<script type="text/javascript" src="../app/scripts/services/Widget.Meta.js"></script>
</html>