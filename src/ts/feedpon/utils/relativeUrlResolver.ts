function relativeUrlResolver(url: string, documentUrl: ParsedUrl): string {
    if (isAbsoluteUrl(url)) return url;
    return toAbsoluteUrl(url, documentUrl);
}

function isAbsoluteUrl(url: string): boolean {
    return /^(?:[a-z]+:)?\/\//.test(url);
}

function toAbsoluteUrl(relativeUrl: string, documentUrl: ParsedUrl): string {
    if (relativeUrl[0] === '/') {
        return documentUrl.protocol + '//' + documentUrl.host + relativeUrl;
    } else {
        // e.g. documentUrl: '/foo/bar/baz'
        //      relativeUrl: 'qux'
        //      => 'foo/bar/qux'
        return documentUrl.protocol + '//' + documentUrl.host +
            documentUrl.pathname.replace(/[^\/]*$/, '') +
            relativeUrl.replace(/^\.\//, '');
    }
}

export = relativeUrlResolver;
