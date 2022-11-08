import React from 'react';

import { StrictDict } from 'utils';
import { RequestStates } from 'data/constants/requests';

import * as module from './hooks';
import api from './api';

export const state = StrictDict({
  requestState: (val) => React.useState(val), // eslint-disable-line
  data: (val) => React.useState(val), // eslint-disable-line
});

export const useFetchCourses = (setRequestState, setData) => {
  React.useEffect(() => {
    let isMounted = true;
    api.fetchRecommendedCourses().then((response) => {
      if (isMounted) {
        setRequestState(RequestStates.completed);
        setData(response);
      }
    }).catch(() => {
      if (isMounted) {
        setRequestState(RequestStates.failed);
      }
    });
    return () => { isMounted = false; };
    /* eslint-disable */
  }, []);
};

export const useRecommendationPanelData = () => {
  const [requestState, setRequestState] = module.state.requestState(RequestStates.pending);
  const [data, setData] = module.state.data({});
  module.useFetchCourses(setRequestState, setData);
  const courses = data.data?.courses || [];
  return {
    courses,
    isLoaded: requestState === RequestStates.completed && courses.length > 0,
    isFailed: requestState === RequestStates.failed
      || (requestState === RequestStates.completed && courses.length === 0),
    isLoading: requestState === RequestStates.pending,
  };
};

export default {
  useRecommendationPanelData,
};
