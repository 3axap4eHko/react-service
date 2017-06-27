import React, { Component as ReactComponent } from 'react';

export function provider(serviceOptions) {

  return Component => {

    class ServiceProvider extends ReactComponent {

      state = {
        extraProps: {},
      };

      componentWillMount() {

        const {
                service     = () => {throw new Error('service is not defined in ServiceProvider');},
                interval    = null,
                params,
                onSuccess   = () => null,
                onError     = e => console.error(e),
                cancelToken = () => {},
              } = typeof serviceOptions === 'function' ? serviceOptions(this.props) : serviceOptions;

        const callback = () => new Promise(resolve => resolve(service(params)))
          .then(extraProps => {
            if (extraProps && !this.canceled) {
              switch(typeof extraProps) {
                case 'function':
                  this.setState({ extraProps: extraProps(this.props) });
                  break;
                case 'object':
                  this.setState({ extraProps });
                  break;
              }
            }
            onSuccess(extraProps);
          })
          .catch(onError);

        callback();

        const timerId = interval === null ? 0 : setInterval(callback, interval);
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
        const { extraProps } = this.state;
        return (<Component {...this.props} {...extraProps} />);
      }
    }

    ServiceProvider.displayName = `ServiceProvider(${Component.displayName || Component.name})`;
    ServiceProvider.WrappedComponent = Component;

    return ServiceProvider;
  };
}
