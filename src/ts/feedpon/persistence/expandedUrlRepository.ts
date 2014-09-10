class ExpandedUrlRepository implements IExpandedUrlRepository {
    /**
     * @ngInject
     */
    constructor(private storage: IStorageBackend) {
    }

    find(url: string): ng.IPromise<string> {
        return this.storage.get('expandedUrl.' + url);
    }

    put(url: string, expandedUrl: string): ng.IPromise<void> {
        return this.storage.set('expandedUrl.' + url, expandedUrl);
    }
}

export = ExpandedUrlRepository;
