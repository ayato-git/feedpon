/// <reference path="interfaces.d.ts" />
/// <reference path="../infrastructure/interfaces.d.ts" />

class SubscriptionRepository implements ISubscriptionRepository {
    constructor(private client: IFeedlyClient) {
    }

    findAll(): JQueryPromise<Subscription[]> {
        return this.client.request('GET', '/v3/subscriptions');
    }
}

export = SubscriptionRepository;
