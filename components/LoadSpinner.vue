<template>
  <icon icon="fas fa-spinner" size="big" v-if="loading" class="load-spinner"></icon>
</template>

<script>
import Vue from 'vue'
import LibUtils from 'static/libraries/libUtils'

const LoadSpinner = Vue.extend({
  name: 'LoadSpinner',

  data() {
    return {}
  },

  props: ['loading', 'color'],
})
export default LoadSpinner
</script>

<style scoped lang="scss">
.load-spinner {
  display: inline-flex;
  animation: spin infinite 1s ease-in-out;
  margin: 4px auto;
  color: var(--system-primary-color);
  border-radius: 50%;
}

@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
