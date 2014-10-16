interface ICredentialRepository {
    get(): ng.IPromise<Credential>;

    put(credential: Credential): ng.IPromise<void>;

    delete(): ng.IPromise<void>;
}

interface IExpandedUrlRepository {
    get(url: string): ng.IPromise<string>;

    put(url: string, expandedUrl: string): ng.IPromise<void>;
}

interface ISubscriptionRepository {
    allSubscriptions(): ng.IPromise<Subscription[]>;

    unreadCounts(): ng.IPromise<UnreadCount[]>;

    putSubscriptions(subscriptions: Subscription[]): ng.IPromise<void>;

    putUnreadCounts(unreadCoutns: UnreadCount[]): ng.IPromise<void>;
}

interface IStorageBackend {
    get(key: string): ng.IPromise<any>;
    getAll(keys: string[]): ng.IPromise<{[key: string]: any}>;

    set(key: string, item: any): ng.IPromise<void>;
    setAll(items: {[key: string]: any}): ng.IPromise<void>;

    remove(key: string): ng.IPromise<void>;
    removeAll(keys: string[]): ng.IPromise<void>;
}

interface IWedataRepository {
    get<T>(database: string): ng.IPromise<WedataItem<T>[]>;

    put<T>(database: string, items: WedataItem<T>[]): ng.IPromise<void>;
}
