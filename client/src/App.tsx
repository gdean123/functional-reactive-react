import * as React from 'react';

import ButtonWidget from './ButtonWidget';
import LabelWidget from './LabelWidget';

class App extends React.Component {
  render() {
    return (
      <div>
        <ButtonWidget />
        <LabelWidget />
      </div>
    );
  }
}

export default App;
