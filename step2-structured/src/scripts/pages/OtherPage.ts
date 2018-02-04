import {button, div, h1, hr, VNode} from '@cycle/dom';
import {Observable as O} from 'rxjs/Observable';
import {SiAll, SoAll} from '../drivers';

function render(): VNode {
    return div([
        h1(['Other']),
        hr(),
        button(`.event-click.btn.btn-primary`, ['Home'])
    ]);
}

export class OtherPage {

    public main({DOM}: SoAll): SiAll {
        const eventClick$ = DOM.select('.event-click').events('click');

        const dom$ = O.of(render());
        const router$ = eventClick$.mapTo('/');

        return {
            DOM: dom$,
            router: router$,
            Window: O.of({title: 'Other'})
        };
    }
}
