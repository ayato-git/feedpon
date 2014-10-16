class WedataLoader implements IWedataLoader {
    constructor(private httpClient: IHttpClient,
                private wedataRepository: IWedataRepository) {
    }

    getItems<T>(database: string): ng.IPromise<WedataItem<T>[]> {
        return this.wedataRepository.get<T>(database)
            .catch(() => this.reloadItems(database));
    }

    reloadItems<T>(database: string): ng.IPromise<WedataItem<T>[]> {
        return this.httpClient.request<WedataItem<T>[]>({
            method: 'GET',
            url: 'http://wedata.net/databases/' + database + '/items_all.json'
        }).then((response) => {
            return this.wedataRepository.put<T>(database, response.data)
                .then(() => response.data);
        });
    }
}

export = WedataLoader;
