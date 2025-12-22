import React, { ReactNode } from "react";

interface TabProps {
  children: ReactNode;
  name?: string;
  eventKey?: string;
}

export function Tab({ children }: TabProps) {
  return children as React.ReactElement;
}
