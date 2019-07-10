<template>
  <div>
    <AppHero />
    <div
      v-if="pageLoader_isDataLoaded" 
      class="container">
      <section class="section">
      <div class="m-b-lg">
        <h1 class="title is-inline">Featured Meetups</h1>
        <router-link 
          v-if="user"
          :to="{name: 'PageMeetupCreate'}" 
          class="button is-primary is-pulled-right m-r-sm">Create Meetups</router-link>
        <router-link :to="{name: 'PageMeetupFinde'}">
          <button class="button is-primary is-pulled-right m-r-sm">All</button>
        </router-link>
      </div>
      <div class="row columns is-multiline">
        <MeetupItem 
          v-for="meetup in meetups"
          :key="meetup._id"
          :meetup="meetup"/>
      </div>
      <div class="has-text-centered">
        <button 
          v-if="!isAllMeetupsLoaded"
          @click="fetchMeetupsHandler"
          class="button is-primary">Load More Meetups</button>
      </div>
      </section>
      <section class="section">
        <div>
          <h1 class="title">Categories</h1>
          <div class="columns cover is-multiline is-mobile">
            <CategoryItem 
              v-for="category in categories" 
              :key="category._id"
              :category="category" /> 
          </div>
        </div>
      </section>
    </div>
    <div
      v-else 
      class="container">
      <AppSpinner />
    </div>
  </div>
</template>

<script>

import CategoryItem from "@/components/CategoryItem"
import MeetupItem from "@/components/MeetupItem"
import pageLoader from "@/mixins/pageLoader"
import { mapActions, mapState, mapGetters } from "vuex"
import { Promise } from 'q';
  export default {
    components: {CategoryItem, MeetupItem},
    mixins: [pageLoader],
    data() {
      return {
        meetupsPageNum: 1,
        meetupsPageSize: 6
      }
    },
    computed: {
      ...mapGetters({
        'user': 'auth/authUser'
      }),
      ...mapState({
        meetups: state => state.meetups.items,
        categories: state => state.categories.items,
        isAllMeetupsLoaded: state => state.meetups.isAllMeetupsLoaded
      })
    },
    created() {
      Promise.all([this.fetchCategories()])
        .then(() => this.pageLoader_resolveData())
        .catch((err) => {
          console.log(err)
          this.pageLoader_resolveData()
        })
      this.fetchMeetupsHandler({init: true})
    }, 
    methods: {
      ...mapActions('meetups', ['fetchMeetups']),
      ...mapActions('categories', ['fetchCategories']),
      fetchMeetupsHandler({init}) {
        const filter = {
          PageNum: this.meetupsPageNum,
          pageSize: this.meetupsPageSize
        }

        this.fetchMeetups({filter, init})
          .then(() => {
            this.meetupsPageNum++
          })
      }
    }
  }
</script>

<style scoped>

</style>
