import React, { Component as ReactComponent } from 'react';

export function provider(serviceOptions) {

  return Component => {

    class ServiceProvider extends ReactComponent {

      componentWillMount() {

        const {
                service     = () => {throw new Error('service is not defined');},
                interval    = 0,
                params      = {},
                cancelToken = () => {},
                onSuccess   = () => null,
                onError     = e => console.error(e),
              } = typeof serviceOptions === 'function' ? serviceOptions(this.props) : serviceOptions;

        const callback = () => new Promise(resolve => resolve(service(params)))
          .then(onSuccess)
          .catch(onError);

        callback();

        const timerId = interval ? setInterval(callback, interval) : 0;
        this.cancelToken = () => clearInterval(timerId);
        cancelToken(this.cancelToken);
      }

      componentWillUnmount() {
        this.cancelToken();
      }

      render() {
        return (<Component {...this.props} />);
      }
    }

    ServiceProvider.displayName = `ServiceProvider(${Component.displayName || Component.name})`;
    ServiceProvider.WrappedComponent = Component;

    return ServiceProvider;
  };
}
