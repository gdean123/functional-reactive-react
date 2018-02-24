import * as React from 'react';
import * as _ from 'lodash';
import * as Rx from 'rxjs';

import { combineLatestObject } from '../../domain/operators/CombineLatestObject';

type Value = any;
type ValueStream = Rx.Observable<Value>;
type State = { [key: string]: any };
type StateStream = Rx.Observable<State>;
type PropertyMap = { [key: string]: ValueStream };
type Observer = Rx.Observer<Value>;
type ObserverActionMap = { [key: string]: Observer };
type FunctionActionMap = { [key: string]: (value: Value) => void };

const createStatefulComponent = (StatelessComponent: React.StatelessComponent, requiresState: boolean,
                                 getInitialState: () => State, currentStateStream: StateStream,
                                 actions: FunctionActionMap): React.ComponentClass => {
  return class extends React.Component {
    properties: State;
    subscription: Rx.Subscription;

    constructor(properties: State) {
      super(properties);
      this.state = getInitialState();
      this.properties = properties;
    }

    componentDidMount() {
      this.subscription = currentStateStream.subscribe(valueMap => {
        this.setState(valueMap);
      });
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    render() {
      if (requiresState && this.state === null) {
        return null;
      } else {
        return (
          <StatelessComponent {...this.properties} {...this.state} {...actions}/>
        );
      }
    }
  };
};

const storeInitialState = (currentStateStream: StateStream): (() => State) => {
  let initialState: any = null;
  currentStateStream.subscribe(valueMap => initialState = valueMap);

  return () => initialState;
};

const createActions = (actionMap: ObserverActionMap): FunctionActionMap => (
  _.mapValues(actionMap, (observer: Observer) => (
    (value: Value) => observer.next(value)
  ))
);

export const connect = (StatelessComponent: React.StatelessComponent<any>, mapStreamsToProps: PropertyMap,
                        mapActionsToProps: ObserverActionMap): React.ComponentClass => {
  const currentStateStream = combineLatestObject(mapStreamsToProps);
  const getInitialState = storeInitialState(currentStateStream);
  const actions = createActions(mapActionsToProps);
  const requiresState = !_.isEmpty(mapStreamsToProps);

  return createStatefulComponent(StatelessComponent, requiresState, getInitialState, currentStateStream, actions);
};