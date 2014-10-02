import chromeWebview = require('../directives/chromeWebview');
import cspBindHtml = require('../directives/cspBindHtml');
import cspSrc = require('../directives/cspSrc');
import hatenaBookmark = require('../directives/hatenaBookmark');
import servicesModule = require('./servicesModule');

var m = angular.module('feedpon.directives', [servicesModule.name])
    .directive('webview', chromeWebview)
    .directive('cspSrc', cspSrc)
    .directive('cspBindHtml', cspBindHtml)
    .directive('hatenaBookmark', hatenaBookmark);

export = m;
