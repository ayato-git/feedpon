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
