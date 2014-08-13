/// <reference path="../interfaces.d.ts" />
/// <reference path="../network/interfaces.d.ts" />
/// <reference path="../persistence/interfaces.d.ts" />

import $ = require('jquery');

class UrlExpandService {
    constructor(private urlExpander: IUrlExpander,
                private longUrlRepository: ILongUrlRepository) {
    }

    expand(shortUrl: string): JQueryPromise<string> {
        var longUrl = this.longUrlRepository.find(shortUrl);
        if (longUrl != null) {
            return $.Deferred().resolve(longUrl).promise();
        }

        return this.urlExpander
            .expand(shortUrl)
            .done((longUrl) => this.longUrlRepository.store(shortUrl, longUrl));
    }

    expandAll(shortUrls: string[]): JQueryPromise<{[key: string]: string}> {
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
            return $.Deferred().resolve(expandedUrls).promise();
        }

        return this.urlExpander
            .expandAll(unexpandedUrls)
            .done((longUrls) => {
                for (var shortUrl in longUrls) {
                    this.longUrlRepository.store(shortUrl, longUrls[shortUrl])
                }
            })
            .then((longUrls) => $.extend(longUrls, expandedUrls));
    }
}

export = UrlExpandService;
