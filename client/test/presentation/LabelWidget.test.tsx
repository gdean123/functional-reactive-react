import * as React from 'react';
import { mount } from 'enzyme';
import { currentValueStream } from '../../src/domain/streams/CurrentValueStream';
import LabelWidget from '../../src/presentation/LabelWidget';
import { Subject } from 'rxjs/Subject';

jest.mock('../../src/domain/streams/CurrentValueStream');

describe('LabelWidget', () => {
  it('renders the current value', () => {
    const wrapper = mount(<LabelWidget />);
    (currentValueStream as Subject<number>).next(123);
    wrapper.update();
    expect(wrapper.find('label').text()).toEqual('123');
  });
});
