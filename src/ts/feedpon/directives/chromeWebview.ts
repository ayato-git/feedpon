function provideChromeWebviewDirective(): ng.IDirective {
    var events: {[key: string]: string} = {
        close: '&onClose',
        consolemessage: '&onConsolemessage',
        contentload: '&onContentload',
        dialog: '&onDialog',
        exit: '&onExit',
        findupdate: '&onFindupdate',
        loadabort: '&onLoadabort',
        loadcommit: '&onLoadcommit',
        loadredirect: '&onLoadredirect',
        loadstart: '&onLoadstart',
        loadstop: '&onLoadstop',
        newwindow: '&onNewwindow',
        permissionrequest: '&onPermissionrequest',
        responsive: '&onResponsive',
        sizechanged: '&onSizechanged',
        unresponsive: '&onUnresponsive',
        zoomchange: '&onZoomchange'
    };

    return {
        restrict: 'E',
        scope: events,
        link: function postLink(scope, element, attrs) {
            Object.keys(events).forEach(name => {
                if (events[name].slice(1) in attrs) {
                    element.on(name, (event) => {
                        scope.$apply(() => scope[name]({$event: event}));
                    });
                }
            });
        }
    };
}

export = provideChromeWebviewDirective;
