import {assoc} from 'ramda';
import run from '@cycle/rxjs-run';
import {RouteMatcherReturn, routerify} from 'cyclic-router';
import switchPath from 'switch-path';
import {IndexPage} from './pages/IndexPage';
import {OtherPage} from './pages/OtherPage';
import {makeDrivers, SiAll, SoAll} from './drivers';

function main(sources: SoAll): SiAll {
    const match$ = sources.router.define({
        '/': new IndexPage().main,
        '/other': new OtherPage().main
    });

    const page$ = match$.map((match: RouteMatcherReturn) => match.value(assoc('router', sources.router.path(match.path || '/'))(sources)));

    return {
        DOM: page$.map((sinks: SiAll) => sinks.DOM).switch(),
        router: page$.map((sinks: SiAll) => sinks.router).switch(),
        Window: page$.map((sinks: SiAll) => sinks.Window).switch()
    };
}

run(routerify(main, switchPath), makeDrivers());
