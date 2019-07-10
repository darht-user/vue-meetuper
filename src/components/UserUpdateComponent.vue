<template>
  <div>
    <button
      @click="isActive = !isActive"
      class="button is-primary is-outlined m-t-sm"
    >Update Info</button>
    <div :class="['modal', {'is-active': isActive}]">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">User Profile</p>
          <button 
            @click="isActive = !isActive"
            class="delete" 
            aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <form>
            <div class="field">
              <label class="title">Name</label>
              <input
                v-model="user.name" 
                class="input">
            </div>
            <div class="field">
              <label class="title">Username</label>
              <input 
                v-model="user.username"
                class="input">
            </div>
            <div class="field">
              <label class="title">Avatar</label>
              <input 
                v-model="user.avatar"
                class="input">
            </div>
            <div class="field">
              <label class="title">Info</label>
              <input 
                v-model="user.info"
                class="input">
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button 
            @click="emitUser"
            class="button is-success">Save changes</button>
          <button 
            @click="isActive = !isActive" 
            class="button">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['authUser'],
  data() {
    return {
      isActive: false,
      user: {...this.authUser}
    }
  },
  methods: {
    emitUser() {
      this.$emit('userSubmitted', {user: this.user, done: () => {
        this.isActive = false
      }})
    }
  }
}
</script>
