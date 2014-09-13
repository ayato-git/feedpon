interface ISubscriptionScope extends ng.IScope {
    $exposeAside: any;

    categories: Category[];

    items: {category: Category; subscription: Subscription; unreadCount: UnreadCount}[];
}

interface IContentScope extends ng.IScope {
    contents: Contents;
}
