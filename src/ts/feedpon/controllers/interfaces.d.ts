interface ISubscriptionScope extends ng.IScope {
    categories: Category[];

    items: {category: Category; subscription: Subscription; unreadCount: UnreadCount}[];
}
