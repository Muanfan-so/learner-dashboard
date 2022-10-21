import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Image } from '@edx/paragon';

import messages from './messages';

export const GreetingBanner = ({ size }) => {
  const { formatMessage } = useIntl();

  let greetMessage;
  const hour = new Date().getHours();

  if (hour > 16) {
    greetMessage = messages.goodEvening;
  } else if (hour > 11) {
    greetMessage = messages.goodAfternoon;
  } else {
    greetMessage = messages.goodMorning;
  }

  const isSmall = size === 'small';

  return (
    <div
      className={classNames(
        'd-flex align-items-center justify-content-center',
        { 'pb-5': !isSmall, 'p-3.5': isSmall },
      )}
    >
      <a href={`${getConfig().LMS_BASE_URL}/dashboard`}>
        <Image
          style={{ width: isSmall ? '46px' : '148px' }}
          className="d-block"
          src={getConfig().LOGO_WHITE_URL}
          alt={getConfig().SITE_NAME}
        />
      </a>
      <div className={`greetings-slash-container-${size} bg-brand-500`} />
      {isSmall
        ? (
          <h5 role="presentation" className="text-center text-accent-b">
            {formatMessage(greetMessage)}
          </h5>
        ) : (
          <h1
            role="presentation"
            className="text-center text-accent-b display-1"
          >
            {formatMessage(greetMessage)}
          </h1>
        )}
    </div>
  );
};
GreetingBanner.propTypes = {
  size: PropTypes.oneOf(['small', 'large']).isRequired,
};

export default GreetingBanner;
