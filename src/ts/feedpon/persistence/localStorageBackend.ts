class LocalStorageBackend implements IStorageBackend {
    constructor(private $q: ng.IQService,
                private storage: Storage) {
    }

    get(key: string): ng.IPromise<any> {
        return this.$q.when(this.storage.getItem(key));
    }

    getAll(keys: string[]): ng.IPromise<{[key: string]: any}> {
        var result: {[key: string]: any} = {};

        keys.forEach((key) => result[key] = this.storage.getItem(key));

        return this.$q.when(result);
    }

    set(key: string, item: any): ng.IPromise<void> {
        this.storage.setItem(key, JSON.stringify(item));
        return this.$q.when();
    }

    setAll(items: {[key: string]: any}): ng.IPromise<void> {
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.storage.setItem(key, JSON.stringify(items[key]));
            }
        }

        return this.$q.when();
    }

    remove(key: string): ng.IPromise<void> {
        this.storage.removeItem(key);
        return this.$q.when();
    }

    removeAll(keys: string[]): ng.IPromise<void> {
        keys.forEach((key) => this.storage.removeItem(key));
        return this.$q.when();
    }
}

export = LocalStorageBackend;
