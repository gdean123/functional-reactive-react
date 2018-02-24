import { didClickIncrementStream } from '../../presentation/ButtonWidget';

export const currentValueStream =
  didClickIncrementStream
    .startWith(1)
    .mapTo(1)
    .scan((accumulator, currentValue) => accumulator + currentValue);