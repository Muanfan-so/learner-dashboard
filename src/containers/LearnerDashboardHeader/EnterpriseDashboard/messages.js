import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  dashboard: {
    id: 'leanerDashboard.menu.dashboard.label',
    defaultMessage: 'Dashboard',
    description: 'The text for the user menu Dashboard navigation link.',
  },
  enterpriseDialogHeader: {
    id: 'leanerDashboard.enterpriseDialogHeader',
    defaultMessage: 'You have access to the {label} dashboard',
    description: 'title for enterpise dashboard dialog',
  },
  enterpriseDialogBody: {
    id: 'leanerDashboard.enterpriseDialogBody',
    defaultMessage: 'To access the coureses available to you through {label}, visit the {label} dashboard now.',
    description: 'Body text for enterpise dashboard dialog',
  },
  enterpriseDialogDismissButton: {
    id: 'leanerDashboard.enterpriseDialogDismissButton',
    defaultMessage: 'Dismiss',
    description: 'Dismiss button to cancel visiting dashboard',
  },
  enterpriseDialogConfirmButton: {
    id: 'leanerDashboard.enterpriseDialogConfirmButton',
    defaultMessage: 'Go To Dashboard',
    description: 'Confirm button to go to the dashboard url',
  },
});

export default messages;
