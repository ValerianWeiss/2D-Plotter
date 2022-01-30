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
    <div class="btn flex-center origin-btn" @click="this.onSetOrigin">
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
        <input
          class="x-res"
          type="text"
          v-model="resolutionSettings.x"
          number
        />
        <input
          class="y-res"
          type="text"
          v-model="resolutionSettings.x"
          number
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import MessageType from '@/classes/machine/MessageType';
import CurrentPositionResponse from '@/classes/machine/responses/CurrentPositionResponse';
import { Component, Vue } from 'vue-property-decorator';
import SetOriginCmd from '../classes/machine/commands/SetOriginCmd';
import SerialComService from '../services/SerialComService';
import EventService, { Event } from '../services/EventService';

@Component
export default class Parameters extends Vue {
  private currentPosition: { x: string; y: string; z: string };
  private resolutionSettings: { x: string; y: string };

  public constructor() {
    super();
    this.currentPosition = { x: '-', y: '-', z: '-' };
    this.resolutionSettings = { x: '1024', y: '1024' };
  }

  private mounted() {
    SerialComService.addMessageHandler(MessageType.CURR_POS, message => {
      const currentPositionResponse = new CurrentPositionResponse(message);
      this.currentPosition.x = currentPositionResponse.currentPosition.x.toString();
      this.currentPosition.y = currentPositionResponse.currentPosition.y.toString();
      this.currentPosition.z = currentPositionResponse.currentPosition.z.toString();
    });
  }

  private onSetOrigin() {
    const setOriginCmd = new SetOriginCmd();
    const cmd = setOriginCmd.serialize();
    SerialComService.send(cmd);
    EventService.emit(Event.SET_ORIGIN);
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
  cursor: pointer

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
  padding: 5px
  box-sizing: border-box
  color: white
  background: rgb(50,50,50)
  outline: none
  border: none
</style>
