/// <reference path="interfaces.d.ts" />

import $ = require('jquery');

class Client {
    constructor(private accessToken:string, private endPoint: string = 'http://cloud.feedly.com') {
    }

    request<T>(method: string, path: string, data?: any): JQueryPromise<T> {
        return $.ajax({
            data: data,
            dataType: 'json',
            headers: {'Authorization': 'OAuth ' + this.accessToken},
            type: method,
            url: this.endPoint + path,
        });
    }
}

export = Client;
