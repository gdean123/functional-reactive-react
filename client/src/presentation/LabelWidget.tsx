import * as React from 'react';
import { connect } from './support/Connect';
import { currentValueStream } from '../domain/streams/CurrentValueStream';

type LabelWidgetProperties = { value: number };

const LabelWidget = ({value}: LabelWidgetProperties) => (
  <label>{value}</label>
);

export default connect(LabelWidget, {
  value: currentValueStream
}, {});