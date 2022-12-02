import React from 'react';

import { StrictDict } from 'utils';
import { hooks as appHooks, thunkActions } from 'data/redux';
import track from 'tracking';

import { useUnenrollReasons } from './reasons';
import * as module from '.';

export const state = StrictDict({
  confirmed: (val) => React.useState(val), // eslint-disable-line
});

export const modalStates = StrictDict({
  confirm: 'confirm',
  reason: 'reason',
  finished: 'finished',
});

export const useUnenrollData = ({ closeModal, dispatch, cardId }) => {
  const [isConfirmed, setIsConfirmed] = module.state.confirmed(false);
  const confirm = () => setIsConfirmed(true);
  const reason = useUnenrollReasons({ dispatch, cardId });
  const { isEntitlement } = appHooks.useCardEntitlementData(cardId);
  const handleTrackReasons = appHooks.useTrackCourseEvent(
    track.engagement.unenrollReason,
    cardId,
    reason.submittedReason,
    isEntitlement,
  );

  let modalState;
  if (isConfirmed) {
    modalState = reason.isSubmitted ? modalStates.finished : modalStates.reason;
  } else {
    modalState = modalStates.confirm;
  }

  const handleSubmitReason = () => {
    handleTrackReasons();
    dispatch(thunkActions.app.unenrollFromCourse(cardId, reason.submittedReason));
  };

  const close = () => {
    closeModal();
    setIsConfirmed(false);
    reason.clear();
  };
  const closeAndRefresh = () => {
    dispatch(thunkActions.app.refreshList());
    close();
  };

  return {
    isConfirmed,
    confirm,
    reason,
    close,
    closeAndRefresh,
    modalState,
    handleSubmitReason,
  };
};

export default useUnenrollData;
