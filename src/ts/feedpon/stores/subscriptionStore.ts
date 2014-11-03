import IndexedDbHelper = require('./indexedDbHelper');

var SUBSCRIPTIONS_STORE = 'subscriptions';
var UNREAD_COUNTS_STORE = 'unreadCounts';

class SubscriptionStore implements ISubscriptionStore {
    /**
     * @ngInject
     */
    constructor(private indexedDb: ng.IPromise<IDBDatabase>,
                private indexedDbHelper: IndexedDbHelper) {
    }

    allSubscriptions(): ng.IPromise<Subscription[]> {
        return this.indexedDb
            .then((db) => {
                var tx = db.transaction(SUBSCRIPTIONS_STORE, 'readonly');
                var store = tx.objectStore(SUBSCRIPTIONS_STORE);
                return this.indexedDbHelper.findAll(store);
            });
    }

    unreadCounts(): ng.IPromise<UnreadCount[]> {
        return this.indexedDb
            .then((db) => {
                var tx = db.transaction(UNREAD_COUNTS_STORE, 'readonly');
                var store = tx.objectStore(UNREAD_COUNTS_STORE);
                return this.indexedDbHelper.findAll(store);
            });
    }

    putSubscriptions(subscriptions: Subscription[]): ng.IPromise<void> {
        return this.indexedDb
            .then((db) => {
                var tx = db.transaction(SUBSCRIPTIONS_STORE, 'readwrite');
                var store = tx.objectStore(SUBSCRIPTIONS_STORE);
                return this.indexedDbHelper.replaceAll(store, subscriptions);
            });
    }

    putUnreadCounts(unreadCounts: UnreadCount[]): ng.IPromise<void> {
        return this.indexedDb
            .then((db) => {
                var tx = db.transaction(UNREAD_COUNTS_STORE, 'readwrite');
                var store = tx.objectStore(UNREAD_COUNTS_STORE);
                return this.indexedDbHelper.replaceAll(store, unreadCounts);
            });
    }
}

export = SubscriptionStore;
