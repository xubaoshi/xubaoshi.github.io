<template>
  <div>
    {{ text }}
    <pug-vue />
  </div>
</template>
<script>
import './css/style.css'
import img from './img/big.png'
import pug from './test.pug'
import pugVue from './test.vue'
export default {
  name: 'App',
  components: {
    pugVue,
  },
  data() {
    return {
      text: 'Hello',
    }
  },
  mounted() {
    var divElement = document.createElement('div')
    divElement.innerHTML = pug
    document.body.appendChild(divElement)
  },
}
</script>
