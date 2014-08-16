/// <reference path="interfaces.d.ts" />

class Gateway implements IAuthentication, ICategories, IFeeds, IMarkers, ISubscriptions {
    constructor(private client: IClient) {
    }

    authenticate(input: AuthenticateInput, windowOpener: WindowOpener): JQueryPromise<AuthenticateResponse> {
        var authUrl = this.client.endPoint + '/v3/auth/auth?' + $.param(input);

        return windowOpener(authUrl).then<AuthenticateResponse>(function(url) {
            var defer = $.Deferred();
            var matchesForCode = url.match(/[?&]code=([^&]*)/);
            var matchesForState = url.match(/[?&]state=([^&]*)/);

            if (matchesForCode) {
                defer.resolveWith(this, [{
                    code: matchesForCode[1],
                    state: matchesForState ? matchesForState[1] : null
                }]);
            } else {
                var matchesForError = url.match(/[&?]error=([^&]+)/);
                if (matchesForError) {
                    defer.rejectWith(this, [{
                        code: matchesForCode[1],
                        state: matchesForState ? matchesForState[1] : null
                    }]);
                }
            }

            return defer.promise();
        })
    }

    exchange(input: ExchangeTokenInput): JQueryPromise<ExchangeTokenResponse> {
        return this.client.request('POST', '/v3/auth/token', input);
    }

    refresh(input: RefreshTokenInput): JQueryPromise<RefreshTokenResponse> {
        return this.client.request('POST', '/v3/auth/token', input);
    }

    revoke(input: RevokeTokenInput): JQueryPromise<RevokeTokenResponse> {
        return this.client.request('POST', '/v3/auth/token', input);
    }

    allCategories(): JQueryPromise<Category[]> {
        return this.client.request('GET', '/v3/categories');
    }

    deleteCategory(categoryId: string): JQueryPromise<string> {
        return this.client.request('DELETE', '/v3/categories/' + categoryId);
    }

    getFeed(feedId: string): JQueryPromise<Feed> {
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
