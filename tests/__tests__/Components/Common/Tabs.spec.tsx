import React from 'react';
import { render } from '@testing-library/react';

import Tabs from './../../../../src/Components/Common/Tabs';
import Tab from './../../../../src/Components/Common/Tab';

describe('Tabs', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Tabs>
        <Tab
          key="foo"
          name="Foo"
          eventKey="foo"
        >
          <p>Foo Bar</p>
        </Tab>
      </Tabs>,
    );
    expect(container).toMatchSnapshot();
  });
});
