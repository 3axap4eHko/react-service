# React Service Component

React Service Component allows run services on client an server sides

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Usage

App.js
```javascript
import React, { Component } from 'react';
import withService from 'react-service';

const service: postId => fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
                            .then(response => response.json());

@withService(service, { mapParams: props => props.post })
export default class App extends Component {
  render() {
    const { data: { loading, result, error } } = this.props;
    if (loading && !result) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>{error}</div>;
    }
    return (
      <div>
        <h1>{result.title}</h1>
        <p>{result.body}</p>
      </div>
    );
  }
}
```

client.js
```javascript
import React from 'react';
import { hydrate } from 'react-dom';
import { importData } from 'react-service';
import App from './App.js';

// Restore service data
importData(window.__SERVICE_DATA__);

render(<App post={1} />, document.getElementById('app'));
```

server.js
```js
import 'isomorphic-unfetch';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Express from 'express';
import { exportData } from 'react-service';
import App from './App.js';

const PORT = process.env.NODE_PORT || 9090;

const app = Express();

app.get('*', async (req, res) => {
  try {
    const app = (<App post={1} />);
    const data = await fetchServices(app);
    const content = renderToString(app);
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
<div id="app">${content}</div>
<!-- Transfer data -->
<script>window.__SERVICE_DATA__ = ${exportData(data)}</script>
</body>
</html>
`;
    res.status(200).send(html);
  } catch (e) {
    console.error(e.stack);
    res.status(500).json(e.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server started http://localhost:${PORT}`);
});
```

## License
[The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2017-2018 Ivan Zakharchenko


[downloads-image]: https://img.shields.io/npm/dm/react-service.svg
[npm-url]: https://www.npmjs.com/package/react-service
[npm-image]: https://img.shields.io/npm/v/react-service.svg

[travis-url]: https://travis-ci.org/3axap4eHko/react-service
[travis-image]: https://img.shields.io/travis/3axap4eHko/react-service/master.svg
