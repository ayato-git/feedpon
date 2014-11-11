class IndexedDbHelper {
    constructor(private $q: ng.IQService) {
    }

    find(store: { get: (key: any) => IDBRequest }, key: any): ng.IPromise<any> {
        var deffered = this.$q.defer();
        var req = store.get(key);

        req.onsuccess = function onSuccess(e) {
            var result: any = (<any> e.target).result;
            deffered.resolve(result);
        };
        req.onerror = function onError(e) {
            deffered.reject((<IDBRequest> e.target).error);
        };

        return deffered.promise;
    }

    findAll(store: { openCursor: (range?: any, direction?: string) => IDBRequest }, range?: IDBKeyRange, direction?: string): ng.IPromise<any[]> {
        var deffered = this.$q.defer();
        var req = store.openCursor(range, direction);
        var result: Subscription[] = [];

        req.onsuccess = function onSuccess(e) {
            var cursor: IDBCursorWithValue = (<any> e.target).result;
            if (cursor) {
                result.push(cursor.value);
                cursor.continue();
            } else {
                deffered.resolve(result);
            }
        };
        req.onerror = function onError(e) {
            deffered.reject((<IDBRequest> e.target).error);
        };

        return deffered.promise;
    }

    each(store: { openCursor: (range?: any, direction?: string) => IDBRequest }, callback: (value: any) => void): void {
        var req = store.openCursor();

        req.onsuccess = function onSuccess(e) {
            var cursor: IDBCursorWithValue = (<IDBRequest> e.target).result;
            if (cursor) {
                callback(cursor.value);
                cursor.continue();
            }
        };
    }

    insert(store: IDBObjectStore, value: any): ng.IPromise<void> {
        var deffered = this.$q.defer<void>();
        var req = store.add(value);

        req.onsuccess = function onSuccess(e) {
            deffered.resolve();
        };
        req.onerror = function onError(e) {
            deffered.reject((<IDBRequest> e.target).error);
        };

        return deffered.promise;
    }

    insertAll(store: IDBObjectStore, values: any[]): ng.IPromise<void> {
        var promises = values.map((value) => this.insertAll(store, value));
        return this.$q.all(promises).then(() => this.$q.when());
    }

    replace(store: IDBObjectStore, value: any): ng.IPromise<void> {
        var deffered = this.$q.defer<void>();
        var req = store.put(value);

        req.onsuccess = function onSuccess(e) {
            deffered.resolve();
        };
        req.onerror = function onError(e) {
            deffered.reject((<IDBRequest> e.target).error);
        };

        return deffered.promise;
    }

    replaceAll(store: IDBObjectStore, values: any[]): ng.IPromise<void> {
        var promises = values.map((value) => this.replace(store, value));
        return this.$q.all(promises).then(() => this.$q.when());
    }

    delete(store: IDBObjectStore, key: any): ng.IPromise<void> {
        var deffered = this.$q.defer<void>();
        var req = store.delete(key);

        req.onsuccess = function onSuccess(e) {
            deffered.resolve();
        };
        req.onerror = function onError(e) {
            deffered.reject((<IDBRequest> e.target).error);
        };

        return deffered.promise;
    }

    deleteAll(store: IDBObjectStore): ng.IPromise<void> {
        var deffered = this.$q.defer<void>();
        var req = store.clear();

        req.onsuccess = function onSuccess(e) {
            deffered.resolve();
        };
        req.onerror = function onError(e) {
            deffered.reject((<IDBRequest> e.target).error);
        };

        return deffered.promise;
    }
}

export = IndexedDbHelper;
