class WedataLoader implements IWedataLoader {
    constructor(private httpClient: IHttpClient,
                private wedataStore: IWedataStore) {
    }

    getItems<T>(database: string): ng.IPromise<WedataItem<T>[]> {
        return this.wedataStore.get<T>(database)
            .catch(() => this.reloadItems(database));
    }

    reloadItems<T>(database: string): ng.IPromise<WedataItem<T>[]> {
        return this.httpClient.request<WedataItem<T>[]>({
            method: 'GET',
            url: 'http://wedata.net/databases/' + database + '/items_all.json'
        }).then((response) => {
            return this.wedataStore.put<T>(database, response.data)
                .then(() => response.data);
        });
    }
}

export = WedataLoader;
