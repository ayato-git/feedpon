class FeedlyGateway implements IFeedlyGateway {
    /**
     * @ngInject
     */
    constructor(private $q: ng.IQService,
                private authenticationService: IAuthenticationService,
                private httpClient: IHttpClient) {
    }

    allCategories(): ng.IPromise<Category[]> {
        return this.request('GET', '/v3/categories');
    }

    deleteCategory(categoryId: string): ng.IPromise<string> {
        return this.request('DELETE', '/v3/categories/' + categoryId);
    }

    getFeed(feedId: string): ng.IPromise<Feed> {
        return this.request('GET', '/v3/feeds/' + feedId);
    }

    unreadCounts(input: UnreadCountsInput = {}): ng.IPromise<UnreadCountsResponce> {
        return this.request('GET', '/v3/markers/counts', input);
    }

    markAsReadForEntries(entryIds: any): ng.IPromise<void> {
        if (Array.isArray(entryIds)) {
            var input = JSON.stringify({
                action: 'markAsRead',
                type: 'entries',
                entryIds: entryIds
            });
            return this.request<void>('GET', '/v3/markers', input);
        } else {
            return this.markAsReadForEntries([entryIds])
        }
    }

    markAsReadForFeeds(feedIds: any): ng.IPromise<void> {
        if (Array.isArray(feedIds)) {
            var input = JSON.stringify({
                action: 'markAsRead',
                type: 'feeds',
                feedIds: feedIds
            });
            return this.request<void>('GET', '/v3/markers', input);
        } else {
            return this.markAsReadForFeeds([feedIds])
        }
    }

    markAsReadForCetegories(categoryIds: any): ng.IPromise<void> {
        if (Array.isArray(categoryIds)) {
            var input = JSON.stringify({
                action: 'markAsRead',
                type: 'categories',
                categoryIds: categoryIds
            });
            return this.request<void>('GET', '/v3/markers', input);
        } else {
            return this.markAsReadForCetegories([categoryIds])
        }
    }

    keepUnreadForEntries(entryIds: any): ng.IPromise<void> {
        if (Array.isArray(entryIds)) {
            var input = JSON.stringify({
                action: 'keepUnread',
                type: 'entries',
                entryIds: entryIds
            });
            return this.request<void>('GET', '/v3/markers', input);
        } else {
            return this.keepUnreadForEntries([entryIds])
        }
    }

    keepUnreadForFeeds(feedIds: any): ng.IPromise<void> {
        if (Array.isArray(feedIds)) {
            var input = JSON.stringify({
                action: 'keepUnread',
                type: 'feeds',
                feedIds: feedIds
            });
            return this.request<void>('GET', '/v3/markers', input);
        } else {
            return this.keepUnreadForFeeds([feedIds])
        }
    }

    keepUnreadForCetegories(categoryIds: any): ng.IPromise<void> {
        if (Array.isArray(categoryIds)) {
            var input = JSON.stringify({
                action: 'keepUnread',
                type: 'categories',
                categoryIds: categoryIds
            });
            return this.request<void>('GET', '/v3/markers', input);
        } else {
            return this.keepUnreadForCetegories([categoryIds])
        }
    }

    getEntryIds(input: GetStreamInput): ng.IPromise<GetEntryIdsResponse> {
        return this.request('GET', '/v3/streams/ids', input);
    }

    getContents(input: GetStreamInput): ng.IPromise<Contents> {
        return this.request('GET', '/v3/streams/contents', input);
    }

    allSubscriptions(): ng.IPromise<Subscription[]> {
        return this.request('GET', '/v3/subscriptions');
    }

    private request<T>(method: string, path: string, data?: any): ng.IPromise<T> {
        return this.authenticationService
            .authenticate(Date.now())
            .then((credential) => {
                return this.httpClient.request<T>(method, path, data, {
                    Authorization: 'OAuth ' + credential.access_token
                }).then((response) => response.data);
            })
            .catch((response) => {
                if (response.status === 401) {
                    // Current credential is expired. Re-authenticate required.
                    return this.authenticationService.expire()
                        .then(() => this.request(method, path, data));
                } else {
                    return <any> this.$q.reject();
                }
            })
    }
}

export = FeedlyGateway;
