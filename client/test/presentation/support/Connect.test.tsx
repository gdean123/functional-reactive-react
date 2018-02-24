import * as Rx from 'rxjs';
import * as React from 'react';
import { mount } from 'enzyme';
import { connect } from '../../../src/presentation/support/Connect';

describe('connect', () => {
  describe('receiving stream values', () => {
    let StatefulComponent: React.ComponentClass;
    let favoriteColorStream: Rx.Subject<string>;

    beforeEach(() => {
      favoriteColorStream = new Rx.Subject();

      const StatelessComponent = ({favoriteColor}: { favoriteColor: string }) => (
        <div>{favoriteColor}</div>
      );

      StatefulComponent = connect(StatelessComponent, {favoriteColor: favoriteColorStream}, {});
    });

    it('re-renders stateless components when values are emitted on a dependent stream', () => {
      const mountedComponent = mount(<StatefulComponent/>);
      favoriteColorStream.next('blue');
      expect(mountedComponent.text()).toEqual('blue');
    });

    it('sets the initial state of components when they are mounted after a value has been emitted', () => {
      favoriteColorStream.next('red');
      const mountedComponent = mount(<StatefulComponent/>);
      expect(mountedComponent.text()).toEqual('red');
    });
  });

  describe('receiving property values', () => {
    let StatefulComponent: React.ComponentClass<any>;

    beforeEach(() => {
      const StatelessComponent = ({favoriteCity}: { favoriteCity: string }) => (
        <div>{favoriteCity}</div>
      );

      StatefulComponent = connect(StatelessComponent, {}, {});
    });

    it('passes through properties', () => {
      const mountedComponent = mount(<StatefulComponent favoriteCity="Santa Monica"/>);
      expect(mountedComponent.text()).toEqual('Santa Monica');
    });
  });

  describe('taking actions', () => {
    let StatefulComponent: React.ComponentClass;
    let didChangeFavoriteColorStream: Rx.Subject<string>;

    beforeEach(() => {
      didChangeFavoriteColorStream = new Rx.Subject();

      type Action = (favoriteColor: string) => undefined;
      const StatelessComponent = ({didChangeFavoriteColor}: { didChangeFavoriteColor: Action }) => (
        <button onClick={didChangeFavoriteColor('violet')}/>
      );

      StatefulComponent = connect(StatelessComponent, {}, {
        didChangeFavoriteColor: didChangeFavoriteColorStream
      });
    });

    it('presents actions to the component as easy to use callbacks', () => {
      let receivedFavoriteColor = 'unknown';
      didChangeFavoriteColorStream.subscribe(newFavoriteColor => {
        receivedFavoriteColor = newFavoriteColor;
      });

      const mountedComponent = mount(<StatefulComponent/>);
      mountedComponent.find('button').simulate('click');
      expect(receivedFavoriteColor).toEqual('violet');
    });
  });

  describe('initial rendering', () => {
    describe('when the component has dependent streams', () => {
      let StatefulComponent: React.ComponentClass;
      let favoriteColorStream: Rx.Subject<string>;
      let favoriteCityStream: Rx.Subject<string>;

      beforeEach(() => {
        favoriteColorStream = new Rx.Subject();
        favoriteCityStream = new Rx.Subject();

        type State = { favoriteColor: string, favoriteCity: string };
        const StatelessComponent = ({favoriteColor, favoriteCity}: State) => (
          <div>
            <span>Rendered!</span>
            <div>{favoriteColor}</div>
            <div>{favoriteCity}</div>
          </div>
        );

        StatefulComponent = connect(StatelessComponent, {
          favoriteColor: favoriteColorStream,
          favoriteCity: favoriteCityStream
        }, {});
      });

      it('does not render the component until all dependent streams have emitted', () => {
        const mountedComponent = mount(<StatefulComponent/>);
        expect(mountedComponent.html()).toEqual(null);

        favoriteColorStream.next('red');
        expect(mountedComponent.html()).toEqual(null);

        favoriteCityStream.next('Santa Monica');
        expect(mountedComponent.text()).toContain('Rendered!');
      });
    });

    describe('when the component does not have dependent streams', () => {
      let StatefulComponent: React.ComponentClass;

      beforeEach(() => {
        const StatelessComponent = () => (
          <span>Rendered!</span>
        );

        StatefulComponent = connect(StatelessComponent, {}, {});
      });

      it('renders the component immediately when the state map is {}', () => {
        const mountedComponent = mount(<StatefulComponent/>, {});
        expect(mountedComponent.text()).toContain('Rendered!');
      });

      it('renders the component immediately when the state map is undefined', () => {
        const mountedComponent = mount(<StatefulComponent/>);
        expect(mountedComponent.text()).toContain('Rendered!');
      });
    });
  });
});