import axios from 'axios'
import axiosInstance from '@/services/axios'
import Vue from 'vue'
import {applyFilters} from '@/helpers'
import { init } from 'events';

export default {
    namespaced: true, 
    state: {
        items: [],
        item: {},
        isAllMeetupsLoaded: false
    },
    actions: {
        fetchMeetups({commit, state}, {filter = {}, init}) {
            if(init){
                commit('setItems', {resource: 'meetups', items: []}, {root: true})
            }
            const url = applyFilters('/api/v1/meetups', filter)
            return axios.get(url)
                .then(res =>{
                    const {meetups, isAllDataLoaded} = res.data
                    commit('setAllDataLoaded', isAllDataLoaded)
                    commit('mergeMeetups', meetups)
                    return state.items
                })
                .catch(err => console.log(err))
        },
        fetchMeetupById({commit, state}, id) {
            commit('setItem', {resource: 'meetups', item: {}}, {root: true})
            return axios.get(`/api/v1/meetups/${id}`)
                .then(res =>{
                    const meetup = res.data
                    commit('setItem', {resource: 'meetups', item: meetup}, {root: true})
                    return state.item
                })
        },
        createMeetup({rootState}, meetupData) {
            meetupData.meetupCreator = rootState.auth.user
            meetupData.processedLocation = meetupData.location.toLowerCase().replace(/[\s,]+/g,'').trim()

            return axiosInstance.post('/api/v1/meetups/', meetupData)
                .then(res => res.data)
                .catch(err => console.log.err)
        },
        joinMeetup({state, rootState, commit, dispatch}, meetupId) {
            const user = rootState.auth.user
            return axiosInstance.post(`/api/v1/meetups/${meetupId}/join`)
                .then(() => {
                    dispatch('auth/addMeetupToAuthUser', meetupId, {root: true})

                    const joinedPeople = state.item.joinedPeople
                    commit('addUserToMeetup', [...joinedPeople, user])
                })
        }, 
        leaveMeetup({state, rootState, commit, dispatch}, meetupId) { 
            const user = rootState.auth.user

            return axiosInstance.post(`/api/v1/meetups/${meetupId}/leave`)
                .then(() => {
                    dispatch('auth/removeMeetupFromAuthUser', meetupId, {root: true})

                    const joinedPeople = state.item.joinedPeople
                    const index = joinedPeople.findIndex(jIndex => jIndex._id === user._id)
                    joinedPeople.splice(index, 1)
                    commit('addUserToMeetup', joinedPeople)
                })
        },
        updateMeetup({commit, state}, meetupData) {
            meetupData.processedLocation = meetupData.location.toLowerCase().replace(/[\s,]+/g,'').trim()
            return axiosInstance.patch(`/api/v1/meetups/${meetupData._id}`, meetupData)
                .then(res => {
                    const meetup = res.data
                    commit('mergeMeetup', meetup)
                    return state.item
                })
        }
    },
    mutations: {
        addUserToMeetup(state, people) {
            return Vue.set(state.item, 'joinedPeople', people)
        },
        mergeMeetup(state, updatedMeetup) {
            state.item = {...state.item, ...updatedMeetup}
        },
        mergeMeetups(state, updatedMeetup) {
            state.items = [...state.items, ...updatedMeetup]
        },
        setAllDataLoaded(state, isAllDataLoaded) {
            state.isAllMeetupsLoaded = isAllDataLoaded
        }
    }
}