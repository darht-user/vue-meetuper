<template>
  <form class="post-create">
    <div class="field">
      <textarea 
        v-auto-expand
        class="textarea textarea-post" 
        placeholder="Write a post" 
        rows="1"
        v-model="text"></textarea>
      <button 
        @click.prevent="sendPost"
        :disabled="!text" 
        class="button is-primary m-t-sm">Send</button>
    </div>
  </form>
</template>

<script>
import autoExpand from "@/directives/autoExpand"
export default {
  directives: {autoExpand},
  props:['threadId'],
  data() {
    return {
      text: null
    }
  },
  computed: {
    meetup() {
      return this.$store.state.meetups.item
    } 
  },
  methods: {
    sendPost() {
      const post = {}
      post.thread = this.threadId
      post.text = this.text
      this.$store.dispatch('threads/sendPost', post)
        .then((createdPost) => {
          this.$socket.emit('meetup/postSaved', {...createdPost, meetup: this.meetup._id})
          this.text = ''
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.post-create {
  margin-bottom: 15px;
}

.textarea-post {
  padding-bottom: 30px;
}


</style>
