import AuthenticationService = require('../services/authenticationService');
import FeedlyAuthenticator = require('../services/feedlyAuthenticator');
import FeedlyGateway = require('../services/feedlyGateway');
import HttpClient = require('../services/httpClient');
import HttpClientOnWorker = require('../services/httpClientOnWorker');
import PromiseQueue = require('../services/promiseQueue');
import angular = require('angular');
import htmlParser = require('../services/htmlParser');
import persistenceModule = require('./persistenceModule');
import windowOpenerOnChrome = require('../services/windowOpenerOnChrome');
import windowOpenerOnCordova = require('../services/windowOpenerOnCordova');

var m = angular.module('feedpon.services', [persistenceModule.name])
    .constant('feedlyEndPoint', 'http://cloud.feedly.com')
    .constant('timeProvider', Date.now)
    .factory('promiseQueue', () => {
        return new PromiseQueue(4);
    })
    .factory(
        'windowOpener',
         (typeof chrome !== 'undefined')
            ? <Function> windowOpenerOnChrome
            : <Function> windowOpenerOnCordova
    )
    .service('authenticationService', AuthenticationService)
    .service('feedlyAuthenticator', FeedlyAuthenticator)
    .service('feedlyGateway', FeedlyGateway)
    .service('htmlParser', htmlParser)
    .service(
        'httpClient',
        (typeof chrome !== 'undefined')
            ? <Function> HttpClientOnWorker
            : <Function> HttpClient
    );

export = m;
