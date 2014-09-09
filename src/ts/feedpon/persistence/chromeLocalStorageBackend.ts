class ChromeLocalStorageBackend implements IStorageBackend {
    constructor(private $q: ng.IQService,
                private storage: chrome.storage.StorageArea) {
    }

    get(keys: string): ng.IPromise<{[key: string]: any}>;
    get(keys: string[]): ng.IPromise<{[key: string]: any}>;
    get(keys: any): ng.IPromise<{[key: string]: any}> {
        var deferred = this.$q.defer();
        var credential = this.storage.get(keys, (itmes) => {
            if (chrome.runtime.lastError != null) {
                deferred.reject(chrome.runtime.lastError);
            } else {
                deferred.resolve(itmes);
            }
        });
        return deferred.promise;
    }

    set(items: {[key: string]: any}): ng.IPromise<void> {
        var deferred = this.$q.defer<void>();
        this.storage.set(items, () => {
            if (chrome.runtime.lastError != null) {
                deferred.reject(chrome.runtime.lastError);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    remove(keys: string): ng.IPromise<void>;
    remove(keys: string[]): ng.IPromise<void>;
    remove(keys: any): ng.IPromise<void> {
        var deferred = this.$q.defer<void>();
        this.storage.remove(keys, () => {
            if (chrome.runtime.lastError != null) {
                deferred.reject(chrome.runtime.lastError);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }
}

export = ChromeLocalStorageBackend;
