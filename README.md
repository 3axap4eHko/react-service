# React Service Provider Component

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Usage

A component that represent some async action result
Value.jsx
``` javascript
import React, { Component } from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { withService } from 'react-service';
import { getValue } from '../redux/actions'; // async action

@withService({ 
  contextTypes: {
      store: object,
  },
  service: ({ id }, { store }) => store.dispatch(getValue(id)), 
})
@connect(({ value }) => ({ value }))
export default class Value extends Component {
  render() {
    const { value } = this.props;
    return (
      <div>{value}</div>
    );
  }
}
```

An application component
App.jsx
``` javascript
import React from 'react';
import Value from './Value';

export default function App() {
  return (
    <div>
      Value: <Value id={21} />
    </div>
  );
}
```

Client entry point client.jsx
``` javascript
import React from 'react';
import { Provider } from 'react-redux';
import { hydrate } from 'react-dom';
import App from './components/App';
import createStore from './redux/createStore';

const store = createStore(window.__INITIAL_STATE__);

hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'));
```

Server entry point server.jsx
``` javascript
import React from 'react';
import Express from 'express';
import { Provider } from 'react-redux';
import { render } from 'react-service';
import createStore from './redux/createStore';
import App from './components/App';

const app = Express();

app.get('*', async (req, res) => {
  const store = createStore({ value: 0 });

  const content = await render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  res.end(
    `<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
<div id="app">${content}</div>
<!-- Transfer state of store -->
<script>window.__INITIAL_STATE__ = ${JSON.stringify(store.getState()).replace(/</g, '\\\u003c')}
</script>
</body>
</html>`,
  );
});

app.listen(4000, () => {
  console.log(`Served from http://localhost:4000`); // eslint-disable-line no-console
});
```

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2017 Ivan Zakharchenko


[downloads-image]: https://img.shields.io/npm/dm/react-service.svg
[npm-url]: https://www.npmjs.com/package/react-service
[npm-image]: https://img.shields.io/npm/v/react-service.svg

[travis-url]: https://travis-ci.org/3axap4eHko/react-service
[travis-image]: https://img.shields.io/travis/3axap4eHko/react-service/master.svg
