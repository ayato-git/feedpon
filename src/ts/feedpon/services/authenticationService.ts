import angular = require('angular');

function isTokenExpired(credential: Credential, now: number): boolean {
    return credential.created + (credential.expires_in * 1000) < now;
}

class AuthenticationService {
    /**
     * @ngInject
     */
    constructor(private $q: ng.IQService,
                private feedlyGatewayService: IFeedlyGatewayService,
                private credentialRepository: ICredentialRepository) {
    }

    authenticate(windowOpener: IWindowOpener, now: number): ng.IPromise<Credential> {
        return this.credentialRepository.get()
            .then((credential) => {
                if (credential == null) {
                    // Not authenticated yet.
                    return this.doAuthenticate(windowOpener, now);
                } else if (isTokenExpired(credential, now)) {
                    // Require token refreshing.
                    return this.doRefreshToken(credential, now);
                } else {
                    var deferred = this.$q.defer();
                    deferred.resolve(credential);
                    return deferred.promise;
                }
            });
    }

    isAuthorized(now: number = Date.now()): ng.IPromise<boolean> {
        return this.credentialRepository.get()
            .then((credential) => {
                if (credential == null) {
                    return false;
                }

                if (isTokenExpired(credential, now)) {
                    return false;
                }

                return true;
            });
    }

    private doAuthenticate(windowOpener: IWindowOpener, now: number): ng.IPromise<Credential> {
        return this.feedlyGatewayService
            .authenticate({
                client_id: 'feedly',
                redirect_uri: 'http://localhost',
                scope: 'https://cloud.feedly.com/subscriptions',
                response_type: 'code'
            }, windowOpener)
            .then((response) => {
                return this.feedlyGatewayService.exchangeToken({
                    code: response.code,
                    client_id: 'feedly',
                    client_secret: '0XP4XQ07VVMDWBKUHTJM4WUQ',
                    redirect_uri: 'http://www.feedly.com/feedly.html',
                    grant_type: 'authorization_code'
                });
            })
            .then((response) => {
                var credential: Credential = <Credential> angular.copy(response);
                credential.created = now;

                return this.credentialRepository.put(credential).then(() => credential);
            });
    }

    private doRefreshToken(credential: Credential, now: number): ng.IPromise<Credential> {
        return this.feedlyGatewayService.refreshToken({
                refresh_token: credential.refresh_token,
                client_id: 'feedly',
                client_secret: '0XP4XQ07VVMDWBKUHTJM4WUQ',
                grant_type: 'refresh_token',
            })
            .then((response) => {
                var newCredential: Credential = angular.extend({}, credential, response);
                newCredential.created = now;

                return this.credentialRepository.put(newCredential)
                    .then<Credential>(() => newCredential);
            });
    }
}

export = AuthenticationService;
