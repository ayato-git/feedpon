import AuthenticationService = require('../services/authenticationService');
import FeedlyAuthenticator = require('../services/feedlyAuthenticator');
import FeedlyGateway = require('../services/feedlyGateway');
import FullContentLoader = require('../services/fullContentLoader');
import HttpClient = require('../services/httpClient');
import HttpClientOnWorker = require('../services/httpClientOnWorker');
import PromiseQueue = require('../services/promiseQueue');
import WedataLoader = require('../services/wedataLoader');
import angular = require('angular');
import storesModule = require('./storesModule');
import windowOpenerOnChrome = require('../services/windowOpenerOnChrome');
import windowOpenerOnCordova = require('../services/windowOpenerOnCordova');

var m = angular.module('feedpon.services', [storesModule.name])
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
    .service('fullContentLoader', FullContentLoader)
    .service('httpClient',
             (typeof chrome !== 'undefined') ?  <Function> HttpClientOnWorker : <Function> HttpClient)
    .service('wedataLoader', WedataLoader);

export = m;
