/// <reference path="interfaces.d.ts" />

import $ = require('jquery');

class ClientOnWorker implements IClient {
    private worker: Worker;

    private tasks: {[key: string]: JQueryDeferred<any>} = {};

    private unique: number = 0;

    constructor(private accessToken:string, private endPoint: string = 'http://cloud.feedly.com') {
        this.worker = new Worker('js/requester.js');
        this.worker.onmessage = this.onMessage.bind(this);
    }

    request<T>(method: string, path: string, data?: any): JQueryPromise<T> {
        var defer = $.Deferred();
        var id = this.unique++;

        this.tasks[id] = defer;

        this.worker.postMessage({
            id: id,
            data: data,
            headers: {'Authorization': 'OAuth ' + this.accessToken},
            type: method,
            url: this.endPoint + path,
        });

        return defer.promise();
    }

    private onMessage(e: any): void {
        var data = e.data;
        if (data == null) return;

        var task = this.tasks[data.id];
        if (task == null) return;

        if ((data.status >= 200 && data.status < 300) || data.status == 304) {
            task.resolve(data.response);
        } else {
            task.reject(data.error || data.statusText);
        }

        delete this.tasks[data.id];
    }
}

export = ClientOnWorker;
