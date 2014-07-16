((self: Worker) => {
    self.onmessage = function(e) {
        var data = e.data;
        if (data == null) return;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;

            var result: any = {
                id: data.id,
                status: xhr.status,
                statusText: xhr.statusText
            };

            try {
                result.response = JSON.parse(xhr.responseText);
            } catch (e) {
                result.error = e;
            }

            self.postMessage(result);
        };

        xhr.open(data.method, data.url);

        var headers: {[key: string]: string} = data.headers;
        for (var key in headers) {
           xhr.setRequestHeader(key, headers[key]);
        }

        xhr.send(data.data || null);
    };
})(<any> self);
