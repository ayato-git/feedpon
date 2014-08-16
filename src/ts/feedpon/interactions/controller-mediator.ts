/// <reference path="interfaces.d.ts" />

class ControllerMediator implements IControllerMediator {
    private subscriptionsController: ISubscriptionsController;

    registerSubscriptionsController(subscriptionsController: ISubscriptionsController): void {
        this.subscriptionsController = subscriptionsController;
    }

    fetchStream(streamId: string): void {
    }
}

export = ControllerMediator;
