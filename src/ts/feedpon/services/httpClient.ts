class HttpClient implements IHttpClient {
    /**
     * @ngInject
     */
    constructor(private $http: ng.IHttpService) {
    }

    request<T>(config: ng.IRequestConfig): ng.IPromise<ng.IHttpPromiseCallbackArg<T>> {
        return this.$http(config);
    }
}

export = HttpClient;
