import { Subject } from 'rxjs/Rx';
import * as React from 'react';
import { connect } from './Connect';

export const didClickIncrementStream = new Subject();

type ButtonWidgetProperties = { didClickIncrement: () => void };

const ButtonWidget = ({ didClickIncrement }: ButtonWidgetProperties) => (
  <button onClick={didClickIncrement}>Increment</button>
);

export default connect(ButtonWidget, {}, {
  didClickIncrement: didClickIncrementStream
});