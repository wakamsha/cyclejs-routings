import {Observable as O} from 'rxjs';
import Stream from 'xstream';
import {Subject} from 'rxjs/Subject';


export class HomeState {
    public foo = 'aaa';
}


class StateSet {
    public home = new HomeState();
}

export type StateSink = {
    name: keyof StateSet;
    payload: any;
}

export class StateSource {
    constructor(private set: StateSet, private subject$: O<keyof StateSet>) {}

    public select(name: keyof StateSet) {
        return this.subject$.filter(key => key === name).map(name => (this.set[name]));
    }
}

export function makeStateDriver(): (sinks$: Stream<StateSink>) => StateSource {
    return function StateDriver(sinks$: Stream<StateSink>): StateSource {
        const subject = new Subject<keyof StateSet>();
        const set = new StateSet();
        const stateSource = new StateSource(set, subject);
        O.from(sinks$).subscribe((sinks: StateSink) => {
            set[sinks.name] = sinks.payload;
            subject.next(sinks.name);
        });
        return stateSource;
    }
}
