# React Service Provider Component

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Usage

// User.jsx
``` javascript
import React, { Component } from 'react';
import { provider } from 'react-service';

function User({ username, money }) {
    return (
        <div>{username}: {money}<div/>
    );
}

function providerMapper(props) {
    return {
        service: props.service,
        interval: 1000,
        params: {
            id: props.userId,
        }
    }
}

export default provider(providerMapper)(User);

```
App.jsx
``` javascript
import React, { Component } from 'react';
import User from './User';

class App extends Component {
    state = { money: 0 };

    service = ({ id }) => {
        return ajax(`https://example.com/api/v1/user/${id}/balance`)
            .then(money => this.setState({ money }) );
    };

    render() {
        return <User money={this.state.money} service={this.service} />
    }
}

```

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2017 Ivan Zakharchenko


[downloads-image]: https://img.shields.io/npm/dm/react-service.svg
[npm-url]: https://www.npmjs.com/package/react-service
[npm-image]: https://img.shields.io/npm/v/react-service.svg

[travis-url]: https://travis-ci.org/3axap4eHko/react-service
[travis-image]: https://img.shields.io/travis/3axap4eHko/react-service/master.svg
