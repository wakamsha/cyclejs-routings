import {Observable as O} from 'rxjs';
import {div, VNode, makeDOMDriver, button} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import run from '@cycle/rxjs-run';
import {RouterSource} from 'cyclic-router/rxjs-typings';
import {routerify} from 'cyclic-router';
import switchPath from 'switch-path';
import {makeHistoryDriver} from '@cycle/history';

type SoAll = {
    DOM: DOMSource;
    router: RouterSource;
}

type SiAll = {
    DOM: O<VNode>;
    router: O<string>;
}
//
// type PageState = {
//     name: string;
// }

// function render({pageState}: {
//     pageState: PageState;
// }): VNode {
//     return div('.well', [
//         div('.form-group', [
//             label('Name: '),
//             input('.event-input-name.form-control', {
//                 props: {
//                     type: 'text'
//                 }
//             }),
//         ]),
//         button(`.event-click.btn.btn-primary`, ['CLICK']),
//         hr(),
//         h1(`Hello ${pageState.name}`)
//     ]);
// }

function HomeComponent({DOM}: SoAll): SiAll {
    const dom$ = O.of(
        div([
            button(`.event-click.btn.btn-primary`, ['Other'])
        ])
    );
    const router$ = DOM.select('.event-click').events('click').mapTo('/other');

    return {
        DOM: dom$,
        router: router$
    };
}

function OtherComponent({DOM}: SoAll): SiAll {
    const dom$ = O.of(
        div([
            button(`.event-click.btn.btn-primary`, ['Home'])
        ])
    );
    const router$ = DOM.select('.event-click').events('click').mapTo('/');

    return {
        DOM: dom$,
        router: router$
    };
}

function main(sources: SoAll): SiAll {
    const match$ = sources.router.define({
        '/': HomeComponent,
        '/other': OtherComponent
    });

    const page$ = match$.map((match: any) => match.value(Object.assign({}, sources, {
        router: sources.router.path(match.path)
    })));

    return {
        DOM: page$.map((sinks: SiAll) => sinks.DOM).switch(),
        router: page$.map((sinks: SiAll) => sinks.router).switch()
    };
}

run(routerify(main, switchPath), {
    DOM: makeDOMDriver('#app'),
    history: makeHistoryDriver()
});
