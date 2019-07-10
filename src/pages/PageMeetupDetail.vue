<template>
  <div class="meetup-detail-page">
    <div v-if="pageLoader_isDataLoaded">
      <section class="hero">
        <div class="hero-body">
          <div class="container">
            <h2 class="subtitle">{{ meetups.startDate | formatDate }}</h2>
            <h1 class="title">{{ meetups.title }}</h1>
            <article class="media v-center">
              <figure class="media-left">
                <p class="image is-64x64">
                  <img class="is-rounded" :src="meetupCreator.avatar">
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    Created by
                    <strong>{{ meetupCreator.name }}</strong>
                  </p>
                </div>
              </div>
            </article>
          </div>
          <div class="is-pulled-right">
            <!-- We will handle this later (: -->
            <button 
              @click="leaveMeetup"
              v-if="isMember"
              class="button is-danger">Leave Meetup</button>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="columns">
            <div class="column is-3">
              <aside class="is-medium menu">
                <div class="meetup-side-box">
                  <div class="meetup-side-box-date m-b-sm">
                    <p>
                      <b>Date</b>
                    </p>
                    <p>{{meetups.startDate | formatDate}}</p>
                  </div>
                  <div class="meetup-side-box-date m-b-sm">
                    <p>
                      <b>Time</b>
                    </p>
                    <span>{{ meetups.timeFrom }}</span> -
                    <span>{{ meetups.timeTo }}</span>
                  </div>
                  <div class="meetup-side-box-place m-b-sm">
                    <p>
                      <b>How to find us</b>
                    </p>
                    <p>{{ meetups.location }}</p>
                  </div>
                  <div class="meetup-side-box-more-info">
                    <p>
                      <b>Additional Info</b>
                    </p>
                    <p>{{ meetups.shortInfo }}</p>
                  </div>
                </div>
                <div class="meetup-side-box-map">
                  <img
                    src="https://cnet2.cbsistatic.com/img/H_zPLL8-QTZOLxJvgHQ1Jkz0EgY=/830x467/2013/07/10/f0bcef02-67c2-11e3-a665-14feb5ca9861/maps_routemap.png"
                    class="venueMap-mapImg span--100"
                    alt="Location image of meetup venue"
                  >
                </div>
                <!-- Threads Start -->
                <p class="menu-label">Threads</p>
                <ul>
                  <li v-for="thread in orderedThreads" :key="thread._id">{{ thread.title }}</li>
                </ul>
                <p class="menu-label">Who is Going</p>
                <div class="columns is-multiline is-mobile">
                  <!-- Joined People Images Here -->
                  <div class="column is-3" v-for="person in meetups.joinedPeople" :key="person._id">
                    <figure class="image is-64x64">
                      <img class="is-rounded" :src="person.avatar">
                    </figure>
                  </div>
                </div>
                <!-- Threads Ends -->
              </aside>
            </div>
            <div class="column is-7 is-offset-1">
              <div class="content is-medium">
                <h3 class="title is-3">About the Meetup</h3>
                <p>{{ meetups.description }}</p>
                <button 
                  @click="joinMeetup"
                  v-if="canJoin" 
                  class="button is-primary">Join In</button>
                <button 
                  v-if="!isAuthenticated"
                  :disabled="true"
                  class="button is-warning">You need authenticate in order to join</button>
                <ThreadCreateModal 
                  v-if="isMember || isMeetupOwner"
                  :btnTitle="`Welcome ${authUser.username}, start thread`"
                  :title="'Create thread'"
                  @threadSubmitted="createThread"/>
              </div>
              <ThreadList 
                :orderedThreads="orderedThreads"
                :canMakePost="canMakePost"/>
              <button 
                v-if="!isAllThreadsLoaded"
                class="button is-primary"
                @click="fetchThreadsHandler">Load More Threads</button>
            </div>
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
import { mapActions, mapState } from "vuex"
import pageLoader from "@/mixins/pageLoader"
import ThreadCreateModal from "@/components/ThreadCreateModal"
import ThreadList from "@/components/ThreadList"
import { Promise } from 'q';
export default {
  components: {ThreadCreateModal, ThreadList},
  mixins: [pageLoader],
  data() {
    return {
      threadPageNum: 1,
      threadPageSize: 5
    }
  },
  created() {
    const meetupId = this.$route.params.id
    Promise.all([this.fetchMeetupById(meetupId)])
      .then(() => this.pageLoader_resolveData())
      .catch((err) => {
        console.log(err)
        this.pageLoader_resolveData()
      })
    if(this.isAuthenticated) {
      this.$socket.emit('meetup/subscribe', meetupId)
      this.$socket.on('meetup/postPublished', this.addPostToThreadHandler)
    }
    this.fetchThreadsHandler({meetupId, init: true})
  },
  destroyed() {
    this.$socket.removeListener('meetup/postPublished', this.addPostToThreadHandler)
    this.$socket.emit('meetup/unsubscribe', this.meetups._id)
  },
  computed: {
    meetupCreator() {
      return this.meetups.meetupCreator || {}
    },
    ...mapState({
      meetups: state => state.meetups.item,
      threads: state => state.threads.items,
      authUser: state => state.auth.user,
      isAllThreadsLoaded: state => state.threads.isAllThreadsLoaded
    }),
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated']
    }, 
    isMeetupOwner() {
      return this.$store.getters['auth/isMeetupOwner'](this.meetupCreator._id)
    },
    isMember() {
      return this.$store.getters['auth/isMember'](this.meetups._id)
    },
    canJoin() {
      return !this.isMeetupOwner &&
              this.isAuthenticated &&
             !this.isMember
    },
    canMakePost() {
      return this.isAuthenticated && (this.isMember || this.isMeetupOwner)
    },
    orderedThreads() {
      const threadsReverse = this.threads
      return threadsReverse.sort((thread, nextThread) => {
        return new Date(nextThread.createdAt) - new Date(thread.createdAt)
      })
    }
  },
  methods: {
    ...mapActions('meetups', ['fetchMeetupById']),
    ...mapActions('threads', ['fetchThreads', 'postThread', 'addPostToThread']),
    fetchThreadsHandler({meetupId, init}) {
      const filter = {
        PageNum: this.threadPageNum,
        pageSize: this.threadPageSize
      }
      this.fetchThreads({meetupId: meetupId || this.meetups._id, filter, init})
        .then(() => {
          this.threadPageNum++
        })
    },
    addPostToThreadHandler(post) {
      this.addPostToThread({post, thread: post.thread})
    },
    joinMeetup() {
      this.$store.dispatch('meetups/joinMeetup', this.meetups._id)
    },
    leaveMeetup() {
      this.$store.dispatch('meetups/leaveMeetup', this.meetups._id)
    },
    createThread({title, done}) {
      this.postThread({title, meetupId: this.meetups._id})
        .then(() => {
          this.$toasted.success('Thread sucessfuly created!', {duration: 3000, position: "top-center"})
          done()
        })
    }

  }
}
</script>

