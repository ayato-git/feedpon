import IndexedDbHelper = require('./indexedDbHelper');

var WEDATA_STORE = 'wedata';
var DATABASE_RESOROUCE_URL_INDEX = 'databaseResourceUrl';

class WedataStore implements IWedataStore {
    /**
     * @ngInject
     */
    constructor(private indexedDb: ng.IPromise<IDBDatabase>,
                private indexedDbHelper: IndexedDbHelper) {
    }

    get<T>(resourceUrl: string): ng.IPromise<WedataItem<T>[]> {
        return this.indexedDb
            .then((db) => {
                var tx = db.transaction(WEDATA_STORE, 'readonly')
                var store = tx.objectStore(WEDATA_STORE);
                var index = store.index(DATABASE_RESOROUCE_URL_INDEX);
                return this.indexedDbHelper.findAll(index, IDBKeyRange.only(resourceUrl));
            });
    }

    put<T>(items: WedataItem<T>[]): ng.IPromise<void> {
        return this.indexedDb
            .then((db) => {
                var tx = db.transaction(WEDATA_STORE, 'readwrite')
                var store = tx.objectStore(WEDATA_STORE);
                return this.indexedDbHelper.replaceAll(store, items);
            });
    }
}

export = WedataStore;
