<!-- index.html -->

<!doctype html>
<html xmlns:ng="http://angularjs.org">
<head>
    <title>Semantic Annotator :: Read & Edit</title>
    <link rel="icon" href="../app/src/nerdherd.ico" />

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="../app/css/main.css">
    <link rel="stylesheet" href="../app/css/magic.css">
    <link rel="stylesheet" href="../app/css/bt-switch.css">
    <link rel="stylesheet" href="../../bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../../bower_components/bootstrap-flat/css/bootstrap-flat.min.css">
    <link rel="stylesheet" href="../../bower_components/bootstrap-flat/css/bootstrap-flat-extras.min.css">
    <link rel="stylesheet" href="../../bower_components/angular-toggle-switch/angular-toggle-switch.css">
    <link rel="stylesheet" href="../../bower_components/angular-toggle-switch/angular-toggle-switch-bootstrap.css">
    <link rel="stylesheet" href="../../bower_components/angular-ui-notification/dist/angular-ui-notification.min.css">
    <script type="text/javascript">
        var init_conf = {{ angularConfig|json_encode()|raw }};
        var xpath_conf = {{ rootXpath|json_encode()|raw }};
    </script>
</head>
<body ng-app="semanticNotations" ng-controller="DocumentsManager as vm" switch-index>

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
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2" ng-controller="SearchSearchBar">

            <form id="navForm" class="navbar-form navbar-left" role="search" novalidate>
                <button show-menu type="button" class="btn btn-default navbar-btn"
                        tooltip="Menu"
                        tooltip-placement="bottom"
                        tooltip-trigger="mouseenter"
                    ><span class="glyphicon glyphicon-menu-hamburger"></span></button>
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Search" ng-model="search">
                </div>
                <button type="submit" class="btn btn-default" ng-click="doSearch(search)"><span class="glyphicon glyphicon-search"></span></button>
                
                <button type="button" class="btn btn-default navbar-btn"
                        tooltip="Force auto scraping"
                        tooltip-placement="bottom"
                        tooltip-trigger="mouseenter"
                        ng-click="doScraping(search)"
                    ><span class="glyphicon glyphicon-import"></span></button>
                <button type="button" class="btn btn-default navbar-btn"
                        tooltip="Advanced document search"
                        tooltip-placement="bottom"
                        tooltip-trigger="mouseenter"
                        ng-click="showModalFilter()"
                    ><span class="glyphicon glyphicon-list"></span></button>
                <button ng-if="logStatus === true" type="button" class="btn btn-default navbar-btn"
                        tooltip="Manage unsaved annotation"
                        tooltip-placement="bottom"
                        tooltip-trigger="mouseenter"
                        ng-click="showUnSavedAnnotations()"
                    ><span class="glyphicon glyphicon-inbox"></span></button>
                <button ng-if="logStatus === false" type="button" class="btn btn-primary navbar-btn"
                        tooltip="Login if you want edit annotations"
                        tooltip-placement="bottom"
                        tooltip-trigger="mouseenter"
                        ng-click="login()"
                    ><span class="glyphicon glyphicon-log-in"></span></button>
                <button ng-if="logStatus === true" type="button" class="btn btn-danger navbar-btn"
                        tooltip="Logut"
                        tooltip-placement="bottom"
                        tooltip-trigger="mouseenter"
                        ng-click="logout()"
                    ><span class="glyphicon glyphicon-log-out"></span></button>
            </form>
            <ul class="nav navbar-nav navbar-right textShadow">
                <li><a href="#/annotator">Annotator</a></li>
                <!-- <li><a href="#/about">About</a></li> -->
                <!-- <li><toggle-switch ng-model="annotator.status" knob-label="Editor &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f"><toggle-switch></li> -->
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
</nav>

<!-- Main view rendered by Angular -->
<div id="site-wrapper" ng-view></div>

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

<!-- Modals manager utils -->
<div ng-controller="ModalsPaginator" style="position:fixed; bottom:0; left:0; right: 0; z-index: 10000;" class="row">
    <div ng-show="showPaginator" style="margin: 0 auto; max-width: 341px;">
        <uib-pagination total-items="bigTotalItems" ng-model="bigCurrentPage" ng-change="pageChanged()"
                        max-size="maxSize" class="pagination-sm" boundary-links="true"></uib-pagination>
    </div>
</div>

<!-- APP pre loader -->
<div ng-init="ready=false" ng-if="ready" style="position: absolute; left: 0; bottom: 0; right: 0; top: 0; background-color: #f2f2f2; z-index: 10000;">
    <!-- Preloade css3 animation -->
    <div class="sk-circle doc-preloader-show">
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
</div>

</body>

<!-- UTILS -->
<script type="text/javascript" src="../app/scripts/utils/utils.js"></script>
<script type="text/javascript" src="../app/scripts/utils/wgxpath.install.js"></script>
<script type="text/javascript" src="../../bower_components/tinymce/tinymce.js"></script>
<script type="text/javascript" src="../../bower_components/rangy/rangy-core.min.js"></script>
<script type="text/javascript" src="../../bower_components/rangy/rangy-classapplier.min.js"></script>
<script type="text/javascript" src="../../bower_components/rangy/rangy-textrange.min.js"></script>
<script type="text/javascript" src="../../bower_components/rangy/rangy-serializer.min.js"></script>

<!-- Application Dependencies -->
<script type="text/javascript" src="../../bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="../../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../../bower_components/angular/angular.js"></script>
<script type="text/javascript" src="../../bower_components/ng-context-menu/dist/ng-context-menu.min.js"></script>
<script type="text/javascript" src="../../bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
<script type="text/javascript" src="../../bower_components/angular-resource/angular-resource.js"></script>
<script type="text/javascript" src="../../bower_components/angular-route/angular-route.js"></script>
<script type="text/javascript" src="../../bower_components/angular-toggle-switch/angular-toggle-switch.js"></script>
<script type="text/javascript" src="../../bower_components/angular-ui-tinymce/src/tinymce.js"></script>
<script type="text/javascript" src="../../bower_components/ui-select/src/select3.js"></script>
<script type="text/javascript" src="../../bower_components/angular-ui-notification/dist/angular-ui-notification.min.js"></script>
<script type="text/javascript" src="../../bower_components/angular-cookies/angular-cookies.min.js"></script>
<script type="text/javascript" src="../../bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch.min.js"></script>
<script type="text/javascript" src="../../bower_components/moment/moment.js"></script>
<script type="text/javascript" src="../app/scripts/utils/bt-switch.js"></script>

<!-- Application Scripts -->
<script type="text/javascript" src="../app/scripts/app.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/ModalsPaginator.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/NavBar.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/SearchSearchBar.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/DocumentsManager.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/WidgetMeta.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/WidgetFilters.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/modal/FragmentModal.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/modal/AnnotationsModal.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/modal/DocumentSearchFilter.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/modal/UserLoginModal.js"></script>
<script type="text/javascript" src="../app/scripts/controllers/modal/UnsavedAnnotationsManagerModal.js"></script>
<script type="text/javascript" src="../app/scripts/services/Search.SearchBar.js"></script>
<script type="text/javascript" src="../app/scripts/services/Widget.DocumentsList.js"></script>
<script type="text/javascript" src="../app/scripts/services/Widget.Meta.js"></script>
<script type="text/javascript" src="../app/scripts/services/Fragment.js"></script>
<script type="text/javascript" src="../app/scripts/services/User.js"></script>
<script type="text/javascript" src="../app/scripts/services/Annotations.Manager.js"></script>
</html>
