import ChromeLocalStorageBackend = require('../persistence/chromeLocalStorageBackend');
import CredentialRepository = require('../persistence/credentialRepository');
import LocalStorageBackend = require('../persistence/localStorageBackend');
import SubscriptionRepository = require('../persistence/subscriptionRepository');
import angular = require('angular');

var m = angular.module('feedpon.persistence', [])
    .factory('storage', ($q: ng.IQService): IStorageBackend => {
        if (typeof chrome !== 'undefined') {
            return new ChromeLocalStorageBackend($q, chrome.storage.local);
        } else {
            return new LocalStorageBackend($q, window.localStorage);
        }
    })
    .service('credentialRepository', CredentialRepository)
    .service('subscriptionRepository', SubscriptionRepository);

export = m;
