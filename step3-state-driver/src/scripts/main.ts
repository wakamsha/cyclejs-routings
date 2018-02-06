import {Observable as O} from 'rxjs';
import {div, VNode, makeDOMDriver, button, label, input, hr, h1, CycleDOMEvent} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import run from '@cycle/rxjs-run';
import {assoc} from 'ramda';
import {HomeState, makeStateDriver, StateSink, StateSource} from './drivers/makeStateDriver';

type SoAll = {
    DOM: DOMSource;
    State: StateSource;
}

type SiAll = {
    DOM: O<VNode>;
    State: O<StateSink>;
}

type PageState = {
    name: string;
}

function render({pageState, state}: {
    pageState: PageState;
    state: any;
}): VNode {
    console.log(state);
    return div('.well', [
        div('.form-group', [
            label('Name: '),
            input('.event-input-name.form-control', {
                props: {
                    type: 'text'
                }
            }),
        ]),
        button(`.event-click.btn.btn-primary`, ['CLICK']),
        hr(),
        h1(`Hello ${pageState.name}`)
    ]);
}

function main({DOM, State}: SoAll): SiAll {
    const eventInput$ = DOM.select('.event-input-name').events('input');
    const eventClick$ = DOM.select('.event-click').events('click');

    const initialPageState: PageState = {
        name: '',
    };
    const pageState$: O<PageState> = O.merge(
        eventInput$.map((e: CycleDOMEvent) => assoc('name', (e.ownerTarget as HTMLInputElement).value)),
    ).scan((acc: PageState, action: (state: PageState) => PageState) => action(acc), initialPageState).startWith(initialPageState);

    const state$ = State.select('home').switchMap(state =>
        O.merge(
            eventClick$.mapTo(assoc('foo', `${new Date().getTime()}`))
        ).scan((acc: HomeState, fn: (state: HomeState) => HomeState) => fn(acc), state).startWith(state)
    );

    const dom$ = O.combineLatest(
        pageState$,
        state$,
        (pageState, state) => render({pageState, state})
    );

    return {
        DOM: dom$,
        State: O.of({name: 'home' as 'home', payload: {foo: 'start'}})
    };
}

run(main, {
    DOM: makeDOMDriver('#app'),
    State: makeStateDriver()
});

