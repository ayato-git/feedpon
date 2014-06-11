/// <reference path="interfaces.d.ts" />
/// <reference path="../infrastructure/interfaces.d.ts" />

class FeedRepository implements IFeedRepository {
    constructor(private client: IFeedlyClient) {
    }

    find(feedId: string): JQueryPromise<Feed> {
        return this.client.request('GET', '/v3/feeds/' + feedId);
    }
}

export = FeedRepository;
