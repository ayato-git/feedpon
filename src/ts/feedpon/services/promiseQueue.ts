class PromiseQueue {
    private tasks: Array<() => ng.IPromise<any>> = [];

    private runningWorkers: number = 0;

    constructor(private maxWorkers: number) {
    }

    enqueue(task: (...args: any[]) => ng.IPromise<any>, ...args: any[]): void {
        this.tasks.push(() => task.apply(null, args));
        this.process();
    }

    private process(): void {
        if (this.runningWorkers < this.maxWorkers) {
            var remaining = this.maxWorkers - this.runningWorkers;
            var l = Math.min(remaining, this.tasks.length);
            for (var i = 0; i < l; i++) {
                this.run(this.tasks.shift());
            }
        }
    }

    private run(task: () => ng.IPromise<any>): void {
        this.runningWorkers++;

        task().finally(() => {
            this.runningWorkers--;
            this.process()
        });
    }
}

export = PromiseQueue;
