<template>
  <div class="main">
    <iframe
      class="frame"
      :src="url"
      width="100%"
      frameborder="0" >
    </iframe> 
  </div>
</template>
<script>
import config from '../config'

export default {
  name: 'Explorer',

  data () {
    return {
      url: config.explorerUrl
    }
  }
}
</script>
<style scoped>
.main {
  width: 90% !important;
  height: 100%;
  margin: auto;
}
.frame {
  height: 100% !important;
  width: 100% !important;
}
</style>