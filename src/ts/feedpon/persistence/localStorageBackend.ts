class LocalStorageBackend implements IStorageBackend {
    constructor(private $q: ng.IQService,
                private storage: Storage) {
    }

    get(keys: string): ng.IPromise<{[key: string]: any}>;
    get(keys: string[]): ng.IPromise<{[key: string]: any}>;
    get(keys: any): ng.IPromise<{[key: string]: any}> {
        var result: {[key: string]: any} = {};
        if (Array.isArray(keys)) {
            (<string[]> keys).forEach((key) => {
                result[key] = this.storage.getItem(key);
            });
        } else {
            result[keys] = this.storage.getItem(keys);
        }

        return this.$q.when(result);
    }

    set(items: {[key: string]: any}): ng.IPromise<void> {
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.storage.setItem(key, JSON.stringify(items[key]));
            }
        }

        return this.$q.when();
    }

    remove(keys: string): ng.IPromise<void>;
    remove(keys: string[]): ng.IPromise<void>;
    remove(keys: any): ng.IPromise<void> {
        if (Array.isArray(keys)) {
            (<string[]> keys).forEach((key) => {
                this.storage.removeItem(key);
            });
        } else {
            this.storage.removeItem(keys);
        }

        return this.$q.when();
    }
}

export = LocalStorageBackend;
