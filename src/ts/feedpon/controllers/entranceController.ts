import AuthenticationService = require('../services/authenticationService');

class EntranceController {
    /**
     * @ngInject
     */
    constructor(private $scope: ng.IScope,
                private $state: ng.ui.IStateService,
                private authenticationService: IAuthenticationService) {
        authenticationService.isAuthorized().then((authorized) => {
            if (authorized) this.$state.go('home');
        });
    }

    authenticate(): void {
        this.authenticationService.authenticate()
            .finally(() => this.$state.go('home'));
    }
}

export = EntranceController;
