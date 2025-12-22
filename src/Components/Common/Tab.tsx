import React, { ReactNode } from 'react';

interface TabProps {
  children: ReactNode;
  name?: string;
  eventKey?: string;
}

const Tab: React.FC<TabProps> = ({ children }) => children as React.ReactElement;

export default Tab;
