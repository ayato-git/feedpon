/// <reference path="../interfaces.d.ts" />
/// <reference path="../controllers/interfaces.d.ts" />

interface IControllerMediator {
    registerSubscriptionsController(subscritionsController: ISubscriptionsController): void;

    fetchStream(streamId: string): void;
}
