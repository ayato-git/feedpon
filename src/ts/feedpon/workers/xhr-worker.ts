((self: Worker) => {
    self.onmessage = function(e) {
        var message = e.data,
            id = message.id,
            config = message.config,
            xhr = new XMLHttpRequest(),
            method = config.method,
            url = config.url,
            params = config.params,
            headers = config.headers,
            withCredentials = config.withCredentials,
            data = config.data || null,
            responseType = config.responseType;

        if (params) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + serializeData(params);
        }

        xhr.open(method, url, true);

        if (headers) {
            for (var key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }

        if (withCredentials) {
            xhr.withCredentials = true;
        }

        if (responseType) {
            try {
                xhr.responseType = responseType;
            } catch (e) {
                // WebKit added support for the json responseType value on 09/03/2013
                // https://bugs.webkit.org/show_bug.cgi?id=73648. Versions of Safari prior to 7 are
                // known to throw when setting the value "json" as the response type. Other older
                // browsers implementing the responseType
                //
                // The json response type can be ignored if not supported, because JSON payloads are
                // parsed on the client-side regardless.
                if (responseType !== 'json') {
                    throw e;
                }
            }
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;

            self.postMessage({
                id: id,
                data: ('response' in xhr) ? xhr.response : xhr.responseText,
                config: config,
                status: xhr.status,
                statusText: xhr.statusText
            });
        };

        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }

        xhr.send(data);
    };

    function serializeData(data: any): string { 
        var buffer: string[] = [];

        // Serialize each key in the object.
        for (var name in data) { 
            if (!data.hasOwnProperty(name)) { 
                continue; 
            }

            var value = data[name];

            buffer.push(
                encodeURIComponent(name) +
                '=' +
                encodeURIComponent(value == null ? '' : value)
            ); 
        }

        // Serialize the buffer and clean it up for transportation.
        return buffer.join('&').replace(/%20/g, '+'); 
    }
})(<any> self);
