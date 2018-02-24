import * as React from 'react';
import { connect } from './Connect';
import { currentValueStream } from './CurrentValueStream';

type LabelWidgetProperties = { value: number };

const LabelWidget = ({value}: LabelWidgetProperties) => (
  <label>{value}</label>
);

export default connect(LabelWidget, {
  value: currentValueStream
}, {});