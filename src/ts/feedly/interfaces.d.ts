/// <reference path="../../DefinitelyTyped//jquery/jquery.d.ts" />

// Authentication API
interface IAuthentication {
    authenticate(params: AuthenticationAuthenticateParams, windowOpener: AuthenticationWindowOpener): JQueryPromise<AuthenticationAuthenticateResponse>;

    exchange(params: AuthenticationExchangeParams): JQueryPromise<AuthenticationExchangeResponse>;

    refresh(params: AuthenticationRefreshParams): JQueryPromise<AuthenticationRefreshResponse>;

    revoke(params: AuthenticationRevokeParams): JQueryPromise<AuthenticationRevokeResponse>;
}

interface AuthenticationWindowOpener {
    (url: string): JQueryPromise<string>;
}

interface AuthenticationAuthenticateParams {
    response_type: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
    state?: string;
}

interface AuthenticationAuthenticateResponse {
    code: string;
    state?: string;
}

interface AuthenticationExchangeParams {
    code: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    state?: string;
    grant_type: string;
}

interface AuthenticationExchangeResponse {
    id: string;
    access_token: string;
    refresh_token: string;
    expires_in: string;
    token_type: string;
    plan: string;
    state?: string;
}

interface AuthenticationRefreshParams {
    refresh_token: string;
    client_id: string;
    client_secret: string;
    grant_type: string;
}

interface AuthenticationRefreshResponse {
    id: string;
    plan: string;
    access_token: string;
    expires_in: string;
    token_type: string;
}

interface AuthenticationRevokeParams {
    refresh_token: string;
    client_id: string;
    client_secret: string;
    grant_type: string;
}

interface AuthenticationRevokeResponse {
    id: string;
    expires_in: string;
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
