<?php
require 'app.php';
?>
<!-- index.html -->

<!doctype html>
<html>
<head>
    <title>Semantic Annotator :: Read & Edit</title>
    <link rel="icon" href="src/nerdherd.ico" />
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
</head>
<body ng-app="semanticNotations">

<!--
 Codice per accettazione cookie - Inizio
 -->
<script type='text/javascript'>
    //<![CDATA[
    (function(window) {
        if (!!window.cookieChoices) {
            return window.cookieChoices;
        }
        var document = window.document;
        var supportsTextContent = 'textContent' in document.body;
        var cookieChoices = (function() {
            var cookieName = 'displayCookieConsent';
            var cookieConsentId = 'cookieChoiceInfo';
            var dismissLinkId = 'cookieChoiceDismiss';
            function _createHeaderElement(cookieText, dismissText, linkText, linkHref) {
                var butterBarStyles = 'position:fixed;width:100%;background-color:#fff;' +
                        'margin:0; left:0; top:0;padding:4px;z-index:1000;text-align:center;color:#000;';
                var cookieConsentElement = document.createElement('div');
                cookieConsentElement.id = cookieConsentId;
                cookieConsentElement.style.cssText = butterBarStyles;
                cookieConsentElement.appendChild(_createConsentText(cookieText));
                if (!!linkText && !!linkHref) {
                    cookieConsentElement.appendChild(_createInformationLink(linkText, linkHref));
                }
                cookieConsentElement.appendChild(_createDismissLink(dismissText));
                return cookieConsentElement;
            }
            function _createDialogElement(cookieText, dismissText, linkText, linkHref) {
                var glassStyle = 'position:fixed;width:100%;height:100%;z-index:999;' +
                        'top:0;left:0;opacity:0.5;filter:alpha(opacity=50);' +
                        'background-color:#ccc;';
                var dialogStyle = 'z-index:1000;position:fixed;left:50%;top:50%';
                var contentStyle = 'position:relative;left:-50%;margin-top:-25%;' +
                        'background-color:#fff;padding:20px;box-shadow:4px 4px 25px #888;';
                var cookieConsentElement = document.createElement('div');
                cookieConsentElement.id = cookieConsentId;
                var glassPanel = document.createElement('div');
                glassPanel.style.cssText = glassStyle;
                var content = document.createElement('div');
                content.style.cssText = contentStyle;
                var dialog = document.createElement('div');
                dialog.style.cssText = dialogStyle;
                var dismissLink = _createDismissLink(dismissText);
                dismissLink.style.display = 'block';
                dismissLink.style.textAlign = 'right';
                dismissLink.style.marginTop = '8px';
                content.appendChild(_createConsentText(cookieText));
                if (!!linkText && !!linkHref) {
                    content.appendChild(_createInformationLink(linkText, linkHref));
                }
                content.appendChild(dismissLink);
                dialog.appendChild(content);
                cookieConsentElement.appendChild(glassPanel);
                cookieConsentElement.appendChild(dialog);
                return cookieConsentElement;
            }
            function _setElementText(element, text) {
                if (supportsTextContent) {
                    element.textContent = text;
                } else {
                    element.innerText = text;
                }
            }
            function _createConsentText(cookieText) {
                var consentText = document.createElement('span');
                _setElementText(consentText, cookieText);
                return consentText;
            }
            function _createDismissLink(dismissText) {
                var dismissLink = document.createElement('a');
                _setElementText(dismissLink, dismissText);
                dismissLink.id = dismissLinkId;
                dismissLink.href = '#';
                dismissLink.style.marginLeft = '24px';
                return dismissLink;
            }
            function _createInformationLink(linkText, linkHref) {
                var infoLink = document.createElement('a');
                _setElementText(infoLink, linkText);
                infoLink.href = linkHref;
                infoLink.target = '_blank';
                infoLink.style.marginLeft = '8px';
                return infoLink;
            }
            function _dismissLinkClick() {
                _saveUserPreference();
                _removeCookieConsent();
                return false;
            }
            function _showCookieConsent(cookieText, dismissText, linkText, linkHref, isDialog) {
                if (_shouldDisplayConsent()) {
                    _removeCookieConsent();
                    var consentElement = (isDialog) ?
                            _createDialogElement(cookieText, dismissText, linkText, linkHref) :
                            _createHeaderElement(cookieText, dismissText, linkText, linkHref);
                    var fragment = document.createDocumentFragment();
                    fragment.appendChild(consentElement);
                    document.body.appendChild(fragment.cloneNode(true));
                    document.getElementById(dismissLinkId).onclick = _dismissLinkClick;
                }
            }
            function showCookieConsentBar(cookieText, dismissText, linkText, linkHref) {
                _showCookieConsent(cookieText, dismissText, linkText, linkHref, false);
            }
            function showCookieConsentDialog(cookieText, dismissText, linkText, linkHref) {
                _showCookieConsent(cookieText, dismissText, linkText, linkHref, true);
            }
            function _removeCookieConsent() {
                var cookieChoiceElement = document.getElementById(cookieConsentId);
                if (cookieChoiceElement != null) {
                    cookieChoiceElement.parentNode.removeChild(cookieChoiceElement);
                }
            }
            function _saveUserPreference() {
                // Durata del cookie di un anno
                var expiryDate = new Date();
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                document.cookie = cookieName + '=y; expires=' + expiryDate.toGMTString();
            }
            function _shouldDisplayConsent() {
                // Per mostrare il banner solo in mancanza del cookie
                return !document.cookie.match(new RegExp(cookieName + '=([^;]+)'));
            }
            var exports = {};
            exports.showCookieConsentBar = showCookieConsentBar;
            exports.showCookieConsentDialog = showCookieConsentDialog;
            return exports;
        })();
        window.cookieChoices = cookieChoices;
        return cookieChoices;
    })(this);
    document.addEventListener('DOMContentLoaded', function(event) {
        cookieChoices.showCookieConsentDialog('Questo sito utilizza i cookie per migliorare servizi ed esperienza dei lettori. Se decidi di continuare la navigazione consideriamo che accetti il loro uso.',
                'OK', 'Info', "javascript:Popup('informativa_privacy.html')");
    });
    var stile = "top=150, left=250, width=800, height=300, status=no, menubar=no, toolbar=no scrollbars=no";

    function Popup(apri)
    {
        window.open(apri, "", stile);
    }
    //]]>
</script>
<!-- Codice per accettazione cookie - Fine -->

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