import React, { Component as ReactComponent } from 'react';
import traverse from './traverse';

const SERVICE_FN = 'callService';

const options = {
  SSR: false,
};

function randNumber(min, max) {
  return min + Math.round(Math.random() * (max - min));
}

const s = {
  get a() {
    return randNumber(0x1000, 0x1FFF).toString(16);
  },
  get b() {
    return `0000${Date.now().toString(16)}`.slice(-12);
  },
};

function uuid() {
  return `${s.a}${s.a}-${s.a}-${s.a}-${s.a}-${s.b}`;
}

function getServices(root, context, skipRoot) {
  let services = [];
  traverse(root, context, (element, instance, context) => {
    if (skipRoot && root === element) {
      return;
    }
    if (instance && typeof instance[SERVICE_FN] === 'function') {
      services.push({
        service: instance[SERVICE_FN](),
        element,
        context,
      });
      return false;
    }
  });

  return services;
}

function recursiveTraverse(root, rootContext, skipRoot) {
  const services = getServices(root, rootContext, skipRoot);
  if (services.length === 0) {
    return Promise.resolve();
  }
  const errors = [];
  const results = services.map(({ service, element, context }) => service
    .then(() => recursiveTraverse(element, context, true))
    .catch(e => errors.push(e)),
  );

  return Promise.all(results)
    .then(() => {
      if (errors.length) {
        console.error(errors[0].stack);
      }
    });
}

export function setOptions(customOptions) {
  Object.assign(options, customOptions);
}

export function fetchServices(root) {
  return recursiveTraverse(root, {}, false);
}

export function withService(serviceOptions) {

  const serviceContext = {
    fetched: false,
    initialized: false,
    serviceID: uuid(),
  };

  return Component => {

    if (serviceContext.initialized) {
      throw new Error(`withService can be used once per component`);
    }
    serviceContext.initialized = true;

    const componentName = Component.displayName || Component.name;

    const {
            onCall       = () => {throw new Error(`onCall is not defined in ${componentName}`);},
            onSuccess    = () => null,
            onError      = e => console.error(e) || null,
            interval     = null,
            contextTypes = {},
          } = serviceOptions || {};

    return class ServiceConnector extends ReactComponent {

      static displayName = `ServiceConnector(${componentName})`;
      static WrappedComponent = Component;

      static contextTypes = {
        ...contextTypes,
      };

      cancel = () => {};
      unmounted = false;

      [SERVICE_FN] = () => {
        this.cancel();
        let canceled = false;
        this.cancel = () => canceled = true;
        return Promise.resolve(onCall(this.props, this.context))
          .then(result => {
            if (canceled || this.unmounted) {
              return;
            }
            serviceContext.fetched = true;
            return onSuccess(result, serviceContext.serviceID, this.props, this.context);
          })
          .catch(error => {
            console.error(error);
            return onError(this.props, this.context);
          });
      };

      callServiceInterval = doCall => {
        if (interval !== null && !this.unmounted) {
          Promise.resolve(doCall ? this[SERVICE_FN](this.props) : null)
            .then(() => setTimeout(this.callServiceInterval, interval, true));
        }
      };

      componentWillMount() {
        if (!options.SSR) {
          this[SERVICE_FN](this.props);
        }
      }

      componentDidMount() {
        this.callServiceInterval();
      }

      componentWillUnmount() {
        this.unmounted = true;
      }

      render() {
        if (!serviceContext.fetched) {
          return null;
        }
        return (<Component {...this.props} serviceID={serviceContext.serviceID} />);
      }
    };
  };
}
