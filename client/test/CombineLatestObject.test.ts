import { Subject } from 'rxjs/Rx';

import { combineLatestObject } from '../src/CombineLatestObject';

describe('combineLatestObject', () => {
  let colorStream: Subject<string>;
  let cityStream: Subject<string>;
  let combinedObject: {[key: string]: any};

  beforeEach(() => {
    colorStream = new Subject();
    cityStream = new Subject();

    const combinedObjectStream = combineLatestObject({
      color: colorStream,
      city: cityStream
    });

    combinedObjectStream.subscribe(latestCombinedObject => {
      combinedObject = latestCombinedObject;
    });
  });

  it('emits the combined object whenever any of the input streams emit', () => {
    colorStream.next('violet');
    expect(combinedObject).toBeUndefined();

    cityStream.next('Santa Monica');
    expect(combinedObject).toEqual({
      color: 'violet',
      city: 'Santa Monica'
    });
  });
});
