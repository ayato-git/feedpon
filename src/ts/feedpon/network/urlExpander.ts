class UrlExpander implements IUrlExpander {
    static API_URL: string = 'http://emonkak.appspot.com/expand';

    constructor(private $http: ng.IHttpService) {
    }

    expand(shortUrl: string): ng.IPromise<string> {
        return this.$http({
                method: 'GET',
                url: UrlExpander.API_URL,
                data: {url: shortUrl}
            })
            .then((data: {[key: string]: string}) => data[shortUrl]);
    }

    expandAll(shortUrls: string[]): ng.IPromise<{[key: string]: string}> {
        return this.$http({
            data: JSON.stringify(shortUrls),
            method: 'POST',
            url: UrlExpander.API_URL
        });
    }
}

export = UrlExpander;
