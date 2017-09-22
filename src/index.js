import React, { Component as ReactComponent } from 'react';
import { renderToString } from 'react-dom/server';
import { array, bool } from 'prop-types';
import traverse from './traverse';

const _service = Symbol;
const _fetchFlag = Symbol;

function getServices(root, context, skipRoot) {
  let services = [];
  traverse(root, context, (element, instance, context) => {
    if (skipRoot && root === element) {
      return;
    }
    if (instance && instance[_service] instanceof Promise) {
      services.push({
        service: instance[_service],
        element,
        context,
      });
      return false;
    }
  });
  return services;
}

function recursiveFetch(root, rootContext, skipRoot) {
  const services = getServices(root, rootContext, skipRoot);
  if (services.length === 0) {
    return Promise.resolve();
  }
  const errors = [];

  const results = services.map(({ service, element, context }) => service
    .then(() => recursiveFetch(element, context, true))
    .catch(e => errors.push(e)),
  );

  return Promise.all(results)
    .then(() => {
      if (errors.length) {
        console.error(errors[0].stack);
      }
    });
}

export function fetch(root) {
  return recursiveFetch(root, { [_fetchFlag]: true }, false);
}

export function render(element) {
  return fetch(element).then(() => renderToString(element));
}

export function withService(serviceOptions) {

  return Component => {

    const componentName = Component.displayName || Component.name;

    const {
            service     = () => {throw new Error(`service is not defined in ${componentName}`);},
            interval    = null,
            cancelToken = () => {},
            onSuccess   = () => null,
            onError     = e => console.error(e) || null,
          } = typeof serviceOptions === 'function' ? { service: serviceOptions } : (serviceOptions || {});

    const executor = instance => {
      instance[_service] = Promise.resolve(service(instance.props, instance.state, instance.context))
        .then(onSuccess)
        .catch(onError);
    };

    return class ServiceConnector extends ReactComponent {

      static displayName = `ServiceProvider(${componentName})`;
      static WrappedComponent = Component;

      static contextTypes = {
        [_fetchFlag]: bool,
      };

      componentWillMount() {
        executor(this);
      }

      componentDidMount() {
        if (this.context[_fetchFlag]) {
          return;
        }

        const timerId = interval === null ? 0 : setInterval(executor, interval, this);
        this.cancelToken = () => {
          this.canceled = true;
          clearInterval(timerId);
        };
        cancelToken(this.cancelToken);
      }

      componentWillUnmount() {
        this.cancelToken();
      }

      render() {
        return (<Component {...this.props} />);
      }
    };
  };
}
