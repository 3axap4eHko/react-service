# React Service Component

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Usage

A simple example component that fetches API
Value.jsx
``` javascript
import React, { Component } from 'react';
import { withService } from 'react-service';

const store = {};

@withService({ 
  onCall() {
    return fetch('https://my-service-api.io/api/v1/users/1')
  },
  onSuccsess(result, id) {
    store[id] = result;
  }
})
export default class Value extends Component {
  render() {
    const { serviceID } = this.props;
    return (
      <div>{store[serviceID]}</div>
    );
  }
}
```

Redux example component that fetches API
App.jsx
``` javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withService } from 'react-service';
import someReduxAction from '../redux/actions/someReduxAction';
const store = {};

@connect(({ user }) => ({ user }), { someReduxAction })
@withService({ 
  onCall({ someReduxAction }) {
    return someReduxAction(1);
  },
})
export default class Value extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>{user}</div>
    );
  }
}
```

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2017-2018 Ivan Zakharchenko


[downloads-image]: https://img.shields.io/npm/dm/react-service.svg
[npm-url]: https://www.npmjs.com/package/react-service
[npm-image]: https://img.shields.io/npm/v/react-service.svg

[travis-url]: https://travis-ci.org/3axap4eHko/react-service
[travis-image]: https://img.shields.io/travis/3axap4eHko/react-service/master.svg
