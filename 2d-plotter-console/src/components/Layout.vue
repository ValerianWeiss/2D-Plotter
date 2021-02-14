<template>
  <div id="Layout">
    <main>
      <Execution class="execution cell" />
      <Controls class="controls cell" />
      <Parameters class="parameters cell" />
      <Logging class="logging cell" />
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

.cell
  margin: 1.5rem
  overflow: hidden

main
  display: grid
  height: 100vh
  width: 100vw
  grid-template-columns: 1fr 1fr 1fr
  grid-auto-rows: minmax(min-content, max-content) 1fr
  grid-template-areas: 'execution controls parameters' 'logging logging logging'

@media only screen and (min-height: 1600px)
  main
    grid-template-columns: 1fr
    grid-template-rows: minmax(min-content, max-content) minmax(min-content, max-content) minmax(min-content, max-content) 1fr
    grid-template-areas: 'execution'  'controls' 'parameters' 'logging'
</style>
