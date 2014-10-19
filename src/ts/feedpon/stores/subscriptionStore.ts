class SubscriptionStore implements ISubscriptionStore {
    /**
     * @ngInject
     */
    constructor(private storage: IStorageBackend) {
    }

    allSubscriptions(): ng.IPromise<Subscription[]> {
        return this.storage.get('subscriptions');
    }

    unreadCounts(): ng.IPromise<UnreadCount[]> {
        return this.storage.get('unreadCounts');
    }

    putSubscriptions(subscriptions: Subscription[]): ng.IPromise<void> {
        return this.storage.set('subscriptions', subscriptions);
    }

    putUnreadCounts(unreadCounts: UnreadCount[]): ng.IPromise<void> {
        return this.storage.set('unreadCounts', unreadCounts);
    }
}

export = SubscriptionStore;
