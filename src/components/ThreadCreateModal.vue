<template>
  <div>
    <button 
      @click="isOpen = !isOpen"
      class="button is-success">{{ btnTitle }}</button>
    <div :class="['modal', {'is-active': isOpen}]">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ title }}</p>
          <button 
            @click="isOpen = !isOpen"
            class="delete" 
            aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <form>
            <div class="field">
              <label class="title">What would you like to ask?</label>
              <textarea
                class="textarea"
                placeholder="Just write something that interest you (:"
                rows="10"
                v-model="form.title"
              ></textarea>
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button 
            @click="threadSubmitted"
            class="button is-success">Post thread</button>
          <button 
            @click="isOpen = !isOpen"
            class="button">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['btnTitle', 'title'],
  data() {
    return {
      isOpen: false,
      form: {
        title: null
      }
    }
  },
  methods: {
    threadSubmitted() {
      this.$emit('threadSubmitted', {title: this.form.title, done: () => {
        this.form.title = ''
        this.isOpen = false
      }})
      this.isOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
