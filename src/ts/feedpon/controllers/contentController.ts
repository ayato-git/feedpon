class ContentController {
    /**
     * @ngInject
     */
    constructor(private $scope: IContentScope,
                private $ionicLoading: ionic.ILoading,
                private $ionicSideMenuDelegate: ionic.ISideMenuDelegate,
                private $stateParams: ng.ui.IStateParamsService,
                private feedlyGateway: IFeedlyGateway) {
        if ($stateParams['streamId']) {
            this.fetchContents($stateParams['streamId']);
        }
    }

    toggleLeft(): void {
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    fetchContents(streamId: string): void {
        this.$ionicLoading.show({
            template: 'Loading contents...'
        });

        this.feedlyGateway.getContents({streamId: streamId})
            .then((contents) => {
                this.$scope.contents = contents;
            })
            .finally(() => this.$ionicLoading.hide());
    }
}

export = ContentController;
