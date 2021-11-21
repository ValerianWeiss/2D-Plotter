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
          <div
            class="control-btn flex-center up-btn"
            :class="{ 'control-btn-pressed': this.isTopKeyPressed }"
          >
            <i class="fas fa-arrow-up fa-lg"></i>
            <span class="xy-control-btn-label">+y</span>
          </div>
          <div
            class="control-btn flex-center left-btn"
            :class="{ 'control-btn-pressed': this.isLeftKeyPressed }"
          >
            <i class="fas fa-arrow-left fa-lg"></i>
            <span class="xy-control-btn-label">-x</span>
          </div>
          <div
            class="control-btn flex-center right-btn"
            :class="{ 'control-btn-pressed': this.isRightKeyPressed }"
          >
            <i class="fas fa-arrow-right fa-lg"></i>
            <span class="xy-control-btn-label">+x</span>
          </div>
          <div
            class="control-btn flex-center down-btn"
            :class="{ 'control-btn-pressed': this.isBottomKeyPressed }"
          >
            <i class="fas fa-arrow-down fa-lg"></i>
            <span class="xy-control-btn-label">-y</span>
          </div>
        </div>
      </div>
      <div class="z-controls">
        <div
          class="control-btn flex-center up-btn"
          :class="{ 'control-btn-pressed': this.isUpKeyPressed }"
        >
          <span>+</span>
          <span class="z-control-btn-label">+z</span>
        </div>
        <div
          class="control-btn flex-center down-btn"
          :class="{ 'control-btn-pressed': this.isDownKeyPressed }"
        >
          <span>-</span>
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
import MoveXYCmd from '../classes/machine/commands/MoveXYCmd';
import MoveZCmd, { ZDirection } from '../classes/machine/commands/MoveZCmd';
import Cmd from '@/classes/machine/commands/Cmd';
import CmdType from '@/classes/machine/commands/CmdType';
import PositionService from '@/services/PositionService';
import Position from '@/classes/Position';

@Component
export default class Controls extends Vue {
  private serialPorts: PortInfo[];
  private serialPortPath: string;
  private isSerialPortOpen: boolean;
  private movesQueue: Cmd[];
  private stepWidth: number;

  private readonly topKey = 'ArrowUp';
  private readonly rightKey = 'ArrowRight';
  private readonly bottomKey = 'ArrowDown';
  private readonly leftKey = 'ArrowLeft';
  private readonly downKey = 'Slash'; // Slash is '-' on mac keyboard GER layout
  private readonly upKey = 'BracketRight'; // BracketRight is '+' on mac keyboard GER layout

  private isTopKeyPressed: boolean;
  private isRightKeyPressed: boolean;
  private isBottomKeyPressed: boolean;
  private isLeftKeyPressed: boolean;
  private isDownKeyPressed: boolean;
  private isUpKeyPressed: boolean;

  public constructor() {
    super();
    this.serialPorts = [];
    this.serialPortPath = 'None';
    this.isSerialPortOpen = false;
    this.movesQueue = [];
    this.isTopKeyPressed = false;
    this.isRightKeyPressed = false;
    this.isBottomKeyPressed = false;
    this.isLeftKeyPressed = false;
    this.isDownKeyPressed = false;
    this.isUpKeyPressed = false;
    this.stepWidth = 100;

    window.addEventListener('keydown', this.onKeydown);
    window.addEventListener('keyup', this.onKeyup);
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
    this.registerMessageHandlers();
    SerialComService.openPort(defaultPath, this.updateSerialPortStatus);
  }

  private onSerialPortChange() {
    SerialComService.closePort(this.updateSerialPortStatus);
    SerialComService.openPort(this.serialPortPath, this.updateSerialPortStatus);
  }

  private updateSerialPortStatus() {
    this.isSerialPortOpen = SerialComService.isOpen;
  }

