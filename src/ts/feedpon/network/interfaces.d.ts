/// <reference path="../interfaces.d.ts" />

interface IUrlExpander {
    expand(shortUrl: string): ng.IPromise<string>;

    expandAll(shortUrls: string[]): ng.IPromise<{[key: string]: string}>;
}
