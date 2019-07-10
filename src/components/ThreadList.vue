<template>
  <div class="content is-medium">
    <h3 class="title is-3">Threads</h3>
    <div class="box" v-for="thread in orderedThreads" :key="thread._id">
      <!-- Thread title -->
      <h4 id="const" class="title is-3">{{ thread.title }}</h4>
      <PostCreate 
        :threadId="thread._id"
        v-if="canMakePost" />
      <!-- Posts START -->
      <article class="media post-item" v-for="post in thread.posts" :key="post._id">
        <figure class="media-left is-rounded user-image">
          <p class="image is-32x32">
            <img class="is-rounded" :src="post.user.avatar">
          </p>
        </figure>
        <div class="media-content">
          <div class="content is-medium">
            <div class="post-content">
              <strong class="author">{{ post.user.name }}</strong>
              {{' '}}
              <small class="post-time">{{ post.updatedAt | fromNow }}</small>
              <br>
              <p class="post-content-message">{{ post.text }}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import PostCreate from "@/components/PostCreate"
export default {
  components: {PostCreate},
  props:['orderedThreads', 'canMakePost']
}
</script>

<style lang="scss" scoped>

.textarea-post {
  padding-bottom: 30px;
}
.post-create {
  margin-bottom: 15px;
}

.content {
  figure {
    margin-bottom: 0;
  }
}
.media-content {
  background-color: #f1f1f1;
  padding: 3px 20px;
  border-radius: 10px;
  margin-right: 40px;
  width: 100px;
}
.media-left.user-image {
  margin: 0;
  margin-right: 15px;
}
.post-item {
}
.media + .media {
  border: none;
  margin-top: 0;
}
.post-content {
  margin: 0;
  &-message {
    font-size: 16px;
  }
  .author {
    font-size: 18px;
  }
  .post-time {
    font-size: 16px;
  }
}
</style>
