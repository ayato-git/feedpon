class WelcomeController {
    /**
     * @ngInject
     */
    constructor(private $scope: ng.IScope,
                private $ionicSideMenuDelegate: any) {
    }

    toggleLeft(): void {
        this.$ionicSideMenuDelegate.toggleLeft();
    }
}

export = WelcomeController;
