import * as React from 'react';
import { mount } from 'enzyme';

import ButtonWidget, { didClickIncrementStream } from '../../src/presentation/ButtonWidget';

it('emits an event when the button is clicked', () => {
  let emitted = false;
  didClickIncrementStream.subscribe(() => {
    emitted = true;
  });

  const wrapper = mount(<ButtonWidget/>);
  wrapper.find('button').simulate('click');

  expect(emitted).toBeTruthy();
});
