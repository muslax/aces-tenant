
export const API = {
  GET: {
    USERS:              'get-users',
    LICENSE:            'get-license',
    CLIENTS:            'get-clients',
    PROJECT:            'get-project',
    PROJECTS:           'get-projects',
    BATCH:              'get-batch',
    BATCHES:            'get-batches',
    MODULES:            'get-modules',

    BATCH_GROUPS:       'get-batch-groups',
    BATCH_PERSONAE:     'get-batch-personae',
    PROJECT_PERSONAE:   'get-project-personae',

    USERNAMES:          'get-usernames',
    GUESTS:             'get-guests',
  },
  POST: {
    NEW_USER:               'new-user',
    DISABLE_USER:           'disable-user',
    ACTIVATE_USER:          'activate-user',
    DELETE_USER:            'delete-user',
    RESET_USER:             'reset-user',
    CHANGE_PASSWORD:        'change-password',

    SAVE_PROJECT:           'save-project',
    SAVE_CLIENT_PROJECT:    'save-client-project',
    CHANGE_PROJECT_ADMIN:   'change-project-admin',
    UPDATE_PROJECT:         'update-project',

    SAVE_NEW_BATCH:         'save-new-batch',
    SAVE_TEST_MODE:         'save-test-mode',
    UPDATE_BATCH:           'update-batch',
    DELETE_BATCH:           'delete-batch',
    SAVE_MODULES:           'save-modules',

    SAVE_CSV_DATA:          'save-csv-data',
    ADD_NAMES:              'add-names',
    SAVE_DEPLOYMENT:        'save-deployment',
    UPDATE_PERSONA:         'update-persona',
    DELETE_PERSONA:         'delete-persona',
  },
};
