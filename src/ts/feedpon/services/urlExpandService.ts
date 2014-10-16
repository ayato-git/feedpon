import angular = require('angular');

class UrlExpandService {
    /**
     * @ngInject
     */
    constructor(private $q: ng.IQService,
                private urlExpandStrategy: IUrlExpandStrategy,
                private expanedUrlRepository: IExpandedUrlRepository) {
    }

    expand(url: string): ng.IPromise<string> {
        var expandedUrl = this.expanedUrlRepository.get(url);
        if (expandedUrl != null) {
            return this.$q.when(expandedUrl);
        }

        return this.urlExpandStrategy.expand(url)
            .then((expandedUrl) => {
                return this.expanedUrlRepository.put(url, expandedUrl)
                    .then(() => expandedUrl);
            });
    }

    expandAll(urls: string[]): ng.IPromise<{[key: string]: string}> {
        var results: {[key: string]: string} = {};
        var processingUrls: string[] = [];

        var tasks = urls.map((url) => {
            return this.expanedUrlRepository.get(url).then((expandedUrl) => {
                if (expandedUrl != null) {
                    results[url] = expandedUrl;
                } else {
                    processingUrls.push(url);
                }
            });
        });

        return this.$q.all(tasks).then(() => {
            if (processingUrls.length === 0) {
                return this.$q.when(results);
            }

            return this.urlExpandStrategy
                .expandAll(processingUrls)
                .then((expandedUrls) => {
                    var tasks = Object.keys(expandedUrls).map((url) => {
                        return this.expanedUrlRepository.put(url, expandedUrls[url])
                    });

                    return this.$q.all(tasks).then(() => angular.extend(results, expandedUrls));
                });
        })
    }
}

export = UrlExpandService;
