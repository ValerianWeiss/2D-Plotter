import Vue from 'vue';
import App from './App.vue';
import store from './store';
import { Logger, LogLevel, LogMessageId } from './services/LogService';

Vue.config.productionTip = false;
Logger.init(LogLevel.DEBUG, './2d-plotter-console.log');
Logger.info('*** Started 2d-plotter-console ***', LogMessageId.CO_STARTED);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
