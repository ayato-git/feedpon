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
            var callbacks: {[key: string]: Function} = {};

            Object.keys(events).forEach(name => {
                if (events[name].slice(1) in attrs) {
                    var callback = callbacks[name] = (event: JQueryEventObject) => {
                        scope.$apply(() => scope[name]({$event: event}));
                    };

                    element.on(name, callback);
                }
            });

            scope.$on('$destroy', function onDestroy() {
                element.off(callbacks);
            });
        }
    };
}

export = provideChromeWebviewDirective;
