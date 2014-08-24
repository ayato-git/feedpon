/// <reference path="interfaces.d.ts" />

import AuthenticationService = require('../services/authenticationService');

class ContentController {
    constructor(private $scope: ng.IScope,
                private $ionicSideMenuDelegate: any,
                private authenticationService: AuthenticationService) {
    }

    authenticate(): void {
        this.authenticationService.authenticate(Date.now());
    }

    toggleLeft(): void {
        this.$ionicSideMenuDelegate.toggleLeft();
    }
}

export = ContentController;
