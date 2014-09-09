class FeedlyClient implements IFeedlyClientService {
    public endPoint: string;

    public credential: ExchangeTokenResponse;

    /**
     * @ngInject
     */
    constructor(private $http: ng.IHttpService,
                private credentialRepository: ICredentialRepository,
                feedlyEndPoint: string) {
        this.endPoint = feedlyEndPoint;
    }

    request<T>(method: string, path: string, data?: any): ng.IPromise<T> {
        return this.credentialRepository.get().then(credential => {
            var config: ng.IRequestConfig = {
                method: method,
                url: this.endPoint + path,
            };

            if (credential != null) {
                config.headers = {
                    Authorization: 'OAuth ' + credential.access_token
                };
            }

            if (method === 'GET') {
                config.params = data;
            } else {
                config.data = data;
            }

            return this.$http(config).then((response) => response.data);
        });
    }
}

export = FeedlyClient;
