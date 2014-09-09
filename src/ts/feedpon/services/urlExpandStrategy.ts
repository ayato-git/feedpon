class UrlExpandStrategy implements IUrlExpandStrategy {
    static API_URL: string = 'http://emonkak.appspot.com/expand';

    /**
     * @ngInject
     */
    constructor(private $http: ng.IHttpService) {
    }

    expand(shortUrl: string): ng.IPromise<string> {
        return this.$http({
                method: 'GET',
                url: UrlExpandStrategy.API_URL,
                data: {url: shortUrl}
            })
            .then((data: {[key: string]: string}) => data[shortUrl]);
    }

    expandAll(shortUrls: string[]): ng.IPromise<{[key: string]: string}> {
        return this.$http({
            data: JSON.stringify(shortUrls),
            method: 'POST',
            url: UrlExpandStrategy.API_URL
        });
    }
}

export = UrlExpandStrategy;
