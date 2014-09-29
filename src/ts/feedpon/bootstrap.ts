import AuthenticationService = require('./services/authenticationService');
import ChromeLocalStorageBackend = require('./persistence/chromeLocalStorageBackend');
import ContentController = require('./controllers/contentController');
import CredentialRepository = require('./persistence/credentialRepository');
import EntranceController = require('./controllers/entranceController');
import FeedlyAuthenticator = require('./services/feedlyAuthenticator');
import FeedlyGateway = require('./services/feedlyGateway');
import HttpClient = require('./services/httpClient');
import HttpClientOnWorker = require('./services/httpClientOnWorker');
import LocalStorageBackend = require('./persistence/localStorageBackend');
import PromiseQueue = require('./services/promiseQueue');
import SubscriptionController = require('./controllers/subscriptionController');
import SubscriptionRepository = require('./persistence/subscriptionRepository');
import WelcomeController = require('./controllers/welcomeController');
import angular = require('angular');
import chromeWebview = require('./directives/chromeWebview');
import chromeWindowOpenerFactory = require('./factories/chromeWindowOpenerFactory');
import cordovaWindowOpenerFactory = require('./factories/cordovaWindowOpenerFactory');
import cspBindHtml = require('./directives/cspBindHtml');
import cspSrc = require('./directives/cspSrc');
import hatenaBookmark = require('./directives/hatenaBookmark');

require('angular-animate');
require('angular-sanitize');
require('angular-ui-router');
require('ionic-angular');

angular.module('feedpon.controllers', [
        'feedpon.services',
        'ionic',
        'ngSanitize'
    ])
    .controller('EntranceController', EntranceController)
    .controller('ContentController', ContentController)
    .controller('SubscriptionController', SubscriptionController)
    .controller('WelcomeController', WelcomeController);

angular.module('feedpon.persistence', [])
    .factory('storage', ($q: ng.IQService): IStorageBackend => {
        if (typeof chrome !== 'undefined') {
            return new ChromeLocalStorageBackend($q, chrome.storage.local);
        } else {
            return new LocalStorageBackend($q, window.localStorage);
        }
    })
    .service('credentialRepository', CredentialRepository)
    .service('subscriptionRepository', SubscriptionRepository);

angular.module('feedpon.services', ['feedpon.persistence'])
    .constant('timeProvider', Date.now)
    .constant('feedlyEndPoint', 'http://cloud.feedly.com')
    .service(
        'httpClient',
        (typeof chrome !== 'undefined') ? <Function> HttpClientOnWorker : HttpClient
    )
    .service('feedlyAuthenticator', FeedlyAuthenticator)
    .service('feedlyGateway', FeedlyGateway)
    .factory(
        'windowOpener',
         (typeof chrome !== 'undefined') ? <Function> chromeWindowOpenerFactory : cordovaWindowOpenerFactory
    )
    .service('authenticationService', AuthenticationService);

angular.module('feedpon', ['feedpon.controllers', 'ui.router'])
    .factory('promiseQueue', () => {
        return new PromiseQueue(4);
    })

    .directive('webview', chromeWebview)
    .directive('cspSrc', cspSrc)
    .directive('cspBindHtml', cspBindHtml)
    .directive('hatenaBookmark', hatenaBookmark)

    /**
     * @ngInject
     */
    .config(($stateProvider: ng.ui.IStateProvider) => {
        $stateProvider
            .state('entrance', {
                url: '/',
                templateUrl: 'templates/entrance.html'
            })
            .state('welcome', {
                url: '/welcome/',
                templateUrl: 'templates/welcome.html'
            })
            .state('content', {
                url: '/content/{streamId:.+}',
                templateUrl: 'templates/content.html'
            });
    })

    /**
     * @ngInject
     */
    .config(($urlRouterProvider: ng.ui.IUrlRouterProvider) => {
        $urlRouterProvider.otherwise('/');
    })

    /**
     * @ngInject
     */
    .config(($sceProvider: ng.ISCEProvider) => {
        $sceProvider.enabled(false);
    });

if ('cordova' in window) {
    document.addEventListener('deviceready', bootstrap, false);

    // Open the link by InAppBrowser
    document.addEventListener('click', (e) => {
        var target = <Element> e.target;

        do {
            if (target.nodeName === 'A' &&
                target.getAttribute('target') === '_blank') {
                e.preventDefault();

                var uri = target.getAttribute('href');

                window.open(uri, '_blank', 'location=no');

                break;
            }
        } while ((target = <Element> target.parentNode) &&
                  target.nodeType !== target.DOCUMENT_NODE);
    }, false);
} else {
    bootstrap();
}

function bootstrap(): void {
    angular.bootstrap(document, ['feedpon']);
}
