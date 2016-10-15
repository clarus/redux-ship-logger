// @flow
/* eslint-disable no-console */
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

const colors = {
  blue: '#03A9F4',
  green: '#4CAF50',
  grey: '#9E9E9E',
  inherit: 'inherit',
  lightPurle: '#795DA3',
  purle: '#800080',
};

function style(color: string): string {
  return `color: ${color}; font-weight: bold`;
}

export function logCommit<Commit, Patch, State>(
  applyCommit: (state: State, commit: Commit) => Patch
): Function {
  return store => next => commit => {
    const previousState = store.getState();
    const result = next(commit);
    const nextState = store.getState();
    const now = new Date();
    const type = typeof commit === 'object' && commit !== null ?
      commit.type :
      '';
    console.group(`%c commit @ ${isoLocaleTimeString(now)} ${String(type)}`, style(colors.inherit));
    console.log('%c prev state', style(colors.grey), previousState);
    console.log('%c commit', style(colors.blue), commit);
    console.log('%c patch', style(colors.blue), applyCommit(previousState, commit));
    console.log('%c next state', style(colors.green), nextState);
    console.groupEnd();
    return result;
  };
}

function snapshotShape<Effect, Commit, State>(
  snapshot: Snapshot<Effect, Commit, State>
): string[] {
  return snapshot.map((snapshotItem) => snapshotItem.type);
}

export function* logShip<Action, Effect, Commit, State, A>(
  action: Action,
  ship: Ship<Effect, Commit, State, A>
): Ship<Effect, Commit, State, A> {
  const {result, snapshot} = yield* snap(ship);
  const now = new Date();
  const type = typeof action === 'object' && action !== null ?
    action.type :
    '';
  console.group(`%c ship @ ${isoLocaleTimeString(now)} ${String(type)}`, style(colors.inherit));
  console.log('%c action', style(colors.blue), action);
  console.log('%c shape', style(colors.lightPurle), ...snapshotShape(snapshot));
  console.log('%c snapshot', style(colors.purle), snapshot);
  console.groupCollapsed('%c snapshot json', style(colors.grey));
  console.log(JSON.stringify(snapshot));
  console.groupEnd();
  console.groupEnd();
  return result;
}
