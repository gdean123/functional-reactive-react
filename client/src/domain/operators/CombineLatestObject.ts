import { Observable } from 'rxjs/Rx';

export const combineLatestObject = (
  mapOfStreams: { [key: string]: Observable<any> }): Observable<{ [key: string]: any }> => {

  const sources = [];
  const keys: Array<string> = [];
  for (const key in mapOfStreams) {
    if (mapOfStreams.hasOwnProperty(key)) {
      keys.push(key);
      sources.push(mapOfStreams[key]);
    }
  }

  return Observable.combineLatest(sources, function () {
    const combination = {};

    for (let i = arguments.length - 1; i >= 0; i--) {
      combination[keys[i]] = arguments[i];
    }

    return combination;
  });
};