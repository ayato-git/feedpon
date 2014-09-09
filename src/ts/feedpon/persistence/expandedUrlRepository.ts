class ExpandedUrlRepository implements IExpandedUrlRepository {
    /**
     * @ngInject
     */
    constructor(private storage: IStorageBackend) {
    }

    find(url: string): ng.IPromise<string> {
        var key = 'expandedUrl.' + url;
        return this.storage.get(key)
            .then((items) => items[key]);
    }

    put(url: string, expandedUrl: string): ng.IPromise<void> {
        var key = 'expandedUrl.' + url;
        return this.storage.set({key: expandedUrl});
    }
}

export = ExpandedUrlRepository;
