/// <reference path="../../../bower_components/linqjs/typescript/linq.d.ts" />
/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../DefinitelyTyped/angularjs/angular-sanitize.d.ts" />
/// <reference path="../../DefinitelyTyped/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome-app.d.ts" />
/// <reference path="../../DefinitelyTyped/cordova/cordova.d.ts" />

declare module "angular" {
    export = angular;
}

declare module ionic {
    var Platform: IPlatform;

    interface IPlatform {
        ready(callback: Function): void;
        setGrade(grade: string): void;
        device(): Object;
        isWebView(): boolean;
        isIPad(): boolean;
        isIOS(): boolean;
        isAndroid(): boolean;
        isWindowsPhone(): boolean;
        platform(): string;
        version(): string;
        exitApp(): void;
        showStatusBar(shouldShow: boolean): void;
        fullScreen(showFullScreen?: boolean, showStatusBar?: boolean): void;
        isReady: boolean;
        isFullScreen: boolean;
        platforms: string[];
        grade: string;
    }

    interface ISideMenuDelegate {
        toggleLeft(isOpen?: boolean): void;
        toggleRight(isOpen?: boolean): void;
        getOpenRatio(): number;
        isOpen(): boolean;
        isOpenLeft(): boolean;
        isOpenRight(): boolean;
        canDragContent(canDrag?: boolean): boolean;
        edgeDragThreshold(value: boolean): boolean;
        edgeDragThreshold(value: number): boolean;
        $getByHandle(handle: string): ISideMenuDelegate;
    }

    interface ILoading {
        show(opts: {
            template?: string;
            templateUrl?: string;
            noBackdrop?: boolean;
            delay?: number;
            duration?: number;
        }): void;
        hide(): void;
    }
}

declare var require: (file: string) => void;
