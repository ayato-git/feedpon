import angular = require('angular');

class HttpClientOnWorker implements IHttpClient {
    public endPoint: string;

    private worker: Worker;

    private tasks: {[key: string]: ng.IDeferred<any>} = {};

    private sequences: number = 0;

    /**
     * @ngInject
     */
    constructor(private $q: ng.IQService,
                feedlyEndPoint: string) {
        this.endPoint = feedlyEndPoint;
        this.worker = new Worker('js/xhr-worker.js');
        this.worker.onmessage = this.onMessage.bind(this);
    }

    request<T>(method: string, path: string, data?: any, headers?: any): ng.IPromise<ng.IHttpPromiseCallbackArg<T>> {
        var id = this.sequences++;
        var deferred = this.tasks[id] = this.$q.defer();
        var config: ng.IRequestConfig = {
            headers: angular.extend({'content-type': 'application/json'}, headers),
            method: method,
            responseType: 'json',
            url: this.endPoint + path
        };

        if (data) {
            if (method === 'GET') {
                config.params = data;
            } else {
                config.data = angular.isObject(data) ? angular.toJson(data) : data;
            }
        }

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
