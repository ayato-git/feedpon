class ExpandedUrlStore implements IExpandedUrlStore {
    /**
     * @ngInject
     */
    constructor(private storage: IStorageBackend) {
    }

    get(url: string): ng.IPromise<string> {
        return this.storage.get('expandedUrl.' + url);
    }

    put(url: string, expandedUrl: string): ng.IPromise<void> {
        return this.storage.set('expandedUrl.' + url, expandedUrl);
    }
}

export = ExpandedUrlStore;
