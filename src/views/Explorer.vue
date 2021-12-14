<template>
   <iframe
      :src="url"
      width="100%"
      height="100%"
      frameborder="0" >
    </iframe> 
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



