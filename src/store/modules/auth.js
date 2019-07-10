import axios from 'axios'
import jwt from 'jsonwebtoken'
import Vue from 'vue'
import axiosInstance from '@/services/axios'
import { rejectError } from '@/helpers'

function checkTokenValidity(token) {
  if(token) {
    const decodeToken = jwt.decode(token)
    return decodeToken && (decodeToken.exp * 1000) > new Date().getTime()
  }

  return false
}

export default {
  namespaced: true,
  state: {
    user: null,
    isAuthResolved: false
  },
  getters: {
    authUser(state) {
      return state.user || null
    },
    isAuthenticated(state) {
      return !!state.user
    },
    isMeetupOwner: (state) => (meetupCreatorId) => {
      if(!state.user) return false
      return meetupCreatorId === state.user._id
    },
    isMember: (state) => (meetupId) => {
      return state.user &&
             state.user['joinedMeetups'] &&
             state.user['joinedMeetups'].includes(meetupId)
    }
  },
  actions: {
    loginWithEmailAndPassword({commit}, formData) {
      return axios.post('/api/v1/users/login', formData)
        .then(res => {
          const user = res.data
          localStorage.setItem('meetuper-jwt', user.token)
          commit('setAuthUser', user)
        })
        .catch(err => rejectError(err))
    },
    registerUser(context, formData) {
      return axios.post('/api/v1/users/register', formData)
        .catch(err => rejectError(err))
    },
    getAuthUser({commit, getters}) {
      const authUser = getters['authUser']
      const token = localStorage.getItem('meetuper-jwt')
      const isTokenValid = checkTokenValidity(token)
      
      const config = {
        headers: {
          'Cache-Control': 'no-cache'
        }
      }
      if(authUser && isTokenValid) {return  Promise.resolve(authUser)}
      
      return axiosInstance.get('/api/v1/users/me', config)
        .then((res) => {
          const user = res.data
          localStorage.setItem('meetuper-jwt', user.token)
          commit('setAuthUser', user)
          commit('setAuthState', true)
          return user
        })
        .catch(err => {
          commit('setAuthUser', null)
          commit('setAuthState', true)
          return err
        })
    },
    logout({commit}) {
      //For session auth
      /* return axios.post('/api/v1/users/logout')
        .then(() => {
          commit('setAuthUser', null)
          return true
        })
        .catch(err => console.log(err)) */

        return new Promise((resolve, reject) => {
          localStorage.removeItem('meetuper-jwt')
          commit('setAuthUser', null)
          resolve(true)
        })
    },
    addMeetupToAuthUser({commit, state}, meetupId) {
      const userMeetups = [...state.user['joinedMeetups'], meetupId]
      commit('setMeetupsToAuthUser', userMeetups)
    },
    removeMeetupFromAuthUser({commit, state}, meetupId) {
      const userMeetupsId = [...state.user['joinedMeetups']]
      const index = userMeetupsId.findIndex((userMeetupId) => {
        userMeetupId === meetupId
      })

      userMeetupsId.splice(index, 1)
      commit('setMeetupsToAuthUser', userMeetupsId)
    },
    updateUser({commit}, user) {
      return axiosInstance.patch(`/api/v1/users/${user._id}`, user)
        .then(res => {
          const userUpdated = res.data
          commit('setAuthUser', userUpdated)
          return userUpdated
        })
    }
  },
  mutations: {
    setAuthUser(state, user) {
      return state.user = user
    },
    setAuthState(state, authState) {
      return state.isAuthResolved = authState
    },
    setMeetupsToAuthUser(state, meetups) {
      return Vue.set(state.user, 'joinedMeetups', meetups)
    }
  }
}