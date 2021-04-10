<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Layout from './components/Layout.vue';
import { Logger, LogLevel, LogMessageId } from './services/LogService';
import './styles/main.sass';

@Component({
  components: {
    Layout
  }
})
export default class App extends Vue {
  public mounted() {
    Logger.init(LogLevel.DEBUG, './2d-plotter-console.log');
    Logger.info('*** Started 2d-plotter-console ***', LogMessageId.CO_STARTED);
  }
}
</script>
