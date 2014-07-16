/// <reference path="../interfaces.d.ts" />

interface IUrlExpander {
    expand(shortUrl: string): JQueryPromise<string>;

    expandAll(shortUrls: string[]): JQueryPromise<{[key: string]: string}>;
}
