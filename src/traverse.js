import { Children } from 'react';

function isFunction(value) {
  return typeof value === 'function';
}

function isClassComponent(Component) {
  return Component && Component.prototype && Component.prototype.render;
}

export function getName(element) {
  return element.type ? (element.type.name ? element.type.name : element.type) : element;
}

function renderComponent(Component, props, context) {
  const instance = new Component(props, context);
  instance.props = instance.props || props;
  instance.context = instance.context || context;
  instance.state = instance.state || null;

  if (Component.getDerivedStateFromProps) {
    const state = Component.getDerivedStateFromProps(instance.props, instance.state);
    if (state !== null) {
      instance.state = state;
    }
  }

  instance.setState = function (updater, callback) {
    if (typeof updater === 'function') {
      instance.state = { ...instance.state, ...updater(instance.state, instance.props, instance.context) };
    } else {
      instance.state = { ...instance.state, ...updater };
    }
    if (typeof callback === 'function') {
      callback();
    }
  };

  if (instance.componentWillMount) {
    console.warn(`support componentWillMount is deprecated`);
    instance.componentWillMount();
  }
  const childContext = instance.getChildContext ? { ...context, ...instance.getChildContext() } : { ...context };
  return {
    instance,
    childContext,
    props: instance.props,
  };
}

function getInstance(element, context) {
  const props = { ...(element.type || {}).defaultProps, ...element.props };
  if (isClassComponent(element.type)) {
    return renderComponent(element.type, props, context);
  } else {
    return {
      instance: null,
      childContext: context,
      props,
    };
  }
}

export default function traverse(root, context, callback) {
  const { instance, childContext, props } = getInstance(root, context);
  if (callback(root, instance, context) === false) {
    return;
  }
  const Component = root.type;
  const rendered = instance ? instance.render() : (isFunction(Component) ? Component(props, context) : null);
  if (rendered) {
    traverse(rendered, childContext, callback);
  } else {
    if (root.props && root.props.children) {
      Children.forEach(root.props.children, child => {
        if (child) {
          traverse(child, context, callback);
        }
      });
    }
  }
}
