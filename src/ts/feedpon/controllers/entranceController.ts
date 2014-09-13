import AuthenticationService = require('../services/authenticationService');

class EntranceController {
    /**
     * @ngInject
     */
    constructor(private $scope: ng.IScope,
                private $state: ng.ui.IStateService,
                private authenticationService: AuthenticationService,
                private windowOpener: IWindowOpener) {
        authenticationService.isAuthorized().then((authorized) => {
            if (authorized) $state.go('welcome');
        });
    }

    authenticate(): void {
        this.authenticationService.authenticate(this.windowOpener, Date.now())
            .finally(() => this.$state.go('welcome'));
    }
}

export = EntranceController;
