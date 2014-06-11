/// <reference path="interfaces.d.ts" />
/// <reference path="../../jquery/jquery.d.ts" />

import $ = require('jquery');

class FeedlyClient implements IFeedlyClient {
    request<T>(method: string, path: string, data?: any): JQueryPromise<T> {
        return $.ajax({
            url: 'http://cloud.feedly.com' + path,
            type: method,
            data: data,
            dataType: 'json'
        });
    }
}

export = FeedlyClient;
