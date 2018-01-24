import React, { Component } from 'react';
import traverse from '../traverse';

class TraverseTest extends Component {
  render() {
    return (
      <ul>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
        <li>item 4</li>
        <li>item 5</li>
        <li>item 6</li>
      </ul>
    );
  }
}

function TraverseStatelessTest() {
  return (
    <ul>
      <li>item 1</li>
      <li>item 2</li>
      <li>item 3</li>
      <li>item 4</li>
      <li>item 5</li>
      <li>item 6</li>
    </ul>
  );
}

function TraverseWrapperTest() {
  return (
    <div>
      <TraverseStatelessTest />
    </div>
  );
}

test('traverse class', done => {
  const context = {
    components: 0,
  };
  const root = (<TraverseTest />);

  traverse(root, context, (element, instance, context) => {
    context.components++;
    if (element.type === TraverseTest) {
      expect(element.props).toMatchObject({});
    } else if (element.type === 'ul') {
      expect(element.props.children.length).toBe(6);
    } else if (element.type === 'li') {
      expect(element.props.children).toMatch(/item \d/);
    }
    if (context.components === 8) {
      done();
    }
  });
});

test('traverse function', done => {
  const context = {
    components: 0,
  };
  const root = (<TraverseStatelessTest />);

  traverse(root, context, (element, instance, context) => {
    context.components++;
    if (element.type === TraverseTest) {
      expect(element.props).toMatchObject({});
    } else if (element.type === 'ul') {
      expect(element.props.children.length).toBe(6);
    } else if (element.type === 'li') {
      expect(element.props.children).toMatch(/item \d/);
    }
    if (context.components === 8) {
      done();
    }
  });
});

test('traverse function', done => {
  const root = (
    <span>
      <TraverseWrapperTest />
    </span>
  );

  const elements = ['span', 'TraverseWrapperTest', 'div', 'TraverseStatelessTest', 'ul', 'li', 'li', 'li', 'li', 'li', 'li', 'item 1', 'item 2', 'item 3', 'item 4', 'item 5', 'item 6'];

  traverse(root, {}, (element, instance, context) => {
    const name = element.type ? (element.type.name ? element.type.name : element.type) : element;
    const index = elements.indexOf(name);
    expect(index).not.toBe(-1);
    elements.splice(index, 1);
    if (element.type === TraverseTest) {
      expect(element.props).toMatchObject({});
    } else if (element.type === 'ul') {
      expect(element.props.children.length).toBe(6);
    } else if (element.type === 'li') {
      expect(element.props.children).toMatch(/item \d/);
    }
    if (elements.length === 0) {
      done();
    }
  });
});
