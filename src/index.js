import React, { Component } from 'react';
import { any, func, object, string } from 'prop-types';
import traverseElement from './traverse';
import { createPool, getHash } from './utils';

const IS_BROWSER = (function () { try {return this === window;} catch (e) { return false;} })();

function getServices(root, context, skipRoot) {
  let services = [];
  traverseElement(root, context, (element, instance, context) => {
    if (skipRoot && root === element) {
      return;
    }
    if (instance && typeof instance.fetchService === 'function') {
      services.push({
        service: instance.fetchService,
        element,
        context,
      });
      return false;
    }
  });
  return services;
}

function mapServiceToElement({ element, context }) {
  return { element, context, skipRoot: true };
}

async function traverse(elementPool, data) {
  const { element, context, skipRoot } = elementPool.value;
  const services = getServices(element, context, skipRoot);
  if (services.length !== 0) {
    elementPool.push(...services.map(mapServiceToElement));
    await Promise.all(services.map(({ service }) => service(data, null)));
  }
}

export async function fetchServices(element) {
  const data = {};
  const elementPool = createPool({ element, context: {}, skipRoot: false });
  while (!elementPool.done) {
    await traverse(elementPool, data);
    elementPool.next();
  }
  return data;
}

let counter = 0;

class Service extends Component {
  static data = {};
  static propTypes = {
    name: string.isRequired,
    service: func.isRequired,
    children: func.isRequired,
    params: object,
    force: any,
  };

  static defaultProps = {
    force: null,
  };

  static getDerivedStateFromProps(props) {
    const hashId = getHash(props);
    if (hashId in Service.data) {
      return { hashId, result: Service.data[hashId], loading: false, error: null };
    }
    return null;
  }

  state = {};
  unmounted = false;

  setStateAsync = state => {
    if (!this.unmounted) {
      return new Promise(r => this.setState(state, r));
    }
  };

  fetchService = async (data, prevForce) => {
    const { name, service, params, force } = this.props;
    const hashId = getHash(this.props);
    if (this.state.hashId !== hashId || prevForce !== force) {
      await this.setStateAsync({ loading: true });
      try {
        const result = await service(params, name, hashId);
        data[hashId] = result;
        await this.setStateAsync({ hashId, result, loading: false, error: null });
      } catch (error) {
        await this.setStateAsync({ hashId, result: null, loading: false, error });
      }
    }
  };

  componentDidMount() {
    this.fetchService(Service.data, this.props.force);
  }

  componentDidUpdate(prevProps) {
    this.fetchService(Service.data, prevProps.force);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const { children } = this.props;
    const { hashId, ...data } = this.state;

    return children(data, hashId);
  }
}

export default function withService(service, options) {
  const { mapParams = () => ({}) } = options || {};

  const index = counter++;
  const name = `${index}-service`;

  return WrappedComponent => {

    const componentName = WrappedComponent.displayName || WrappedComponent.name;

    return class ServiceConnector extends Component {

      static displayName = `ServiceConnector-${name}(${componentName})`;
      static WrappedComponent = WrappedComponent;

      render() {
        const params = mapParams(this.props, name);

        return (
          <Service name={name} service={service} params={params}>
            {data => <WrappedComponent {...this.props} data={data} />}
          </Service>
        );
      }
    };
  };
}

export function exportData(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function importData(data) {
  if (!IS_BROWSER) {
    console.warn('importData recommended client-side only');
  }
  Service.data = data;
}

