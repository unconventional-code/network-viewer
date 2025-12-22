import React, { useContext, Dispatch } from 'react';
import { Map } from 'immutable';

import { actionsWrapper } from './../../utils';
import * as actions from './actions';

type NetworkState = Map<string, any>;
type NetworkAction = any;
type NetworkCallbacks = {
  onPause?: (() => void) | null;
  onResume?: (() => void) | null;
  onReset?: (() => void) | null;
  onRequestSelect?: ((request: any) => void) | null;
};

type NetworkContextValue = [NetworkState, Dispatch<NetworkAction>, NetworkCallbacks];

export const NetworkContext = React.createContext<NetworkContextValue | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  const [state, dispatch, callbacks] = context;

  const wrappedActions = actionsWrapper({
    fetchFile: actions.fetchFile,
    updateData: actions.updateData,
    updateSearch: actions.updateSearch,
    updateSort: actions.updateSort,
    updateStatusFilter: actions.updateStatusFilter,
    updateTypeFilter: actions.updateTypeFilter,
    updateErrorMessage: actions.updateErrorMessage,
    selectRequest: actions.selectRequest,
    setTableHeaderWidth: actions.setTableHeaderWidth,
    updateScrollToIndex: actions.updateScrollToIndex,
    resetState: actions.resetState,
  })(dispatch, state);

  return {
    state,
    dispatch,
    actions: wrappedActions,
    callbacks,
  };
};
