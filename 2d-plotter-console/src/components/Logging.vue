<template>
  <div id="Logging">
    <div class="content-container">
      <div class="toolbar">
        <div class="toolbar-item tail">
          <input
            type="checkbox"
            v-model="isTailing"
            @change="this.scrollBottom"
          />
          <label>Tail</label>
        </div>
      </div>
      <div class="textarea-wrapper">
        <textarea
          v-model="logs"
          ref="logs"
          @scroll="this.disableTailing"
          readonly
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Logger } from '@/services/LogService';

@Component
export default class Logging extends Vue {
  private logs: string;
  private isTailing: boolean;

  public constructor() {
    super();
    this.logs = '';
    this.isTailing = true;
    Logger.registerLoggingVue(this);
    this.$on('appendLog', this.appendLog);
  }

  private appendLog(logMessage: string) {
    this.logs += logMessage;
    this.scrollBottom();
  }

  private scrollBottom() {
    if (this.isTailing) {
      const textarea = this.$refs.logs;

      if (textarea instanceof Element) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    }
  }

  private disableTailing() {
    this.isTailing = false;
  }
}
</script>

<style scoped lang="sass">
.content-container
  width: 100%
  height: 100%

.toolbar
  display: flex
  flex-direction: row
  width: 100%
  height: 2.5rem
  background: rgb(70, 70, 70)

  .toolbar-item
    display: flex
    align-items: center
    color: white
    height: 100%
    margin-left: 1rem

.textarea-wrapper
  width: 100%
  height: calc(100% - 2.5rem)

  textarea
    width: 100%
    height: 100%
    padding-left: 1rem
    box-sizing: border-box
    color: white
    background: rgb(10, 10, 10)
    border: none
    outline: none
    white-space: pre
    resize: none
    scrollbar-base-color: #ff0000
</style>
