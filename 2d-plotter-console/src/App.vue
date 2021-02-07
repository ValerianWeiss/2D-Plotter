<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Layout from './components/Layout.vue';
import SerialComService from './services/SerialComService';

@Component({
  components: {
    Layout
  }
})
export default class App extends Vue {
  public mounted() {
    SerialComService.getSocket().then(socket => {
      socket.send('Hello World!');
    });
  }
}
</script>

<style lang="sass">
body
  margin: 0
  padding: 0
</style>
