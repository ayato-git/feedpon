interface IFeedlyClient {
    request<T>(method: string, path: string, data?: any): JQueryPromise<T>;
}
