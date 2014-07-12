/// <reference path="interfaces.d.ts" />

class Gateway implements ICategories, IFeeds, IMarkers, ISubscriptions {
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

    unreadCounts(input: UnreadCountsInput = {}): JQueryPromise<UnreadCountsResponce> {
        return this.client.request('GET', '/v3/markers/counts', input);
    }

    markAsReadForEntries(entryIds: any): JQueryPromise<void> {
        if (Array.isArray(entryIds)) {
            var input = JSON.stringify({
                action: 'markAsRead',
                type: 'entries',
                entryIds: entryIds
            });
            return this.client.request<void>('GET', '/v3/markers', input);
        } else {
            return this.markAsReadForEntries([entryIds])
        }
    }

    markAsReadForFeeds(feedIds: any): JQueryPromise<void> {
        if (Array.isArray(feedIds)) {
            var input = JSON.stringify({
                action: 'markAsRead',
                type: 'feeds',
                feedIds: feedIds
            });
            return this.client.request<void>('GET', '/v3/markers', input);
        } else {
            return this.markAsReadForFeeds([feedIds])
        }
    }

    markAsReadForCetegories(categoryIds: any): JQueryPromise<void> {
        if (Array.isArray(categoryIds)) {
            var input = JSON.stringify({
                action: 'markAsRead',
                type: 'categories',
                categoryIds: categoryIds
            });
            return this.client.request<void>('GET', '/v3/markers', input);
        } else {
            return this.markAsReadForCetegories([categoryIds])
        }
    }

    keepUnreadForEntries(entryIds: any): JQueryPromise<void> {
        if (Array.isArray(entryIds)) {
            var input = JSON.stringify({
                action: 'keepUnread',
                type: 'entries',
                entryIds: entryIds
            });
            return this.client.request<void>('GET', '/v3/markers', input);
        } else {
            return this.keepUnreadForEntries([entryIds])
        }
    }

    keepUnreadForFeeds(feedIds: any): JQueryPromise<void> {
        if (Array.isArray(feedIds)) {
            var input = JSON.stringify({
                action: 'keepUnread',
                type: 'feeds',
                feedIds: feedIds
            });
            return this.client.request<void>('GET', '/v3/markers', input);
        } else {
            return this.keepUnreadForFeeds([feedIds])
        }
    }

    keepUnreadForCetegories(categoryIds: any): JQueryPromise<void> {
        if (Array.isArray(categoryIds)) {
            var input = JSON.stringify({
                action: 'keepUnread',
                type: 'categories',
                categoryIds: categoryIds
            });
            return this.client.request<void>('GET', '/v3/markers', input);
        } else {
            return this.keepUnreadForCetegories([categoryIds])
        }
    }

    allSubscriptions(): JQueryPromise<Subscription[]> {
        return this.client.request('GET', '/v3/subscriptions');
    }
}

export = Gateway;
