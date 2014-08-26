import angular = require('angular');

class UrlExpandService {
    /**
     * @ngInject
     */
    constructor(private $q: ng.IQService,
                private urlExpander: IUrlExpander,
                private longUrlRepository: ILongUrlRepository) {
    }

    expand(shortUrl: string): ng.IPromise<string> {
        var longUrl = this.longUrlRepository.find(shortUrl);
        if (longUrl != null) {
            var deferred = this.$q.defer();
            deferred.resolve(longUrl);
            return deferred.promise;
        }

        return this.urlExpander
            .expand(shortUrl)
            .then((longUrl) => {
                this.longUrlRepository.store(shortUrl, longUrl);
                return longUrl;
            });
    }

    expandAll(shortUrls: string[]): ng.IPromise<{[key: string]: string}> {
        var expandedUrls: {[key: string]: string} = {};
        var unexpandedUrls: string[] = [];

        shortUrls.forEach((shortUrl) => {
            var longUrl = this.longUrlRepository.find(shortUrl);
            if (longUrl != null) {
                expandedUrls[shortUrl] = longUrl;
            } else {
                unexpandedUrls.push(shortUrl);
            }
        });

        if (unexpandedUrls.length === 0) {
            var deferred = this.$q.defer();
            deferred.resolve(expandedUrls);
            return deferred.promise;
        }

        return this.urlExpander
            .expandAll(unexpandedUrls)
            .then((longUrls) => {
                for (var shortUrl in longUrls) {
                    this.longUrlRepository.store(shortUrl, longUrls[shortUrl])
                }
                return angular.extend(longUrls, expandedUrls);
            });
    }
}

export = UrlExpandService;
