import Vue from 'vue'
import moment from 'moment'

const filters = () => {

  Vue.filter('capitalize', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  })


  Vue.filter('formatDate', function (value, formatType = 'LL') {
    if (!value) return ''

    return moment(value).format(formatType)
  })

  Vue.filter('fromNow', function (value) {
    if (!value) return ''

    return moment(value).fromNow()
  })

}

export default filters