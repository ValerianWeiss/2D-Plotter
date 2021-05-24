<template>
  <div id="Controls">
    <div class="content-container h-v-100">
      <div class="com-status-container">
        <i
          class="fas fa-stop fa-2x com-status-led"
          :class="{ 'com-status-led-is-connected': this.isSerialPortOpen }"
        ></i>
        <select
          class="com-selector"
          v-model="serialPortPath"
          @change="this.onSerialPortChange"
        >
          <option
            v-for="serialPort in serialPorts"
            :value="serialPort.path"
            :key="serialPort.path"
          >
            {{ serialPort.path }}
          </option>
        </select>
        <span class="com-status-txt">
          {{ this.isSerialPortOpen ? 'is connected' : 'is not connected' }}
        </span>
      </div>
      <div class="flex-center">
        <div class="xy-controls">
          <div class="control-btn flex-center up-btn">
            <i class="fas fa-arrow-up fa-lg"></i>
            <span class="xy-control-btn-label">+y</span>
          </div>
          <div class="control-btn flex-center left-btn">
            <i class="fas fa-arrow-left fa-lg"></i>
            <span class="xy-control-btn-label">-x</span>
          </div>
          <div class="control-btn flex-center right-btn">
            <i class="fas fa-arrow-right fa-lg"></i>
            <span class="xy-control-btn-label">+x</span>
          </div>
          <div class="control-btn flex-center down-btn">
            <i class="fas fa-arrow-down fa-lg"></i>
            <span class="xy-control-btn-label">-y</span>
          </div>
        </div>
      </div>
      <div class="z-controls">
        <div class="control-btn flex-center up-btn">
          <span>⇧</span>
          <span class="z-control-btn-label">+z</span>
        </div>
        <div class="control-btn flex-center down-btn">
          <span>␣</span>
          <span class="z-control-btn-label">-z</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PortInfo } from 'serialport';
import { Logger, LogMessageId } from '../services/LogService';
import SerialComService from '../services/SerialComService';

@Component
export default class Controls extends Vue {
  private serialPorts: PortInfo[];
  private serialPortPath: string;
  private isSerialPortOpen: boolean;

  public constructor() {
    super();
    this.serialPorts = [];
    this.serialPortPath = 'None';
    this.isSerialPortOpen = false;
  }

  private async mounted() {
    this.serialPorts = await SerialComService.getPorts();
    if (this.serialPorts.length == 0) {
      Logger.warn(
        'Could not find any serial ports',
        LogMessageId.CO_SERIAL_PORT_CON_ERROR
      );
      return;
    }

    const defaultPath = this.serialPorts[0].path;
    this.serialPortPath = defaultPath;
    SerialComService.openPort(defaultPath, this.updateSerialPortStatus);
  }

  private onSerialPortChange() {
    SerialComService.closePort(this.updateSerialPortStatus);
    SerialComService.openPort(this.serialPortPath, this.updateSerialPortStatus);
  }

  private updateSerialPortStatus() {
    this.isSerialPortOpen = SerialComService.isOpen;
  }
}
</script>

<style scoped lang="sass">
.com-status-container
  display: flex
  align-items: center
  height: 2rem

  .com-selector
    width: 50%
    margin-left: .5rem
    background: $appBackground
    color: white
    height: 100%
    border: none
    outline: none
    white-space: nowrap
    text-overflow: ellipsis

  .com-status-led
    color: red

    &-is-connected
      color: rgb(70, 160, 50)

  .com-status-txt
    margin-left: .5rem
    color: white
    font-size: .9rem


.xy-controls
  display: grid
  margin-top: 1rem
  width: 25vw
  height: 25vw
  grid-template-columns: 1fr 1fr 1fr
  grid-template-rows: 1fr 1fr 1fr
  grid-template-areas: '. up .' 'left . right'  '. down .'

.z-controls
  display: grid
  margin-top: 1rem
  width: 10vw
  height: 5vw
  grid-template-columns: 3rem 1rem 3rem
  grid-template-rows: 3rem
  grid-template-areas: 'down . up'

.control-btn
  position: relative
  width: 90%
  height: 90%
  background: rgb(255, 140, 50)
  border-radius: 5px
  cursor: pointer

  &:hover
    background: rgba(255, 140, 50, .7)

.up-btn
  grid-area: up

.left-btn
  grid-area: left

.right-btn
  grid-area: right

.down-btn
  grid-area: down

.xy-control-btn-label
  position: absolute
  bottom: 0.3rem

.z-control-btn-label
  position: absolute
  bottom: 0.1rem
  font-size: 0.75rem
</style>
