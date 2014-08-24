interface IFeedlyClient {
    credential: ExchangeTokenResponse;
    endPoint: string;
    request<T>(method: string, path: string, data?: any): ng.IPromise<T>;
}

/**
 * Feedly API gateway
 */
interface IFeedlyGateway extends IAuthenticationApi,
                           ICategoriesApi,
                           IFeedsApi,
                           IMarkersApi,
                           ISubscriptionsApi {
    client: IFeedlyClient;
}

/**
 * Authentication API
 */
interface IAuthenticationApi {
    authenticate(input: AuthenticateInput, windowOpener: IWindowOpener): ng.IPromise<AuthenticateResponse>;

    exchangeToken(input: ExchangeTokenInput): ng.IPromise<ExchangeTokenResponse>;

    refreshToken(input: RefreshTokenInput): ng.IPromise<RefreshTokenResponse>;

    revokeToken(input: RevokeTokenInput): ng.IPromise<RevokeTokenResponse>;
}

interface IWindowOpener {
    (url: string, redirectUrl: string): ng.IPromise<string>;
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
 * Categories API
 */
interface ICategoriesApi {
    allCategories(): ng.IPromise<Category[]>;

    deleteCategory(categoryId: string): ng.IPromise<string>;
}

interface Category {
    id: string;
    label: string;
}

/**
 * Feeds API
 */
interface IFeedsApi {
    getFeed(feedId: string): ng.IPromise<Feed>;
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
interface IMarkersApi {
    unreadCounts(input?: UnreadCountsInput): ng.IPromise<UnreadCountsResponce>;

    markAsReadForEntries(entryId: string): ng.IPromise<void>;
    markAsReadForEntries(entryIds: string[]): ng.IPromise<void>;

    markAsReadForFeeds(feedId: string): ng.IPromise<void>;
    markAsReadForFeeds(feedIds: string[]): ng.IPromise<void>;

    markAsReadForCetegories(categoryId: string): ng.IPromise<void>;
    markAsReadForCetegories(categoryIds: string[]): ng.IPromise<void>;

    keepUnreadForEntries(entryId: string): ng.IPromise<void>;
    keepUnreadForEntries(entryIds: string[]): ng.IPromise<void>;

    keepUnreadForFeeds(feedId: string): ng.IPromise<void>;
    keepUnreadForFeeds(feedIds: string[]): ng.IPromise<void>;

    keepUnreadForCetegories(categoryId: string): ng.IPromise<void>;
    keepUnreadForCetegories(categoryIds: string[]): ng.IPromise<void>;
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
interface IStreamsApi {
    getEntryIds(streamId: string, input?: GetStreamInput): ng.IPromise<GetEntryIdsResponse>;
    getContents(streamId: string, input?: GetStreamInput): ng.IPromise<Content>;
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
interface ISubscriptionsApi {
    allSubscriptions(): ng.IPromise<Subscription[]>;
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
