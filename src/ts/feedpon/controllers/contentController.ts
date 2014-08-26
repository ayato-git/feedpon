import AuthenticationService = require('../services/authenticationService');

class ContentController {
    /**
     * @ngInject
     */
    constructor(private $scope: IContentScope,
                private $ionicLoading: any,
                private $ionicSideMenuDelegate: any,
                private authenticationService: AuthenticationService,
                private feedlyGateway: IFeedlyGateway) {
        $scope.$on(
            'feedpon.fetchContents',
            (event: ng.IAngularEvent, streamId: string) => {
                this.fetchContents(streamId);
            });
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

    fetchContents(streamId: string): void {
        this.feedlyGateway
            .getContents({streamId: streamId})
            .then((contents) => {
                this.$scope.contents = contents;
            });
    }
}

export = ContentController;
