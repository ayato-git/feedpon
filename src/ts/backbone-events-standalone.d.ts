// Type definitions for backbone-events-standalone
// Project: https://github.com/n1k0/backbone-events-standalone
// Definitions by: Shota Nozaki <https://github.com/emonkak/>

declare class BackboneEvents {
    on(eventName: string, callback?: Function, context?: any): any;
    off(eventName?: string, callback?: Function, context?: any): any;
    trigger(eventName: string, ...args: any[]): any;
    bind(eventName: string, callback: Function, context?: any): any;
    unbind(eventName?: string, callback?: Function, context?: any): any;

    once(events: string, callback: Function, context?: any): any;
    listenTo(object: any, events: string, callback: Function): any;
    listenToOnce(object: any, events: string, callback: Function): any;
    stopListening(object?: any, events?: string, callback?: Function): any;
}

declare module "backbone-events-standalone" {
    export = BackboneEvents;
}
