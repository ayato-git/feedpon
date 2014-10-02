import angular = require('angular');

class HttpClientOnWorker implements IHttpClient {
    private worker: Worker;

    private tasks: {[key: string]: ng.IDeferred<any>} = {};

    private sequence: number = 0;

    /**
     * @ngInject
     */
    constructor(private $q: ng.IQService) {
        this.worker = new Worker('js/xhr-worker.js');
        this.worker.onmessage = this.onMessage.bind(this);
    }

    request<T>(config: ng.IRequestConfig): ng.IPromise<ng.IHttpPromiseCallbackArg<T>> {
        var id = this.sequence++;
        var deferred = this.tasks[id] = this.$q.defer();

        config.headers = angular.extend({
            'content-type': 'application/json'
        }, config.headers || {});

        this.worker.postMessage({
            id: id,
            config: config
        });

        return deferred.promise;
    }

    private onMessage(e: any): void {
        var message = e.data;
        if (message == null) return;

        var id = message.id;
        var task = this.tasks[id];
        if (task == null) return;

        var status = message.status;
        if ((status >= 200 && status < 300) || status == 304 ||
            (status == 0 && message.config.url.indexOf('file://') === 0)) {
            task.resolve(message);
        } else {
            task.reject(message);
        }

        delete this.tasks[id];
    }
}

export = HttpClientOnWorker;
