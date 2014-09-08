import AuthenticationService = require('../services/authenticationService');

class EntranceController {
    /**
     * @ngInject
     */
    constructor(private $scope: ng.IScope,
                private $state: ng.ui.IStateService,
                private authenticationService: AuthenticationService,
                private windowOpener: IWindowOpener) {
    }

    authenticate(): void {
        this.authenticationService.authenticate(this.windowOpener, Date.now())
            .finally(() => this.$state.go('content'));
    }
}

export = EntranceController;
