import {Observable} from 'rxjs/Observable';
import {makeDOMDriver, VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import {makeWindowDriver, WindowSink, WindowSource} from './makeWindowDriver';
import {makeHistoryDriver} from '@cycle/history';
import {RouterSource} from 'cyclic-router/rxjs-typings';

export type O<T> = Observable<T>;

export type SoDOM    = { DOM: DOMSource };
export type SoRouter = { router: RouterSource }
export type SoWindow = { Window: WindowSource };

export type SiDOM    = { DOM: O<VNode> };
export type SiRouter = { router: O<string> };
export type SiWindow = { Window: O<WindowSink> };

export type SoAll = SoDOM
    & SoRouter
    & SoWindow;

export type SiAll = SiDOM
    & SiRouter
    & SiWindow;

export function makeDrivers() {
    return {
        DOM: makeDOMDriver('#app'),
        history: makeHistoryDriver(),
        Window: makeWindowDriver(window, document)
    };
}
