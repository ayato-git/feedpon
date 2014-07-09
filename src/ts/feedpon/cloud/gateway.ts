/// <reference path="interfaces.d.ts" />

class Gateway implements IFeeds, ICategories, ISubscriptions {
    constructor(private client: IClient) {
    }

    allCategories(): JQueryPromise<Category[]> {
        return this.client.request('GET', '/v3/categories');
    }

    deleteCategory(categoryId: string): JQueryPromise<string> {
        return this.client.request('DELETE', '/v3/categories/' + categoryId);
    }

    findFeed(feedId: string): JQueryPromise<Feed> {
        return this.client.request('GET', '/v3/feeds/' + feedId);
    }

    allSubscriptions(): JQueryPromise<Subscription[]> {
        return this.client.request('GET', '/v3/subscriptions');
    }
}

export = Gateway;
