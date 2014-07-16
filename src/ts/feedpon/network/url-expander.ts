/// <reference path="interfaces.d.ts" />

import $ = require('jquery');

class UrlExpander implements IUrlExpander {
    static API_URL: string = 'http://emonkak.appspot.com/expand';

    expand(shortUrl: string): JQueryPromise<string> {
        return $.getJSON(UrlExpander.API_URL, {url: shortUrl})
            .then((data) => data[shortUrl]);
    }

    expandAll(shortUrls: string[]): JQueryPromise<{[key: string]: string}> {
        return $.ajax({
            data: JSON.stringify(shortUrls),
            dataType: 'json',
            type: 'POST',
            url: UrlExpander.API_URL
        });
    }
}

export = UrlExpander;
