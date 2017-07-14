# React Service Provider Component

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Usage

### Internally serviced component
User.jsx
``` javascript
import React, { Component } from 'react';
import { number, string, func } from 'prop-types';
import { withService } from 'react-service';

function User({ username, balance }) {
    return (
        <div>{username}: {balance}<div/>
    );
}

User.propTypes = {
    username: string.isRequired,
    balance: number.isRequired,
};

const providerOptions = {
    service: props => ajax(`https://example.com/api/v1/user/${props.id}/balance`),
    mapToProps: balance => ({ balance }),
    interval: 1000,
};

export default provider(providerOptions)(User);
```

### Externally serviced component
User.jsx
``` javascript
import React, { Component } from 'react';
import { func } from 'prop-types';
import { withService } from 'react-service';

function User({ username, balance }) {
    return (
        <div>{username}: {balance}<div/>
    );
}

User.propTypes = {
    username: string.isRequired,
    balance: number.isRequired,
    service: func.isRequired,
};

const providerOptions = {
    service: props => props.service(),
    interval: 1000,
}

export default provider(providerOptions)(User);

```

#### Usage in a simple application
``` javascript
import React, { Component } from 'react';
import User from './User';

class App extends Component {
    state = { balance: 0 };

    service = ({ id }) => {
        return ajax(`https://example.com/api/v1/user/${id}/balance`)
            .then(money => this.setState({ balance }) );
    };

    render() {
        return <User balance={this.state.balance} service={this.service} />
    }
}

export default App;

```

#### Usage in a redux application
``` javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import User from './User';
import { loadBalanceAction } from './redux/actions';

class App extends Component {
    render() {
        const { balance, loadBalanceAction } = this.props;
        return <User balance={balance} service={loadBalanceAction} />
    }
}

function mapStateToProps({ balance }) {
    return { balance };
}

const mapDispatchToProps = {
    loadBalanceAction,
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
