import AuthenticationService = require('../services/authenticationService');

class ContentController {
    constructor(private $scope: ng.IScope,
                private $ionicLoading: any,
                private $ionicSideMenuDelegate: any,
                private authenticationService: AuthenticationService) {
    }

    authenticate(): void {
        this.$ionicLoading.show({
            template: 'Authenticating...'
        });
        this.authenticationService.authenticate(Date.now())
            .finally(() => this.$ionicLoading.hide());
    }

    toggleLeft(): void {
        this.$ionicSideMenuDelegate.toggleLeft();
    }
}

export = ContentController;
