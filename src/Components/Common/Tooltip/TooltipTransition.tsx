import { OverlayContainer } from "@react-aria/overlays";
import React, { useState, ReactNode } from "react";
import { Transition } from "react-transition-group";

const OPEN_STATES: Record<string, boolean> = {
  entering: false,
  entered: true,
};

interface TooltipTransitionProps {
  children: ReactNode;
  isOpen: boolean;
}

export function TooltipTransition({
  children,
  isOpen,
}: TooltipTransitionProps) {
  const [exited, setExited] = useState(!isOpen);

  const handleEntered = () => setExited(false);
  const handleExited = () => setExited(true);

  // Don't un-render the overlay while it's transitioning out.
  const mountOverlay = isOpen || !exited;
  if (!mountOverlay) {
    // Don't bother showing anything if we don't have to.
    return null;
  }

  return (
    <Transition
      appear
      in={isOpen}
      onEntered={handleEntered}
      onExited={handleExited}
      timeout={{
        enter: 50,
        exit: 350,
      }}
    >
      {(state) =>
        React.Children.map(children, (child) => (
          <OverlayContainer>
            {React.isValidElement(child) &&
              React.cloneElement(child, { isOpen: !!OPEN_STATES[state] })}
          </OverlayContainer>
        ))
      }
    </Transition>
  );
}
