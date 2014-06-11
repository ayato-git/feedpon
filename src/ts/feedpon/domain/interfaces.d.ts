/// <reference path="../../jquery/jquery.d.ts" />

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

interface IFeedRepository {
    find(feedId: string): JQueryPromise<Feed>;
}

interface Category {
    id: string;
    label: string;
}

interface ICategoryRepository {
    findAll(): JQueryPromise<Category[]>;
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

interface ISubscriptionRepository {
    findAll(): JQueryPromise<Subscription[]>;
}
