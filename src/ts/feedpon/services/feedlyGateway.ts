class FeedlyGateway implements IFeedlyGateway {
    /**
     * @ngInject
     */
    constructor(private $q: ng.IQService,
                private authenticationService: IAuthenticationService,
                private feedlyEndPoint: string,
                private httpClient: IHttpClient) {
    }

    allCategories(): ng.IPromise<Category[]> {
        return this.doGet('/v3/categories');
    }

    deleteCategory(categoryId: string): ng.IPromise<string> {
        return this.doDelete('/v3/categories/' + categoryId);
    }

    getFeed(feedId: string): ng.IPromise<Feed> {
        return this.doGet('/v3/feeds/' + feedId);
    }

    unreadCounts(input: UnreadCountsInput = {}): ng.IPromise<UnreadCountsResponce> {
        return this.doGet('/v3/markers/counts', input);
    }

    markAsReadForEntries(entryIds: any): ng.IPromise<void> {
        if (Array.isArray(entryIds)) {
            return this.doPost<void>('/v3/markers', {
                action: 'markAsRead',
                type: 'entries',
                entryIds: entryIds
            });
        } else {
            return this.markAsReadForEntries([entryIds])
        }
    }

    markAsReadForFeeds(feedIds: any): ng.IPromise<void> {
        if (Array.isArray(feedIds)) {
            return this.doPost<void>('/v3/markers', {
                action: 'markAsRead',
                type: 'feeds',
                feedIds: feedIds
            });
        } else {
            return this.markAsReadForFeeds([feedIds])
        }
    }

    markAsReadForCetegories(categoryIds: any): ng.IPromise<void> {
        if (Array.isArray(categoryIds)) {
            return this.doPost<void>('/v3/markers', {
                action: 'markAsRead',
                type: 'categories',
                categoryIds: categoryIds
            });
        } else {
            return this.markAsReadForCetegories([categoryIds])
        }
    }

    keepUnreadForEntries(entryIds: any): ng.IPromise<void> {
        if (Array.isArray(entryIds)) {
            return this.doPost<void>('/v3/markers', {
                action: 'keepUnread',
                type: 'entries',
                entryIds: entryIds
            });
        } else {
            return this.keepUnreadForEntries([entryIds])
        }
    }

    keepUnreadForFeeds(feedIds: any): ng.IPromise<void> {
        if (Array.isArray(feedIds)) {
            return this.doPost<void>('/v3/markers', {
                action: 'keepUnread',
                type: 'feeds',
                feedIds: feedIds
            });
        } else {
            return this.keepUnreadForFeeds([feedIds])
        }
    }

    keepUnreadForCetegories(categoryIds: any): ng.IPromise<void> {
        if (Array.isArray(categoryIds)) {
            return this.doPost<void>('/v3/markers', {
                action: 'keepUnread',
                type: 'categories',
                categoryIds: categoryIds
            });
        } else {
            return this.keepUnreadForCetegories([categoryIds])
        }
    }

    getEntryIds(input: GetStreamInput): ng.IPromise<GetEntryIdsResponse> {
        return this.doGet('/v3/streams/ids', input);
    }

    getContents(input: GetStreamInput): ng.IPromise<Contents> {
        return this.doGet('/v3/streams/contents', input);
    }

    allSubscriptions(): ng.IPromise<Subscription[]> {
        return this.doGet('/v3/subscriptions');
    }

    private doGet<T>(path: string, data?: any): ng.IPromise<T> {
        return this.doRequest({
            method: 'GET',
            params: data,
            responseType: 'json',
            url: this.feedlyEndPoint + path,
        })
    }

    private doPost<T>(path: string, data?: any): ng.IPromise<T> {
        return this.doRequest({
            data: data,
            method: 'POST',
            responseType: 'json',
            url: this.feedlyEndPoint + path,
        })
    }

    private doDelete<T>(path: string, data?: any): ng.IPromise<T> {
        return this.doRequest({
            data: data,
            method: 'DELETE',
            responseType: 'json',
            url: this.feedlyEndPoint + path,
        })
    }

    private doRequest<T>(config: ng.IRequestConfig): ng.IPromise<T> {
        return this.authenticationService.authenticate()
            .then((credential) => {
                return this.doRequestWithCredential(config, credential);
            })
            .catch((response) => {
                // Current credential is expired.
                if (response.status === 401) {
                    // Do expire and retry this request.
                    return this.authenticationService.expire()
                        .then(() => this.authenticationService.authenticate())
                        .then((credential) => {
                            return this.doRequestWithCredential(config, credential);
                        });
                } else {
                    return <any> this.$q.reject();
                }
            })
    }

    private doRequestWithCredential<T>(config: ng.IRequestConfig, credential: Credential): ng.IPromise<T> {
        config = angular.copy(config);
        config.headers = angular.extend({
            Authorization: 'OAuth ' + credential.access_token
        }, config.headers || {});

        return this.httpClient.request<T>(config)
            .then((response) => response.data);
    }
}

export = FeedlyGateway;
