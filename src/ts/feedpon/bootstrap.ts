import AuthenticationService = require('./services/authenticationService');
import ContentController = require('./controllers/contentController');
import CredentialRepository = require('./persistence/credentialRepository');
import FeedlyClient = require('./cloud/feedlyClient');
import FeedlyGateway = require('./cloud/feedlyGateway');
import SubscriptionController = require('./controllers/subscriptionController');
import angular = require('angular');
import cordovaWindowOpenerFactory = require('./factories/cordovaWindowOpenerFactory');

angular.module('feedpon.cloud', [])
    .constant('feedlyEndPoint', 'http://cloud.feedly.com')
    .service('feedlyClient', FeedlyClient)
    .service('feedlyGateway', FeedlyGateway);

angular.module('feedpon.controllers', ['feedpon.cloud', 'feedpon.services', 'ionic'])
    .controller('ContentController', ContentController)
    .controller('SubscriptionController', SubscriptionController);

angular.module('feedpon.persistence', [])
    .value('storage', window.localStorage)
    .service('credentialRepository', CredentialRepository);

angular.module('feedpon.services', ['feedpon.cloud', 'feedpon.persistence'])
    .factory('windowOpener', cordovaWindowOpenerFactory)
    .service('authenticationService', AuthenticationService);

angular.module('feedpon', ['feedpon.controllers']);

if ('cordova' in window) {
    document.addEventListener('deviceready', initialize, false);
} else {
    initialize();
}

function initialize(): void {
    angular.bootstrap(document, ['feedpon']);
}
