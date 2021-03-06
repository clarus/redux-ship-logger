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

function snapshotShape<Effect, Commit>(snapshot: Snapshot<Effect, Commit>): string[] {
  return snapshot.map((snapshotItem) => snapshotItem.type);
}

export function logControl<Action, Effect, Commit, State>(
  control: (action: Action) => Ship<Effect, Commit, State, void>
): (action: Action) => Ship<Effect, Commit, State, void> {
  return function* (action) {
    const {result, snapshot} = yield* snap(control(action));
    const now = new Date();
    const type = typeof action === 'object' && action !== null ?
      action.type :
      '';
    console.group(`%c control @ ${isoLocaleTimeString(now)} ${String(type)}`,
      style(colors.inherit));
    console.log('%c action', style(colors.blue), action);
    console.log('%c shape', style(colors.lightPurle), ...snapshotShape(snapshot));
    console.log('%c snapshot', style(colors.purle), snapshot);
    {
      console.groupCollapsed('%c json action snapshot', style(colors.grey));
      console.log(JSON.stringify({action, snapshot}));
      console.groupEnd();
    }
    console.groupEnd();
    return result;
  };
}
