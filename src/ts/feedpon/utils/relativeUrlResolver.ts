function relativeUrlResolver(url: string, documentUrl: ParsedUrl): string {
    if (isAbsoluteUrl(url)) return url;
    return toAbsoluteUrl(url, documentUrl);
}

function isAbsoluteUrl(url: string): boolean {
    return /^(?:[a-z]+:)?\/\//.test(url);
}

function toAbsoluteUrl(url: string, documentUrl: ParsedUrl): string {
    return documentUrl.protocol + '//' + documentUrl.host +
        url.replace(/^\/*/, '/');
}

export = relativeUrlResolver;
