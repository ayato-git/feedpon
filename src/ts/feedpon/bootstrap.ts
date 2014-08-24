/// <reference path="interfaces.d.ts" />

import angular = require('angular');
import cordovaWindowOpenerFactory = require('./factories/cordovaWindowOpenerFactory');

import FeedlyClient = require('./cloud/feedlyClient');
import FeedlyGateway = require('./cloud/feedlyGateway');
import ContentController = require('./controllers/contentController');
import SubscriptionController = require('./controllers/subscriptionController');
import CredentialRepository = require('./persistence/credentialRepository');
import AuthenticationService = require('./services/authenticationService');

angular.module('feedpon.cloud', [])
    .constant('feedlyEndPoint', 'http://cloud.feedly.com')
    .service('feedlyClient', ['$http', 'feedlyEndPoint', FeedlyClient])
    .service('feedlyGateway', ['$q', 'feedlyClient', FeedlyGateway]);

angular.module('feedpon.controllers', ['feedpon.cloud', 'feedpon.services', 'ionic'])
    .controller('ContentController', [
        '$scope',
        '$ionicSideMenuDelegate',
        'authenticationService',
        ContentController
    ])
    .controller('SubscriptionController', [
        '$scope',
        '$q',
        'feedlyGateway',
        SubscriptionController
    ]);

angular.module('feedpon.persistence', [])
    .value('storage', window.localStorage)
    .service('credentialRepository', ['storage', CredentialRepository]);

angular.module('feedpon.services', ['feedpon.cloud', 'feedpon.persistence'])
    .factory('windowOpener', [
        '$q',
        '$window',
        cordovaWindowOpenerFactory
    ])
    .service('authenticationService', [
        '$q',
        'windowOpener',
        'feedlyGateway',
        'credentialRepository',
        AuthenticationService
    ]);

angular.module('feedpon', ['feedpon.controllers']);
