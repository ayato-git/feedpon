/// <reference path="interfaces.d.ts" />

import Enumerable = require('linqjs');

class SubscritionController {
    constructor(private $scope: ISubscriptionScope,
                private $q: ng.IQService,
                private feedlyGateway: IFeedlyGateway) {
    }

    refresh(): void {
        this.$q.all([this.feedlyGateway.allSubscriptions(), this.feedlyGateway.unreadCounts()])
            .then((responses) => {
                this.handleResponses(responses[0], responses[1].unreadcounts)
            })
            .finally(() => this.$scope.$broadcast('scroll.refreshComplete'));
    }

    private handleResponses(subscriptions: Subscription[], unreadCounts: UnreadCount[]): void {
        this.$scope.categories = Enumerable.from(subscriptions)
            .selectMany(subscription => {
                return Enumerable
                    .from(subscription.categories)
                    .defaultIfEmpty({label: 'Uncategorized', id: null});
            })
            .distinct<string>((category) => category.id)
            .toArray();

        this.$scope.items = Enumerable.from(subscriptions)
            .join(
                unreadCounts,
                (subscription) => subscription.id,
                (unreadCount) => unreadCount.id,
                (subscription, unreadCount) => {
                    return {
                        subscription: subscription,
                        unreadCount: unreadCount
                    };
                })
            .selectMany(item => {
                return Enumerable
                    .from(item.subscription.categories)
                    .defaultIfEmpty({label: 'Uncategorized', id: null})
                    .select((category) => {
                        return {
                            category: category,
                            subscription: item.subscription,
                            unreadCount: item.unreadCount
                        };
                    });
            })
            .toArray();
    }
}

export = SubscritionController;
