import Enumerable = require('linqjs');

interface IMenuScope extends ng.IScope {
    $exposeAside: any;

    categories: Category[];

    items: {category: Category; subscription: Subscription; unreadCount: UnreadCount}[];
}

class MenuController {
    /**
     * @ngInject
     */
    constructor(private $ionicLoading: ionic.ILoading,
                private $ionicSideMenuDelegate: ionic.ISideMenuDelegate,
                private $q: ng.IQService,
                private $scope: IMenuScope,
                private $state: ng.ui.IStateService,
                private feedlyGateway: IFeedlyGateway,
                private fullContentLoader: IFullContentLoader,
                private subscriptionStore: ISubscriptionStore) {
        this.initSiteinfo();
        this.initSubscriptions();
    }

    newSubscription(): void {
    }

    reloadSubscriptions(): void {
        this.$ionicLoading.show({
            template: 'Loading subscriptions...'
        });

        this.$q
            .all([
                this.feedlyGateway.allSubscriptions(),
                this.feedlyGateway.unreadCounts()
            ])
            .then((responses) => {
                var subscriptions: Subscription[] = responses[0];
                var unreadCounts: UnreadCount[] = responses[1].unreadcounts;

                this.loadCompleted(subscriptions, unreadCounts);

                return this.$q.all([
                    this.subscriptionStore.putSubscriptions(subscriptions),
                    this.subscriptionStore.putUnreadCounts(unreadCounts)
                ]);
            })
            .finally(() => {
                this.$ionicLoading.hide()
                this.$scope.$broadcast('scroll.refreshComplete')
            });
    }

    selectSubscription(subscription: Subscription): void {
        if (!(this.$scope.$exposeAside || {}).active) {
            this.$ionicSideMenuDelegate.toggleLeft(false);
        }

        this.$state.go('content', {streamId: subscription.id});
    }

    reloadSiteinfo(): void {
        this.$ionicLoading.show({
            template: 'Loading siteinfo...'
        });

        this.fullContentLoader.reloadSiteinfo()
            .finally(() => {
                this.$ionicLoading.hide();
            });
    }

    private initSiteinfo(): void {
        this.$ionicLoading.show({
            template: 'Loading siteinfo...'
        });

        this.fullContentLoader.initSiteinfo()
            .finally(() => {
                this.$ionicLoading.hide()
            });
    }

    private initSubscriptions(): ng.IPromise<void> {
        return this.$q
            .all([
                this.subscriptionStore.allSubscriptions(),
                this.subscriptionStore.unreadCounts()
            ])
            .then((responses) => {
                if (responses[0] != null && responses[1] != null) {
                    this.loadCompleted(responses[0], responses[1])
                }
            });
    }

    private loadCompleted(subscriptions: Subscription[], unreadCounts: UnreadCount[]): void {
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

export = MenuController;
