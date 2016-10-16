# redux-ship-logger
> A logger for the [Redux Ship](https://github.com/clarus/redux-ship) effect system

<img src='https://raw.githubusercontent.com/clarus/redux-ship-logger/master/logger.png' alt='Screenshot' width='700px'>

## Getting started
Redux Ship Logger is useful to debug projects written with the [Redux Ship](https://github.com/clarus/redux-ship) effect system.
```
npm i redux-ship-logger
```

Redux Ship Logger provides two functions, one to log the commits and patches (the model part) and one to log the asynchronous actions (the controller part).

## API
* [`logCommit`](#logCommit)
* [`logShip`](#logShip)

### `logCommit`
```js
<Commit, Patch, State>(
  applyCommit: (state: State, commit: Commit) => Patch
) => ReduxMiddleware
```

Returns a Redux middleware to log the *commits* and the *patches* sent to Redux.

* `applyCommit` the function computing the patch associated to the current commit

#### Example

```js
// store.js
import {applyMiddleware, createStore} from 'redux';
import {logCommit} from 'redux-ship-logger';
import * as Controller from './controller';
import * as Model from './model';

const middlewares = [
  logCommit(Controller.applyCommit),
];

function reduce(state, commit) {
  return Model.reduce(state, Controller.applyCommit(state, commit));
}

export default createStore(reduce, Model.initialState, applyMiddleware(...middlewares));

```

### `logShip`
```js
<Action, Effect, Commit, State, A>(
  action: Action,
  ship: Ship<Effect, Commit, State, A>
) => Ship<Effect, Commit, State, A>
```

Returns a ship with the same behavior as `ship` but logging its snapshots. Also logs a stringified JSON of the snapshot ready to be used in tests with `Ship.simulate`.

#### Example
```js
// index.js
import * as Ship from 'redux-ship';
import {logShip} from 'redux-ship-logger';
import store from './store';
import * as Controller from './controller';
import * as Effect from './effect';

function* controlWithLog(action: Controller.Action) {
  yield* logShip(action, Controller.control(action));
}

function dispatch(action: Controller.Action): void {
  Ship.run(Effect.run, store.dispatch, store.getState, controlWithLog(action));
}
```
