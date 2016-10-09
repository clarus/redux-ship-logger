// @flow
import type {Ship, Snapshot} from 'redux-ship';
import {snap} from 'redux-ship';

function padTwoDigits(n: number): string {
  return n < 10 ? '0' + String(n) : String(n);
}

function isoLocaleTimeString(date: Date): string {
  return padTwoDigits(date.getHours()) + ':' +
    padTwoDigits(date.getMinutes()) + ':' +
    padTwoDigits(date.getSeconds()) + '.' +
    (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
}

function snapshotShape<Effect, Action, State>(
  snapshot: Snapshot<Effect, Action, State>
): string[] {
  return snapshot.map((snapshotItem) => snapshotItem.type);
}

export default function* <ControllerAction, Effect, Action, State, A>(
  action: ControllerAction,
  ship: Ship<Effect, Action, State, A>
): Ship<Effect, Action, State, A> {
  const {result, snapshot} = yield* snap(ship);
  const now = new Date();
  const type = typeof action === 'object' && action !== null ?
    action.type :
    '';
  console.group(`%c ship @ ${isoLocaleTimeString(now)} ${String(type)}`, 'color: inherit; font-weight: bold');
  console.log('%c action', 'color: #03A9F4; font-weight: bold', action);
  console.log('%c shape', 'color: #795DA3; font-weight: bold', ...snapshotShape(snapshot));
  console.log('%c snapshot', 'color: purple; font-weight: bold', snapshot);
  console.groupCollapsed('%c snapshot json', 'color: grey; font-weight: bold');
  console.log(JSON.stringify(snapshot));
  console.groupEnd();
  console.groupEnd();
  return result;
}
