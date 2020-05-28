<template>
  <div>
    {{ text }}
  </div>
</template>
<script>
import './css/style.css'
import img from './img/big.png'
export default {
  name: 'App',
  data() {
    return {
      text: 'Hello',
    }
  },
  mounted() {
    var imgElement = document.createElement('img')
    imgElement.src = img
    document.body.appendChild(imgElement)
  },
}
</script>
