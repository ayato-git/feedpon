/// <reference path="../../../bower_components/linqjs/typescript/linq.d.ts" />
/// <reference path="../../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../DefinitelyTyped/angularjs/angular-sanitize.d.ts" />
/// <reference path="../../DefinitelyTyped/angular-ui/angular-ui-router.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../../DefinitelyTyped/chrome/chrome-app.d.ts" />
/// <reference path="../../DefinitelyTyped/cordova/cordova.d.ts" />

interface Document {
    evaluate(xpathExpression: string,
             contextNode?: Node,
             namespaceResolver?: Function,
             resultType?: number,
             result?: XPathResult): XPathResult;
}

interface XPathResult {
    ANY_TYPE: number;
    ANY_UNORDERED_NODE_TYPE: number;
    BOOLEAN_TYPE: number;
    FIRST_ORDERED_NODE_TYPE: number;
    NUMBER_TYPE: number;
    RDERED_NODE_ITERATOR_TYPE: number;
    ORDERED_NODE_SNAPSHOT_TYPE: number;
    STRING_TYPE: number;
    UNORDERED_NODE_ITERATOR_TYPE: number;
    UNORDERED_NODE_SNAPSHOT_TYPE: number;
    booleanValue: boolean;
    invalidIteratorState: boolean;
    numberValue: number;
    resultType: number;
    singleNodeValue: Node;
    snapshotLength: number;
    iterateNext(): Node;
    snapshotItem(itemNumber: number): Node;
}

declare var XPathResult: {
    ANY_TYPE: number;
    ANY_UNORDERED_NODE_TYPE: number;
    BOOLEAN_TYPE: number;
    FIRST_ORDERED_NODE_TYPE: number;
    NUMBER_TYPE: number;
    RDERED_NODE_ITERATOR_TYPE: number;
    ORDERED_NODE_SNAPSHOT_TYPE: number;
    STRING_TYPE: number;
    UNORDERED_NODE_ITERATOR_TYPE: number;
    UNORDERED_NODE_SNAPSHOT_TYPE: number;
};

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
