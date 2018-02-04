import {Observable as O} from 'rxjs/Observable';
import {fromEvent} from 'rxjs/observable/fromEvent';
import Stream from 'xstream';
import {from} from 'rxjs/observable/from';

export type WindowSink = {
    title?: string;
}

export class WindowSource {
    constructor(private _window: Window, private _document: Document) {}

    complementEvents(target: string, eventName: string): O<Event> {
        // 指定したtargetがcontainしていないdomで起こったevent
        return fromEvent(this._window, eventName, {capture: true})
            .filter((event: any) => ![...this._document.querySelectorAll(target)].some(element => element.contains(event.target)));
    }
}

export function makeWindowDriver(_window: Window, _document: Document) {
    function WindowDriver(sinks$: Stream<WindowSink>) {
        from(sinks$).subscribe((sinks: WindowSink) => {
            if (sinks.title !== undefined) {
                document.title = `${sinks.title} | Cycle.js DEMO`
            }
        });
        return new WindowSource(_window, _document);
    }

    return WindowDriver;
}
