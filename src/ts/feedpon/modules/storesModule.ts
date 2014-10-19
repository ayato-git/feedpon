import ChromeLocalStorageBackend = require('../stores/chromeLocalStorageBackend');
import CredentialStore = require('../stores/credentialStore');
import LocalStorageBackend = require('../stores/localStorageBackend');
import SubscriptionStore = require('../stores/subscriptionStore');
import WedataStore = require('../stores/wedataStore');
import angular = require('angular');

var m = angular.module('feedpon.stores', [])
    .factory('storage', ($q: ng.IQService): IStorageBackend => {
        if (typeof chrome !== 'undefined') {
            return new ChromeLocalStorageBackend($q, chrome.storage.local);
        } else {
            return new LocalStorageBackend($q, window.localStorage);
        }
    })
    .service('credentialStore', CredentialStore)
    .service('subscriptionStore', SubscriptionStore)
    .service('wedataStore', WedataStore);

export = m;
