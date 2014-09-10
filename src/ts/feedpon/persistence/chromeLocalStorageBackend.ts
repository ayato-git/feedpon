class ChromeLocalStorageBackend implements IStorageBackend {
    constructor(private $q: ng.IQService,
                private storage: chrome.storage.StorageArea) {
    }

    get(key: string): ng.IPromise<any> {
        return this.getAll([key]).then((items) => items[key]);
    }

    getAll(keys: string[]): ng.IPromise<{[key: string]: any}> {
        var deferred = this.$q.defer();
        this.storage.get(keys, (items) => {
            if (chrome.runtime.lastError != null) {
                deferred.reject(chrome.runtime.lastError);
            } else {
                deferred.resolve(items);
            }
        });
        return deferred.promise;
    }

    set(key: string, item: any): ng.IPromise<void> {
        var data: {[key: string]: any} = {};
        data[key] = item;
        return this.setAll(data);
    }

    setAll(items: {[key: string]: any}): ng.IPromise<void> {
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

    remove(key: string): ng.IPromise<void> {
        return this.removeAll([key]);
    }

    removeAll(keys: string[]): ng.IPromise<void> {
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
