class HttpClient implements IHttpClient {
    public endPoint: string;

    /**
     * @ngInject
     */
    constructor(private $http: ng.IHttpService,
                feedlyEndPoint: string) {
        this.endPoint = feedlyEndPoint;
    }

    request<T>(method: string, path: string, data?: any, headers?: any): ng.IPromise<ng.IHttpPromiseCallbackArg<T>> {
        var config: ng.IRequestConfig = {
            method: method,
            url: this.endPoint + path,
            headers: headers
        };

        if (method === 'GET') {
            config.params = data;
        } else {
            config.data = data;
        }

        return this.$http(config);
    }
}

export = HttpClient;
