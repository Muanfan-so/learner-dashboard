import React from 'react';

import ProductRecommendations from 'widgets/ProductRecommendations';
// import hooks from 'widgets/ProductRecommendations/hooks';

// eslint-disable-next-line arrow-body-style
export const WidgetFooter = () => {
  // hooks.useActivateRecommendationsExperiment();
  // const { inRecommendationsVariant, isExperimentActive } = hooks.useShowRecommendationsFooter();

  // if (inRecommendationsVariant && isExperimentActive) {
  return (
    <div className="widget-footer">
      <ProductRecommendations />
    </div>
  );
  // }

  // return null;
};

export default WidgetFooter;
