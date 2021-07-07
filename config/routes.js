import { API } from './api';

export const ROUTES = {
  Home: '/',
  Login: '/login',
  Dashboard: '/dashboard',
  License: '/license',
  Users: '/users',
  Clients: '/clients',
  Billing: '/billing',
  Projects: '/projects',
  CreateProject: '/new-project',
  CreateUser: '/new-user',
}

// API.POST.

const GET_PREFIX = `/api/get?q=`;
const POST_PREFIX = `/api/post?q=`;

export const APIROUTES = {
  USER:     '/api/user',
  TOKEN:    '/api/token',
  LOGIN:    '/api/login',
  LOGOUT:   '/api/logout',

  GET_USERS:              GET_PREFIX + API.GET_USERS,
  GET_LICENSE:            GET_PREFIX + API.GET_LICENSE,
  GET_CLIENTS:            GET_PREFIX + API.GET_CLIENTS,
  GET_PROJECT:            GET_PREFIX + API.GET_PROJECT,
  GET_PROJECTS:           GET_PREFIX + API.GET_PROJECTS,
  GET_BATCH:              GET_PREFIX + API.GET_BATCH,
  GET_USERNAMES:          GET_PREFIX + API.GET_USERNAMES,
  GET_PERSONAE:           GET_PREFIX + API.GET_PERSONAE,
  GET_GUESTS:             GET_PREFIX + API.GET_GUESTS,
  GET_WORKBOOK:           GET_PREFIX + API.GET_WORKBOOK,
  GET_TEST_ACCESS:        GET_PREFIX + API.GET_TEST_ACCESS,

  GET: {
    BATCHES:              GET_PREFIX + API.GET.BATCHES,
    BATCH_PERSONAE:       GET_PREFIX + API.GET.BATCH_PERSONAE,
  },

  POST: {
    // user
    NEW_USER:             POST_PREFIX + API.POST.NEW_USER,
    DELETE_USER:          POST_PREFIX + API.POST.DELETE_USER,
    DISABLE_USER:         POST_PREFIX + API.POST.DISABLE_USER,
    ACTIVATE_USER:        POST_PREFIX + API.POST.ACTIVATE_USER,
    RESET_USER:           POST_PREFIX + API.POST.RESET_USER,
    CHANGE_PASSWORD:      POST_PREFIX + API.POST.CHANGE_PASSWORD,
    // project
    SAVE_PROJECT:         POST_PREFIX + API.POST.SAVE_PROJECT,
    SAVE_CLIENT_PROJECT:  POST_PREFIX + API.POST.SAVE_CLIENT_PROJECT,
    CHANGE_PROJECT_ADMIN: POST_PREFIX + API.POST.CHANGE_PROJECT_ADMIN,
    UPDATE_PROJECT:       POST_PREFIX + API.POST.UPDATE_PROJECT,
    SAVE_NEW_BATCH:       POST_PREFIX + API.POST.SAVE_NEW_BATCH,
    UPDATE_BATCH:         POST_PREFIX + API.POST.UPDATE_BATCH,
    DELETE_BATCH:         POST_PREFIX + API.POST.DELETE_BATCH,
  }
}