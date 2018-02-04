import {Observable as O} from 'rxjs';
import {assoc} from 'ramda';
import {button, CycleDOMEvent, div, h1, hr, input, label, p, VNode} from '@cycle/dom';
import {SiAll, SoAll} from '../drivers';

type PageState = {
    name: string;
}

function render({pageState}: {
    pageState: PageState;
}): VNode {
    return div([
        h1(['Home']),
        div('.form-group', [
            label('Name: '),
            input('.event-input-name.form-control', {
                props: {
                    type: 'text'
                }
            }),
        ]),
        p(`Hello ${pageState.name}`),
        hr(),
        button(`.event-click.btn.btn-primary`, ['Other'])
    ])
}

export class IndexPage {

    public main({DOM}: SoAll): SiAll {
        const eventInput$ = DOM.select('.event-input-name').events('input');
        const eventClick$ = DOM.select('.event-click').events('click');

        const initialPageState: PageState = {
            name: ''
        };
        const pageState$: O<PageState> = O.merge(
            eventInput$.map((e: CycleDOMEvent) => assoc('name', (e.ownerTarget as HTMLInputElement).value))
        )
            .scan((acc, fn) => fn(acc), initialPageState)
            .startWith(initialPageState);

        const dom$ = pageState$.map(pageState => render({pageState}));
        const router$ = eventClick$.mapTo('/other');

        return {
            DOM: dom$,
            router: router$,
            Window: O.of({title: 'Home'})
        };
    }
}
