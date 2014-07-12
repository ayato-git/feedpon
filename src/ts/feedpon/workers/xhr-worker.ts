((self: Worker) => {
    self.onmessage = function(e) {
        var data = e.data;
        if (data == null) return;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState !== 4) return;

            var result: any = {
                id: data.id,
                status: this.status,
                statusText: this.statusText
            };

            try {
                result.response = JSON.parse(this.responseText);
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
