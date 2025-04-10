import axios from './config'
import localforage from 'localforage'

const AUTH_PREFIX = '/user/'

export const register = payload => {
  return axios.post(AUTH_PREFIX, payload)
}

export const login = payload => {
  return axios.post(`${AUTH_PREFIX}login`, payload)
}

export const logout = () => {
  return localforage.removeItem('jwt_token')
}

export const getUser = () => {
  return axios.get(`${AUTH_PREFIX}me`)
}
