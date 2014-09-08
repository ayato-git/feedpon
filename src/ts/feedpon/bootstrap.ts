import AuthenticationService = require('./services/authenticationService');
import ContentController = require('./controllers/contentController');
import CredentialRepository = require('./persistence/credentialRepository');
import EntranceController = require('./controllers/entranceController');
import FeedlyClient = require('./cloud/feedlyClient');
import FeedlyGateway = require('./cloud/feedlyGateway');
import SubscriptionController = require('./controllers/subscriptionController');
import angular = require('angular');
import chromeWebviewDirective = require('./directives/chromeWebviewDirective');
import chromeWindowOpenerFactory = require('./factories/chromeWindowOpenerFactory');
import cordovaWindowOpenerFactory = require('./factories/cordovaWindowOpenerFactory');
import pollingWindowOpenerFactory = require('./factories/pollingWindowOpenerFactory');

require('angular-animate');
require('angular-sanitize');
require('angular-ui-router');
require('ionic-angular');

angular.module('feedpon.cloud', [])
    .constant('feedlyEndPoint', 'http://cloud.feedly.com')
    .service('feedlyClient', FeedlyClient)
    .service('feedlyGateway', FeedlyGateway);

angular.module('feedpon.controllers', [
        'feedpon.cloud',
        'feedpon.services',
        'ionic',
        'ngSanitize'
    ])
    .controller('EntranceController', EntranceController)
    .controller('ContentController', ContentController)
    .controller('SubscriptionController', SubscriptionController);

angular.module('feedpon.persistence', [])
    .value(
        'storage',
        (typeof chrome !== 'undefined') ? chrome.storage.local : window.localStorage
    )
    .service('credentialRepository', CredentialRepository);

angular.module('feedpon.services', ['feedpon.cloud', 'feedpon.persistence'])
    .factory(
        'windowOpener',
        (typeof chrome !== 'undefined') ? <Function> chromeWindowOpenerFactory : <Function> cordovaWindowOpenerFactory
    )
    .service('authenticationService', AuthenticationService);

angular.module('feedpon', ['feedpon.controllers'])
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
            .state('content', {
                url: '/content',
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
} else {
    bootstrap();
}

function bootstrap(): void {
    angular.bootstrap(document, ['feedpon']);
}
