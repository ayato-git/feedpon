class ContentController {
    /**
     * @ngInject
     */
    constructor(private $scope: IContentScope,
                private $ionicLoading: any,
                private $ionicSideMenuDelegate: any,
                private feedlyGateway: IFeedlyGateway) {
        $scope.$on(
            'feedpon.fetchContents',
            (event: ng.IAngularEvent, streamId: string) => {
                this.fetchContents(streamId);
            });
    }

    toggleLeft(): void {
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    fetchContents(streamId: string): void {
        this.$ionicLoading.show({
            template: 'Loading...'
        });

        this.feedlyGateway
            .getContents({streamId: streamId})
            .then((contents) => {
                this.$scope.contents = contents;
            })
            .finally(() => this.$ionicLoading.hide());
    }
}

export = ContentController;
