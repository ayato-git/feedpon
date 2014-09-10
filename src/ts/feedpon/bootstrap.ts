import AuthenticationService = require('./services/authenticationService');
import ChromeLocalStorageBackend = require('./persistence/chromeLocalStorageBackend');
import ContentController = require('./controllers/contentController');
import CredentialRepository = require('./persistence/credentialRepository');
import EntranceController = require('./controllers/entranceController');
import FeedlyClientService = require('./services/feedlyClientService');
import FeedlyGatewayService = require('./services/feedlyGatewayService');
import LocalStorageBackend = require('./persistence/localStorageBackend');
import SubscriptionController = require('./controllers/subscriptionController');
import SubscriptionRepository = require('./persistence/subscriptionRepository');
import WelcomeController = require('./controllers/entranceController');
import angular = require('angular');
import chromeWebviewDirective = require('./directives/chromeWebviewDirective');
import chromeWindowOpenerFactory = require('./factories/chromeWindowOpenerFactory');
import cordovaWindowOpenerFactory = require('./factories/cordovaWindowOpenerFactory');

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
    .constant('feedlyEndPoint', 'http://cloud.feedly.com')
    .service('feedlyClientService', FeedlyClientService)
    .service('feedlyGatewayService', FeedlyGatewayService)
    .factory(
        'windowOpener',
         <Function> ((typeof chrome !== 'undefined') ? chromeWindowOpenerFactory : cordovaWindowOpenerFactory)
    )
    .service('authenticationService', AuthenticationService);

angular.module('feedpon', ['feedpon.controllers', 'ui.router'])
    .directive('webview', chromeWebviewDirective)

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
                url: '/content/{streamId:.*}',
                templateUrl: 'templates/content.html',
                controller: 'ContentController'
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
} else {
    bootstrap();
}

function bootstrap(): void {
    angular.bootstrap(document, ['feedpon']);
}
