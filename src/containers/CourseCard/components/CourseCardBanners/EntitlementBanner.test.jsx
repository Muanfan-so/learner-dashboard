import React from 'react';
import { shallow } from 'enzyme';
import { useDispatch } from 'react-redux';

import { hooks as appHooks } from 'data/redux';
import EntitlementBanner from './EntitlementBanner';

jest.mock('components/Banner', () => 'Banner');
jest.mock('data/redux', () => ({
  hooks: {
    usePlatformSettingsData: jest.fn(),
    useCardEntitlementData: jest.fn(),
    useUpdateSelectSessionModalCallback: jest.fn(
      (_, cardId) => jest.fn().mockName(`updateSelectSessionModalCallback(${cardId})`),
    ),
  },
}));

const cardId = 'my-test-course-number';

let el;

const entitlementData = {
  isEntitlement: true,
  hasSessions: true,
  isFulfilled: false,
  changeDeadline: '11/11/2022',
  showExpirationWarning: false,
};
const platformData = { supportEmail: 'test-support-email' };

const render = (overrides = {}) => {
  const { entitlement = {} } = overrides;
  appHooks.useCardEntitlementData.mockReturnValueOnce({ ...entitlementData, ...entitlement });
  appHooks.usePlatformSettingsData.mockReturnValueOnce(platformData);
  el = shallow(<EntitlementBanner cardId={cardId} />);
};

const dispatch = useDispatch();

describe('EntitlementBanner', () => {
  test('initializes data with course number from entitlement', () => {
    render();
    expect(appHooks.useCardEntitlementData).toHaveBeenCalledWith(cardId);
    expect(appHooks.useUpdateSelectSessionModalCallback).toHaveBeenCalledWith(dispatch, cardId);
  });
  test('no display if not an entitlement', () => {
    render({ entitlement: { isEntitlement: false } });
    expect(el.isEmptyRender()).toEqual(true);
  });
  test('snapshot: no sessions available', () => {
    render({ entitlement: { isFulfilled: false, hasSessions: false } });
    expect(el).toMatchSnapshot();
  });
  test('snapshot: expiration warning', () => {
    render({ entitlement: { showExpirationWarning: true } });
    expect(el).toMatchSnapshot();
  });
  test('no display if sessions available and not displaying warning', () => {
    render();
    expect(el.isEmptyRender()).toEqual(true);
  });
});