  private registerMessageHandlers() {
    SerialComService.addMessageHandler(CmdType.MOVE_XY, () => {
      this.removeCmdFromQueue(cmd => cmd instanceof MoveXYCmd);
    });

    SerialComService.addMessageHandler(CmdType.MOVE_Z, () => {
      this.removeCmdFromQueue(cmd => cmd instanceof MoveZCmd);
    });

    SerialComService.addMessageHandler(CmdType.CURR_POS, (message: string) => {
      PositionService.eventBus.emit('onGetCurrPosRes', null, message);
    });
  }

  private removeCmdFromQueue(filter: (cmd: Cmd) => boolean): void {
    const moveCmds = this.movesQueue.filter(filter);

    if (moveCmds.length != 1) {
      const message = `Invalid command count in queue: ${moveCmds.length}`;
      Logger.warn(message, LogMessageId.CO_INVLD_CMD_COUNT_QUEUE);
      throw new Error(message);
    }

    const cmdIndex = this.movesQueue.indexOf(moveCmds[0]);
    this.movesQueue.splice(cmdIndex, 1);
  }

  private sendMoves() {
    this.sendXYMove();
    this.sendZMove();
  }

  private sendXYMove() {
    if (!this.movesQueue.some(cmd => cmd instanceof MoveXYCmd)) {
      const top = this.isTopKeyPressed;
      const right = this.isRightKeyPressed;
      const bottom = this.isBottomKeyPressed;
      const left = this.isLeftKeyPressed;

      if (top || right || bottom || left) {
        PositionService.fetchCurrentPosition().then(response => {
          const currentPosition = response.currentPosition;
          let x = currentPosition.x;
          let y = currentPosition.y;
          x = right ? x + this.stepWidth : x;
          x = left ? x - this.stepWidth : x;
          y = top ? y + this.stepWidth : y;
          y = bottom ? y - this.stepWidth : y;
          const targetPosition = new Position(x, y, currentPosition.z);

          if (targetPosition.x < 0 || targetPosition.y < 0) {
            Logger.info(
              `Move to target position x: ${targetPosition.x} y: ${targetPosition.y} is invalid. Negative coordinates are not allowed`,
              LogMessageId.CO_INVALID_MOVE_XY_CMD
            );
            return;
          }

          const moveXYCmd = new MoveXYCmd(targetPosition.x, targetPosition.y);
          this.movesQueue.push(moveXYCmd);
          const cmd = moveXYCmd.serialize();
          SerialComService.send(cmd);
        });
      }
    }
  }

  private sendZMove() {
    if (!this.movesQueue.some(cmd => cmd instanceof MoveZCmd)) {
      const up = this.isUpKeyPressed;
      const down = this.isDownKeyPressed;

      if ((up && !down) || (down && !up)) {
        const direction = up ? ZDirection.UP : ZDirection.DOWN;
        const moveZcmd = new MoveZCmd(direction);
        this.movesQueue.push(moveZcmd);
        const cmd = moveZcmd.serialize();
        SerialComService.send(cmd);
      }
    }
  }

  private onKeydown(event: KeyboardEvent) {
    this.setKeyPressed(event, true);
    this.sendMoves();
  }

  private onKeyup(event: KeyboardEvent) {
    this.setKeyPressed(event, false);
  }

  private setKeyPressed(event: KeyboardEvent, isKeyPressed: boolean) {
    if (event.code == this.topKey) this.isTopKeyPressed = isKeyPressed;
    if (event.code == this.rightKey) this.isRightKeyPressed = isKeyPressed;
    if (event.code == this.bottomKey) this.isBottomKeyPressed = isKeyPressed;
    if (event.code == this.leftKey) this.isLeftKeyPressed = isKeyPressed;
    if (event.code == this.upKey) this.isUpKeyPressed = isKeyPressed;
    if (event.code == this.downKey) this.isDownKeyPressed = isKeyPressed;
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

  &-pressed
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