<style scoped lang="scss">
.tag.is-warning {
  opacity: 0.5;
}
.meetup-detail-page {
  background-color: #f5f5f5;
  .mapouter {
    text-align: right;
    height: 500px;
    width: 600px;
  }
  .gmap_canvas {
    overflow: hidden;
    background: none !important;
    height: 500px;
    width: 600px;
  }
  .hero-body {
    background-color: white;
    border: 1px solid rgba(46, 62, 72, 0.12);
    color: white;
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url("https://images.unsplash.com/photo-1531263060782-b024de9b9793?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80");
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    > p,
    h1,
    h2,
    strong {
      color: white;
    }
  }
  .meetup-side-box {
    background-color: white;
    border-radius: 10px;
    font-size: 16px;
    padding: 15px;
  }
}
pre,
.message {
  max-width: 960px;
}
.v-center {
  align-items: center;
}
li {
  margin: 10px;
}
.hero.is-primary {
  background: linear-gradient(to top right, #524ad0 10%, #d099fa);
}
.box {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
}
.box span.icon {
  float: right;
  font-size: 1.7em;
  padding: 2rem 2rem 0 0;
}
.is-large.fab {
  font-size: 7em;
}
.is-large.fas {
  font-size: 5em;
  margin-left: 0.2em;
}
.media-content {
  overflow: hidden;
}
.menu-list li a:hover {
  background: #d9d9d9;
}
.token.number {
  display: inline;
  padding: inherit;
  font-size: inherit;
  line-height: inherit;
  text-align: inherit;
  vertical-align: inherit;
  border-radius: inherit;
  font-weight: inherit;
  white-space: inherit;
  background: inherit;
  margin: inherit;
}
.footer {
  background-color: white;
}

</style>