import AuthenticationService = require('../services/authenticationService');

class EntranceController {
    /**
     * @ngInject
     */
    constructor(private $scope: ng.IScope,
                private $state: ng.ui.IStateService,
                private $ionicSideMenuDelegate: any,
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

    toggleLeft(): void {
        this.$ionicSideMenuDelegate.toggleLeft();
    }
}

export = EntranceController;
