class FeedlyClient implements IFeedlyClient {
    public credential: ExchangeTokenResponse;

    constructor(private $http: ng.IHttpService, public endPoint: string) {
    }

    request<T>(method: string, path: string, data?: any): ng.IPromise<T> {
        var headers: {[key: string]: any} = {};
        var credential = this.credential;

        if (credential) {
            headers['Authorization'] = 'OAuth ' + credential.access_token;
        }

        return this.$http({
            data: data,
            headers: headers,
            method: method,
            url: this.endPoint + path,
        }).then((response) => response.data);
    }
}

export = FeedlyClient;
