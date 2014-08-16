/// <reference path="../interfaces.d.ts" />

interface IClient {
    endPoint: string;

    request<T>(method: string, path: string, data?: any): JQueryPromise<T>;
}

/**
 * Authentication API
 */
interface IAuthentication {
    authenticate(input: AuthenticateInput, windowOpener: WindowOpener): JQueryPromise<AuthenticateResponse>;

    exchange(input: ExchangeTokenInput): JQueryPromise<ExchangeTokenResponse>;

    refresh(input: RefreshTokenInput): JQueryPromise<RefreshTokenResponse>;

    revoke(input: RevokeTokenInput): JQueryPromise<RevokeTokenResponse>;
}

interface WindowOpener {
    (url: string): JQueryPromise<string>;
}

interface AuthenticateInput {
    response_type: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
    state?: string;
}

interface AuthenticateResponse {
    code: string;
    state?: string;
}

interface ExchangeTokenInput {
    code: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    state?: string;
    grant_type: string;
}

interface ExchangeTokenResponse {
    id: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    plan: string;
    state?: string;
}

interface RefreshTokenInput {
    refresh_token: string;
    client_id: string;
    client_secret: string;
    grant_type: string;
}

interface RefreshTokenResponse {
    id: string;
    plan: string;
    access_token: string;
    expires_in: string;
    token_type: string;
}

interface RevokeTokenInput {
    refresh_token: string;
    client_id: string;
    client_secret: string;
    grant_type: string;
}

interface RevokeTokenResponse {
    id: string;
    expires_in: string;
}

/**
 * Feedly API gateway
 */
interface IGateway extends ICategories, IFeeds, IMarkers, ISubscriptions {
}

/**
 * Categories API
 */
interface ICategories {
    allCategories(): JQueryPromise<Category[]>;

    deleteCategory(categoryId: string): JQueryPromise<string>;
}

interface Category {
    id: string;
    label: string;
}

/**
 * Feeds API
 */
interface IFeeds {
    getFeed(feedId: string): JQueryPromise<Feed>;
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

/**
 * Markers API
 */
interface IMarkers {
    unreadCounts(input?: UnreadCountsInput): JQueryPromise<UnreadCountsResponce>;

    markAsReadForEntries(entryId: string): JQueryPromise<void>;
    markAsReadForEntries(entryIds: string[]): JQueryPromise<void>;

    markAsReadForFeeds(feedId: string): JQueryPromise<void>;
    markAsReadForFeeds(feedIds: string[]): JQueryPromise<void>;

    markAsReadForCetegories(categoryId: string): JQueryPromise<void>;
    markAsReadForCetegories(categoryIds: string[]): JQueryPromise<void>;

    keepUnreadForEntries(entryId: string): JQueryPromise<void>;
    keepUnreadForEntries(entryIds: string[]): JQueryPromise<void>;

    keepUnreadForFeeds(feedId: string): JQueryPromise<void>;
    keepUnreadForFeeds(feedIds: string[]): JQueryPromise<void>;

    keepUnreadForCetegories(categoryId: string): JQueryPromise<void>;
    keepUnreadForCetegories(categoryIds: string[]): JQueryPromise<void>;
}

interface UnreadCountsInput {
    autorefresh?: boolean;
    newerThan?: number;
    streamId?: string;
}

interface UnreadCountsResponce {
    unreadcounts: UnreadCount[];
}

interface UnreadCount {
    count: number;
    updated: number;
    id: string;
}

/**
 * Streams API
 */
interface IStreams {
    getEntryIds(streamId: string, input?: GetStreamInput): JQueryPromise<GetEntryIdsResponse>;
    getContents(streamId: string, input?: GetStreamInput): JQueryPromise<Content>;
}

interface GetStreamInput {
    count?: number;
    ranked?: string;
    unreadOnly?: boolean;
    newerThan?: number;
    continuation?: string;
}

interface GetEntryIdsResponse {
    ids: string[];
    continuation: string;
}

interface Content {
    continuation: string;
    updated: number;
    alternate: LinkObject[];
    title: string;
    id: string;
    direction: string;
    items: ContentItem[];
}

interface ContentItem {
    published: number;
    tags: ContentItemTag[];
    alternate: LinkObject[];
    updated: number;
    title: string;
    engagement: number;
    categories: Category[];
    id: string;
    author: string;
    origin: ContentItemOrigin;
    content: ContentItemContent;
    unread: boolean;
    crawled: number;
}

interface LinkObject {
    type: string;
    href: string;
}

interface ContentItemTag {
    id: string;
    label: string;
}

interface ContentItemOrigin {
    htmlUrl: string;
    title: string;
    streamId: string;
}

interface ContentItemContent {
    direction: string;
    content: string;
}

/**
 * Subscriptions API
 */
interface ISubscriptions {
    allSubscriptions(): JQueryPromise<Subscription[]>;
}

interface Subscription {
    id: string;
    title: string;
    website: string;
    categories: Category[];
    updated: number;
    velocity: number;
    topics: string[];
    visualUrl: string;
}
