<template>
  <div>
    <div :class="$style.brown">
      module
    </div>
    <div class="red">
      scope
    </div>
    <div :class="moduleCss.blue">
      module css
    </div>
  </div>
</template>
<script>
import './css/style.css'
import img from './img/big.png'
import moduleCss from './css/style.module.css'
export default {
  name: 'App',
  data() {
    return {
      moduleCss
    }
  },
  mounted() {
    var imgElement = document.createElement('img')
    imgElement.src = img
    imgElement.className = 'big'
    document.body.appendChild(imgElement)
    console.log(this.$style)
  },
}
</script>
<style module>
.brown {
  color: brown;
}
</style>
<style scoped>
.red {
  color: red;
}
</style>
