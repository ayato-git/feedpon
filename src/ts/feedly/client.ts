/// <reference path="interfaces.d.ts" />

import $ = require('jquery');

class Client implements IFeeds, ICategories, ISubscriptions {
    constructor(private accessToken:string, private endPoint: string = 'http://cloud.feedly.com') {
    }

    allCategories(): JQueryPromise<Category[]> {
        return this.request('GET', '/v3/categories');
    }

    deleteCategory(categoryId: string): JQueryPromise<string> {
        return this.request('DELETE', '/v3/categories/' + categoryId);
    }

    findFeed(feedId: string): JQueryPromise<Feed> {
        return this.request('GET', '/v3/feeds/' + feedId);
    }

    allSubscriptions(): JQueryPromise<Subscription[]> {
        return this.request('GET', '/v3/subscriptions');
    }

    private request<T>(method: string, path: string, data?: any): JQueryPromise<T> {
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
