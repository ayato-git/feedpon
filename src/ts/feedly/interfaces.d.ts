/// <reference path="../../DefinitelyTyped//jquery/jquery.d.ts" />

// Authentication API
interface AuthenticationWindowOpener {
    (url: string): JQueryPromise<string>;
}

interface AuthenticationParams {
    response_type: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
    state?: string;
}

// Feeds API
interface IFeeds {
    findFeed(feedId: string): JQueryPromise<Feed>;
}

interface Feed {
    id: string;
    subscribers: number;
    title: string;
    description: string;
    language: string;
    velocity: number;
    website: string;
    topics: string[];
    status: string;
}

// Categories API
interface ICategories {
    allCategories(): JQueryPromise<Category[]>;

    deleteCategory(categoryId: string): JQueryPromise<string>;
}

interface Category {
    id: string;
    label: string;
}

// Subscriptions API
interface ISubscriptions {
    allSubscriptions(): JQueryPromise<Subscription[]>;
}

interface Subscription {
    sortid: string;
    title: string;
    updated: number;
    id: string;
    categories: Category[];
    visualUrl: string;
    added: number;
    website: string;
}
