import AuthenticationService = require('../services/authenticationService');
import FeedlyAuthenticator = require('../services/feedlyAuthenticator');
import FeedlyGateway = require('../services/feedlyGateway');
import HttpClient = require('../services/httpClient');
import HttpClientOnWorker = require('../services/httpClientOnWorker');
import PromiseQueue = require('../services/promiseQueue');
import angular = require('angular');
import chromeWindowOpenerFactory = require('../factories/chromeWindowOpenerFactory');
import cordovaWindowOpenerFactory = require('../factories/cordovaWindowOpenerFactory');
import persistenceModule = require('./persistenceModule');

var m = angular.module('feedpon.services', [persistenceModule.name])
    .constant('feedlyEndPoint', 'http://cloud.feedly.com')
    .constant('timeProvider', Date.now)
    .factory('promiseQueue', () => {
        return new PromiseQueue(4);
    })
    .factory(
        'windowOpener',
         (typeof chrome !== 'undefined')
            ? <Function> chromeWindowOpenerFactory
            : <Function> cordovaWindowOpenerFactory
    )
    .service('authenticationService', AuthenticationService)
    .service('feedlyAuthenticator', FeedlyAuthenticator)
    .service('feedlyGateway', FeedlyGateway)
    .service(
        'httpClient',
        (typeof chrome !== 'undefined')
            ? <Function> HttpClientOnWorker
            : <Function> HttpClient
    );

export = m;
