/// <reference path="interfaces.d.ts" />

import $ = require('jquery');

class Client implements IClient {
    private credential: ExchangeTokenResponse;

    constructor(public endPoint: string = 'http://cloud.feedly.com') {
    }

    setCredential(credential: ExchangeTokenResponse): void {
        this.credential = credential;
    }

    request<T>(method: string, path: string, data?: any): JQueryPromise<T> {
        var headers: {[key: string]: any} = {};
        var credential = this.credential;

        if (credential) {
            headers['Authorization'] = 'OAuth ' + credential.access_token;
        }

        return $.ajax({
            data: data,
            dataType: 'json',
            headers: headers,
            type: method,
            url: this.endPoint + path,
        });
    }
}

export = Client;
