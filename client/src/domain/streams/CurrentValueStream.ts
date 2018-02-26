import { didClickIncrementStream } from '../../presentation/ButtonWidget';

export const currentValueStream =
  didClickIncrementStream
    .mapTo(1)
    .startWith(1)
    .scan((accumulator, currentValue) => accumulator + currentValue);