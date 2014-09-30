import Enumerable = require('linqjs');

class SubscritionController {
    /**
     * @ngInject
     */
    constructor(private $scope: ISubscriptionScope,
                private $q: ng.IQService,
                private $ionicSideMenuDelegate: ionic.ISideMenuDelegate,
                private $state: ng.ui.IStateService,
                private subscriptionRepository: ISubscriptionRepository,
                private feedlyGateway: IFeedlyGateway) {
        this.setUpData();
    }

    reload(): void {
        this.$q
            .all([
                this.feedlyGateway.allSubscriptions(),
                this.feedlyGateway.unreadCounts()
            ])
            .then((responses) => {
                var subscriptions: Subscription[] = responses[0];
                var unreadCounts: UnreadCount[] = responses[1].unreadcounts;

                this.handleData(subscriptions, unreadCounts);

                return this.$q.all([
                    this.subscriptionRepository.putSubscriptions(subscriptions),
                    this.subscriptionRepository.putUnreadCounts(unreadCounts)
                ]);
            })
            .finally(() => this.$scope.$broadcast('scroll.refreshComplete'));
    }

    selected(subscription: Subscription): void {
        if (!(this.$scope.$exposeAside || {}).active) {
            this.$ionicSideMenuDelegate.toggleLeft(false);
        }

        this.$state.go('content', {streamId: subscription.id});
    }

    private setUpData(): void {
        this.$q
            .all([
                this.subscriptionRepository.allSubscriptions(),
                this.subscriptionRepository.unreadCounts()
            ])
            .then((responses) => {
                if (responses[0] != null && responses[1] != null) {
                    this.handleData(responses[0], responses[1])
                }
            })
            .catch((responses) => this.reload());
    }

    private handleData(subscriptions: Subscription[], unreadCounts: UnreadCount[]): void {
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
