import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, MailtoLink } from '@edx/paragon';

import { hooks as appHooks } from 'data/redux';
import { useFormatDate } from 'utils/hooks';

import Banner from 'components/Banner';
import messages from './messages';

export const EntitlementBanner = ({ cardId }) => {
  const {
    isEntitlement,
    hasSessions,
    isFulfilled,
    changeDeadline,
    showExpirationWarning,
    isExpired,
  } = appHooks.useCardEntitlementData(cardId);
  const { supportEmail } = appHooks.usePlatformSettingsData();
  const openSessionModal = appHooks.useUpdateSelectSessionModalCallback(cardId);
  const { formatMessage } = useIntl();
  const formatDate = useFormatDate();

  if (!isEntitlement) {
    return null;
  }

  if (!hasSessions && !isFulfilled) {
    return (
      <Banner variant="warning">
        {formatMessage(messages.entitlementUnavailable, {
          emailLink: supportEmail && <MailtoLink to={supportEmail}>{supportEmail}</MailtoLink>,
        })}
      </Banner>
    );
  }
  if (showExpirationWarning) {
    return (
      <Banner>
        {formatMessage(messages.entitlementExpiringSoon, {
          changeDeadline: formatDate(changeDeadline),
          selectSessionButton: (
            <Button variant="link" size="inline" className="m-0 p-0" onClick={openSessionModal}>
              {formatMessage(messages.selectSession)}
            </Button>
          ),
        })}
      </Banner>
    );
  }
  if (isExpired) {
    return (
      <Banner>
        {formatMessage(messages.entitlementExpired)}
      </Banner>
    );
  }
  return null;
};
EntitlementBanner.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default EntitlementBanner;
