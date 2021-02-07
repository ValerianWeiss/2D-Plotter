<template>
  <div id="Layout">
    <main>
      <Execution class="execution" />
      <Controls class="controls" />
      <Parameters class="parameters" />
      <Logging class="logging" />
    </main>
  </div>
</template>

<script lang="ts">
import Controls from './Controls.vue';
import Execution from './Execution.vue';
import Logging from './Logging.vue';
import Parameters from './Parameters.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    Controls,
    Execution,
    Logging,
    Parameters
  }
})
export default class Layout extends Vue {}
</script>

<style scoped lang="sass">
.controls
  grid-area: controls

.execution
  grid-area: execution

.logging
  grid-area: logging

.parameters
  grid-area: parameters

main
  display: grid
  height: 100vh
  widh: 100vw
  grid-template-areas: 'execution controls parameters' 'logging logging logging'
</style>
