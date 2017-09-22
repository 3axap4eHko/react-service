import React, { Component } from 'react';
import TestComponent from './fixtures/TestComponent';
import traverse from '../src/traverse';

describe('Traverse test suite', () => {

  it('Should call componentWillMount once and render it after', done => {
    const state = {
      willMount: 0
    };
    const root = (<TestComponent
      value={1}
      onComponentWillMount={() => state.willMount++}
      onRender={() => {
        expect(state.willMount).equal(1);
        done();
      }}
    />);

    traverse(root, context, (element, instance, context) => {});
    done();
  });

  it('should traverse all 3 components', done => {
    const root = (<TestComponent value={1}/>);

    let traverseCount = 0;
    traverse(root, context, (element, instance) => traverseCount++);
    expect(traverseCount).equal(3);
    done();
  });

  it('should traverse all 5 components', done => {
    const root = (
      <div>
        <span>
          <TestComponent value={1}/>
        </span>
      </div>
    );

    let traverseCount = 0;
    traverse(root, context, () => traverseCount++);
    expect(traverseCount).equal(5);
    done();
  })
});