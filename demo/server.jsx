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
<script>window.__INITIAL_STATE__ = $
  {JSON.stringify(store.getState()).replace(/</g, '\\\u003c')}
</script>
</body>
</html>`,
  );
});

app.listen(9090, () => {
  console.log(`Served from http://localhost:${9090}`); // eslint-disable-line no-console
});
