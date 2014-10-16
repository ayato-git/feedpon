function urlParser(url: string): ParsedUrl {
    var a = document.createElement('a');
    a.href = url;

    return {
        protocol: a.protocol,
        hostname: a.hostname,
        port: a.port,
        pathname: a.pathname,
        search: a.search,
        hash: a.hash,
        host: a.host
    };
}

export = urlParser;
