function htmlParser(html: string): HTMLDocument {
    try {
        var parser = new DOMParser();
        var parsed = parser.parseFromString(html, 'text/html');
    } catch (e) {
        // Firefox/Opera/IE throw errors on unsupported types
    }

    if (parsed == null) {
        parsed = document.implementation.createHTMLDocument('');
        parsed.body.innerHTML = html;
    }

    return parsed;
}

export = htmlParser;
