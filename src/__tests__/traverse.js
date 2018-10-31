import React, { Component, createContext } from 'react';
import traverse from '../traverse';

function ChildAsAFunction({ children }) {
  return children();
}

class TraverseTest extends Component {
  render() {
    return (
      <ul>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
        <li>item 4</li>
        <li>item 5</li>
        <ChildAsAFunction>
          {() => <li>item 6</li>}
        </ChildAsAFunction>
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
      <ChildAsAFunction>
        {() => <li>item 6</li>}
      </ChildAsAFunction>
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

const Context = createContext({});

function TraverseContextTest() {
  return (
    <Context.Consumer>
      {value => <div>{value.a}</div>}
    </Context.Consumer>
  );
}

test('traverse class', () => {
  const root = (<TraverseTest />);

  const tags = {
    root: 0,
    ul: 0,
    li: 0,
  };

  traverse(root, {}, (element) => {
    if (element.type === TraverseTest) {
      tags.root++;
      expect(element.props).toMatchObject({});
    } else if (element.type === 'ul') {
      tags.ul++;
      expect(element.props.children.length).toBe(6);
    } else if (element.type === 'li') {
      tags.li++;
      expect(element.props.children).toMatch(/item \d/);
    }
  });

  expect(tags.root).toEqual(1);
  expect(tags.ul).toEqual(1);
  expect(tags.li).toEqual(6);
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

test('traverse wrapped', done => {
  const root = (
    <span>
      <TraverseWrapperTest />
    </span>
  );

  const elements = ['span', 'TraverseWrapperTest', 'div', 'TraverseStatelessTest', 'ul', 'li', 'li', 'li', 'li', 'li', 'li', 'item 1', 'item 2', 'item 3', 'item 4', 'item 5', 'item 6', 'ChildAsAFunction'];

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

test('traverse context', done => {

  const root = (
    <Context.Provider value={{ a: 1 }}>
      <Context.Consumer>
        {value => <div>{value.a}</div>}
      </Context.Consumer>
    </Context.Provider>
  );

  let counter = 0;
  traverse(root, {}, (element, instance, context) => {
    counter++;
  });
  expect(counter).toBe(4);
  done();
});