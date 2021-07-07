const USERS             = 'USERS';
const BATCH             = 'BATCH';
const LICENSE           = 'LICENSE';
const PROJECT           = 'PROJECT';
const PROJECTS          = 'PROJECTS';
const CLIENTS           = 'CLIENTS';
const USERNAMES         = 'USERNAMES';
const PERSONAE          = 'PERSONAE';
const GUESTS            = 'GUESTS';
const WORKBOOK          = 'WORKBOOK';
const TEST_ACCESS       = 'TEST_ACCESS';

const gets = {};
gets[USERS]            = 'get-users';
gets[BATCH]            = 'get-batch';
gets[LICENSE]          = 'get-license';
gets[PROJECT]          = 'get-project';
gets[PROJECTS]         = 'get-projects';
gets[CLIENTS]          = 'get-clients';
gets[USERNAMES]        = 'get-usernames';
gets[PERSONAE]         = 'get-personae';
gets[GUESTS]           = 'get-guests';
gets[WORKBOOK]         = 'get-workbook';
gets[TEST_ACCESS]      = 'get-test-access';

const NEW_USER              = 'NEW_USER';
const DISABLE_USER          = 'DISABLE_USER';
const ACTIVATE_USER         = 'ACTIVATE_USER';
const DELETE_USER           = 'DELETE_USER';
const RESET_USER            = 'RESET_USER';
const CHANGE_PASSWORD       = 'CHANGE_PASSWORD';
const SAVE_PROJECT          = 'SAVE_PROJECT';
const SAVE_CLIENT_PROJECT   = 'SAVE_CLIENT_PROJECT';
const CHANGE_PROJECT_ADMIN  = 'CHANGE_PROJECT_ADMIN';

const getKeyVals = [
  {k: 'USERS',            v: 'get-users'},
  {k: 'BATCH',            v: 'get-batch'},
  {k: 'LICENSE',          v: 'get-license'},
  {k: 'PROJECT',          v: 'get-project'},
  {k: 'PROJECTS',         v: 'get-projects'},
  {k: 'CLIENTS',          v: 'get-clients'},
  {k: 'USERNAMES',        v: 'get-usernames'},
  {k: 'PERSONAE',         v: 'get-personae'},
  {k: 'GUESTS',           v: 'get-guests'},
  {k: 'WORKBOOK',         v: 'get-workbook'},
  {k: 'TEST_ACCESS',      v: 'get-test-access'},
];

const postKeyVals = [
  { k: 'NEW_USER',              v: 'new-user' },
  { k: 'DISABLE_USER',          v: 'disable-user' },
  { k: 'ACTIVATE_USER',         v: 'activate-user' },
  { k: 'DELETE_USER',           v: 'delete-user' },
  { k: 'RESET_USER',            v: 'reset-user' },
  { k: 'CHANGE_PASSWORD',       v: 'change-password' },
  { k: 'SAVE_PROJECT',          v: 'save-project' },
  { k: 'SAVE_CLIENT_PROJECT',   v: 'save-client-project' },
  { k: 'CHANGE_PROJECT_ADMIN',  v: 'change-project-admin' },
];

function getKV(kvs, prefix = '') {
  const o = {};

  kvs.forEach(({k, v}) => {
    o[k] = prefix + v;
  })

  return o;
}

const posts = {};
posts[NEW_USER]              = 'new-user';
posts[DISABLE_USER]          = 'disable-user';
posts[ACTIVATE_USER]         = 'activate-user';
posts[DELETE_USER]           = 'delete-user';
posts[RESET_USER]            = 'reset-user';
posts[CHANGE_PASSWORD]       = 'change-password';
posts[SAVE_PROJECT]          = 'save-project';
posts[SAVE_CLIENT_PROJECT]   = 'save-client-project';
posts[CHANGE_PROJECT_ADMIN]  = 'change-project-admin';


export const API = {
  GET_USERS:              'get-users',
  GET_BATCH:              'get-batch',
  GET_LICENSE:            'get-license',
  GET_PROJECT:            'get-project',
  GET_PROJECTS:           'get-projects',
  GET_CLIENTS:            'get-clients',
  GET_USERNAMES:          'get-usernames',
  GET_PERSONAE:           'get-personae',
  GET_GUESTS:             'get-guests',
  GET_WORKBOOK:           'get-workbook',
  GET_TEST_ACCESS:        'get-test-access',
  // GET
  GET: {
    USERS:              'get-users',
    LICENSE:            'get-license',
    CLIENTS:            'get-clients',
    PROJECT:            'get-project',
    PROJECTS:           'get-projects',
    BATCH:              'get-batch',
    BATCHES:            'get-batches',
    USERNAMES:          'get-usernames',
    PERSONAE:           'get-personae',
    BATCH_PERSONAE:     'get-batch-personae',
    GUESTS:             'get-guests',
  },
  // POST
  POST: {
    // user
    NEW_USER:               'new-user',
    DISABLE_USER:           'disable-user',
    ACTIVATE_USER:          'activate-user',
    DELETE_USER:            'delete-user',
    RESET_USER:             'reset-user',
    CHANGE_PASSWORD:        'change-password',
    // project
    SAVE_PROJECT:           'save-project',
    SAVE_CLIENT_PROJECT:    'save-client-project',
    CHANGE_PROJECT_ADMIN:   'change-project-admin',
    UPDATE_PROJECT:         'update-project',
    SAVE_NEW_BATCH:         'save-new-batch',
    UPDATE_BATCH:           'update-batch',
    DELETE_BATCH:           'delete-batch',
  },
  // POST: posts,
  // POST: getKV(postKeyVals),

  // POST_USER:              'new-user',
  // NEW_GUEST:              'new-guest',
  // NEW_PROJECT:            'new-project',
  // NEW_CLIENT_PROJECT:     'new-client-project',
  // UPDATE_LOGO:            'update-logo',
  // CHANGE_ADMIN:           'change-admin',
  // ADD_BATCH:              'add-batch',
  // SAVE_DEPLOYMENT:        'save-deployment',
  // SAVE_MODULES:           'save-modules',
  // SAVE_CSV_DATA:          'save-csv-data',
  // UPDATE_PROJECT:         'update-project',
};
