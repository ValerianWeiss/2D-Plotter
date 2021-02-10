<template>
  <div id="Parameters">
    <div class="z-btn-wrapper">
      <div class="z-btn btn flex-center z-0">
        <span>Set z-origin</span>
      </div>
      <div class="z-btn btn flex-center z-max">
        <span>Set z-max</span>
      </div>
    </div>
    <div class="btn flex-center origin-btn">
      <span>Set origin</span>
    </div>
    <div class="data-container">
      <span class="label">Current position:</span>
      <div class="data-wrapper">
        <div>x: {{ this.currentPosition.x }}</div>
        <div>y: {{ this.currentPosition.y }}</div>
        <div>z: {{ this.currentPosition.z }}</div>
      </div>
    </div>
    <div class="data-container">
      <span class="label">Resolution settings:</span>
      <div class="input-data-wrapper">
        <input class="x-res" type="text" v-model="this.resolutionSettings.x" />
        <input class="y-res" type="text" v-model="this.resolutionSettings.y" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Parameters extends Vue {
  private currentPosition: { x: string; y: string; z: string };
  private resolutionSettings: { x: number; y: number };

  public constructor() {
    super();
    this.currentPosition = { x: '-', y: '-', z: '-' };
    this.resolutionSettings = { x: 1024, y: 1024 };
  }
}
</script>

<style scoped lang="sass">
.z-btn-wrapper
  display: grid
  grid-template-columns: 1fr 1rem 1fr
  grid-template-rows: 2rem
  grid-template-areas: 'z-0 . z-max'

  .z-o
    grid-area: z-0

  .z-max
    grid-area: z-max

.btn
  width: 100%
  height: 2rem
  color: white
  background: $btnColor

  &:hover
    background: $btnHoverColor

.origin-btn
  margin-top: 1rem

.data-container
  margin-top: 1rem
  color: white

  .data-wrapper
    display: flex
    width: 100%

    div
      width: 33.33%
      margin-top: .5rem

.input-data-wrapper
  margin-top: .5rem
  display: grid
  grid-template-columns: 1fr 1rem 1fr
  grid-template-rows: 2rem
  grid-template-areas: 'x-res . y-res'

  .x-res
    grid-area: x-res

  .y-res
    grid-area: y-res

input
  width: 100%
  color: white
  background: rgb(50,50,50)
  outline: none
  border: none
</style>
