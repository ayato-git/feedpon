interface IContentScope extends ng.IScope {
    contents: Contents;
}

interface IMenuScope extends ng.IScope {
    $exposeAside: any;

    categories: Category[];

    items: {category: Category; subscription: Subscription; unreadCount: UnreadCount}[];
}
