function htmlParserProvider(): IHtmlParser {
    return function htmlParser(html: string): HTMLDocument {
        var parser = new DOMParser();
        try {
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
}

export = htmlParserProvider;
