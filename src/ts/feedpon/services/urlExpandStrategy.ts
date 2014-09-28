class UrlExpandStrategy implements IUrlExpandStrategy {
    static API_URL: string = 'http://emonkak.appspot.com/expand';

    /**
     * @ngInject
     */
    constructor(private $http: ng.IHttpService) {
    }

    expand(url: string): ng.IPromise<string> {
        return this.$http({
                method: 'GET',
                url: UrlExpandStrategy.API_URL,
                data: {url: url}
            })
            .then((data: {[key: string]: string}) => data[url]);
    }

    expandAll(urls: string[]): ng.IPromise<{[key: string]: string}> {
        return this.$http({
            method: 'POST',
            url: UrlExpandStrategy.API_URL,
            data: urls
        });
    }
}

export = UrlExpandStrategy;
