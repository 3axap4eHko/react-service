import React, { Children } from 'react';

function isFunction(value) {
  return typeof value === 'function';
}

function isClassComponent(component) {
  return isFunction(component) && 'render' in component.prototype;
}

function renderComponent(Component, props, context) {
  const instance = new Component(props, context);
  instance.props = instance.props || props;
  instance.context = instance.context || context;

  instance.setState = (updater, callback) => {
    if (typeof updater === 'function') {
      instance.state = { ...instance.state, ...updater(instance.state, instance.props) };
    } else {
      instance.state = { ...instance.state, ...updater(instance.state, instance.props) };
    }

    callback();
  };
  if (instance.componentWillMount) {
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
  if (isClassComponent(element.type)) {
    const props = { ...element.type.defaultProps, ...element.props };
    return renderComponent(element.type, props, context);
  } else {
    return {
      instance: null,
      childContext: context,
      props: {},
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
