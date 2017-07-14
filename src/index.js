import React, { Component as ReactComponent } from 'react';

export function withService(serviceOptions) {

  return Component => {

    const componentName = Component.displayName || Component.name;

    return class ServiceProvider extends ReactComponent {

      static displayName = `ServiceProvider(${componentName})`;
      static WrappedComponent = Component;

      state = {
        props: {},
      };

      componentWillMount() {

        const {
                service     = () => {throw new Error(`service is not defined in ${displayName}`);},
                mapToProps  = () => ({}),
                interval    = null,
                onSuccess   = () => null,
                onError     = e => console.error(e) || null,
                cancelToken = () => {},
              } = typeof serviceOptions === 'function' ? { service: serviceOptions } : (serviceOptions || {});

        const callback = () => new Promise(resolve => resolve(service(this.props)))
          .then(result => {
            if (typeof mapToProps === 'function' && !this.canceled) {
              this.setState({ props: mapToProps(result) });
            }
            onSuccess(result);
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
        return (<Component {...this.props} {...this.state.props} />);
      }
    };
  };
}
