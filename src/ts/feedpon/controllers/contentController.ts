class ContentController {
    /**
     * @ngInject
     */
    constructor(private $scope: IContentScope,
                private $ionicLoading: any,
                private $ionicSideMenuDelegate: any,
                private $stateParams: ng.ui.IStateParamsService,
                private feedlyGatewayService: IFeedlyGatewayService) {
        if ($stateParams['streamId']) {
            this.fetchContents($stateParams['streamId']);
        }
    }

    toggleLeft(): void {
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    fetchContents(streamId: string): void {
        this.$ionicLoading.show({
            template: 'Loading...'
        });

        this.feedlyGatewayService.getContents({streamId: streamId})
            .then((contents) => {
                this.$scope.contents = contents;
            })
            .finally(() => this.$ionicLoading.hide());
    }
}

export = ContentController;
