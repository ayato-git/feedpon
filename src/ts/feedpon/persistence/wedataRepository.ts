class WedataRepository implements IWedataRepository {
    /**
     * @ngInject
     */
    constructor(private storage: IStorageBackend) {
    }

    get<T>(database: string): ng.IPromise<WedataItem<T>[]> {
        return this.storage.get('wedata.' + database);
    }

    put<T>(database: string, items: WedataItem<T>[]): ng.IPromise<void> {
        return this.storage.set('wedata.' + database, items);
    }
}

export = WedataRepository;
