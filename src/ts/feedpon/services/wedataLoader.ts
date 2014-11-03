class WedataLoader implements IWedataLoader {
    constructor(private httpClient: IHttpClient,
                private wedataStore: IWedataStore) {
    }

    getItems<T>(resourceUrl: string): ng.IPromise<WedataItem<T>[]> {
        return this.wedataStore.get<T>(resourceUrl)
            .then((items): any => {
                if (items && items.length) return items;
                return this.reloadItems(resourceUrl);
            });
    }

    reloadItems<T>(resourceUrl: string): ng.IPromise<WedataItem<T>[]> {
        return this.httpClient.request<WedataItem<T>[]>({
            method: 'GET',
            responseType: 'json',
            url: resourceUrl + '/items_all.json',
        }).then((response) => {
            return this.wedataStore.put<T>(response.data)
                .then(() => response.data);
        });
    }
}

export = WedataLoader;
