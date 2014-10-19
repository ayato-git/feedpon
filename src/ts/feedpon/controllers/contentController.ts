interface IContentScope extends ng.IScope {
    contents: Contents;
}

class ContentController {
    /**
     * @ngInject
     */
    constructor(private $scope: IContentScope,
                private $ionicLoading: ionic.ILoading,
                private $ionicSideMenuDelegate: ionic.ISideMenuDelegate,
                private $stateParams: ng.ui.IStateParamsService,
                private feedlyGateway: IFeedlyGateway,
                private fullContentLoader: IFullContentLoader) {
        if ($stateParams['streamId']) {
            this.fetchContents($stateParams['streamId']);
        }
    }

    toggleLeft(): void {
        this.$ionicSideMenuDelegate.toggleLeft();
    }

    extractFullContent(item: ContentItem): void {
        var link = item.alternate[0];
        if (link) {
            this.$ionicLoading.show({
                template: 'Loading the full content...'
            });

            this.fullContentLoader.load(link.href).then((element) => {
                if (element) item.content.content = element.outerHTML;
            }).finally(() => this.$ionicLoading.hide());
        }
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
