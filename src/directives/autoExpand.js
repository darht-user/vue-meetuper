export default {
  bind(el) {
    el.__AutoResixe__= () => {
      setTimeout(() => {
        el.style.cssText = 'height: auto'
        const height = el.scrollHeight + 2
        el.style.cssText = 'height:' + height + 'px'
      }, 0)
    }
    el.addEventListener('keydown', el.__AutoResixe__)
  },
  unbind(el) {
    el.removeEventListener('keydown', el.__AutoResixe__)
  }
}