class FeedlyGateway implements IFeedlyGateway {
    constructor(private $q: ng.IQService, public client: IFeedlyClient) {
    }

    authenticate(input: AuthenticateInput, windowOpener: IWindowOpener): ng.IPromise<AuthenticateResponse> {
        var escape = encodeURIComponent;
        var authUrl = this.client.endPoint + '/v3/auth/auth' +
            '?response_type=' + escape(input.response_type) +
            '&client_id=' + escape(input.client_id) +
            '&redirect_uri=' + escape(input.redirect_uri) +
            '&scope=' + escape(input.scope) +
            (input.state != null ? '&state=' + escape(input.state) : '');

        return windowOpener(authUrl, input.redirect_uri).then<AuthenticateResponse>((url) => {
            var deferred = this.$q.defer();
            var matchesForCode = url.match(/[?&]code=([^&]*)/);
            var matchesForState = url.match(/[?&]state=([^&]*)/);

            if (matchesForCode) {
                deferred.resolve({
                    code: matchesForCode[1],
                    state: matchesForState ? matchesForState[1] : null
                });
            } else {
                var matchesForError = url.match(/[&?]error=([^&]+)/);
                if (matchesForError) {
                    deferred.reject({
                        code: matchesForCode[1],
                        state: matchesForState ? matchesForState[1] : null
                    });
                }
            }

            return deferred.promise;
        })
    }

    exchangeToken(input: ExchangeTokenInput): ng.IPromise<ExchangeTokenResponse> {
        return this.client.request('POST', '/v3/auth/token', input);
    }

    refreshToken(input: RefreshTokenInput): ng.IPromise<RefreshTokenResponse> {
        return this.client.request('POST', '/v3/auth/token', input);
    }

    revokeToken(input: RevokeTokenInput): ng.IPromise<RevokeTokenResponse> {
        return this.client.request('POST', '/v3/auth/token', input);
    }

    allCategories(): ng.IPromise<Category[]> {
        return this.client.request('GET', '/v3/categories');
    }

    deleteCategory(categoryId: string): ng.IPromise<string> {
        return this.client.request('DELETE', '/v3/categories/' + categoryId);
    }

    getFeed(feedId: string): ng.IPromise<Feed> {
        return this.client.request('GET', '/v3/feeds/' + feedId);
    }

    unreadCounts(input: UnreadCountsInput = {}): ng.IPromise<UnreadCountsResponce> {
        return this.client.request('GET', '/v3/markers/counts', input);
    }

    markAsReadForEntries(entryIds: any): ng.IPromise<void> {
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

    markAsReadForFeeds(feedIds: any): ng.IPromise<void> {
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

    markAsReadForCetegories(categoryIds: any): ng.IPromise<void> {
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

    keepUnreadForEntries(entryIds: any): ng.IPromise<void> {
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

    keepUnreadForFeeds(feedIds: any): ng.IPromise<void> {
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

    keepUnreadForCetegories(categoryIds: any): ng.IPromise<void> {
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

    allSubscriptions(): ng.IPromise<Subscription[]> {
        return this.client.request('GET', '/v3/subscriptions');
    }
}

export = FeedlyGateway;
