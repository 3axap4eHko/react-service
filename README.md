# React Service Provider Component

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Usage

### Internally serviced component

User.jsx
``` javascript
import React, { Component } from 'react';
import { provider } from 'react-service';

function User({ username, money }) {
    return (
        <div>{username}: {money}<div/>
    );
}

function providerOptions(props) {
    return {
        service: ({ id }) => ajax(`https://example.com/api/v1/user/${id}/balance`).then(money => ({ money }) ),
        interval: 1000,
        params: {
            id: props.userId,
        }
    }
}

export default provider(providerOptions)(User);
```

### Externally serviced component

User.jsx
``` javascript
import React, { Component } from 'react';
import { provider } from 'react-service';

function User({ username, money }) {
    return (
        <div>{username}: {money}<div/>
    );
}

function providerOptions(props) {
    return {
        service: props.service,
        interval: 1000,
        params: {
            id: props.userId,
        }
    }
}

export default provider(providerOptions)(User);

```

Usage in a simple application
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

export default App;

```

Usage in a redux application
``` javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import User from './User';
import { loadMoneyAction } from './redux/actions';

class App extends Component {
    render() {
        const { userMoney, loadMoneyAction } = this.props;
        return <User money={userMoney} service={loadMoneyAction} />
    }
}

function mapStateToProps({ userMoney }) {
    return { userMoney };
}

const mapDispatchToProps = {
    loadMoneyAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

```

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2017 Ivan Zakharchenko


[downloads-image]: https://img.shields.io/npm/dm/react-service.svg
[npm-url]: https://www.npmjs.com/package/react-service
[npm-image]: https://img.shields.io/npm/v/react-service.svg

[travis-url]: https://travis-ci.org/3axap4eHko/react-service
[travis-image]: https://img.shields.io/travis/3axap4eHko/react-service/master.svg
