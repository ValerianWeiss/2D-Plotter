<template>
  <div id="Execution">
    <div class="content-container h-w-100">
      <div class="file-selector">
        <label class="flex-center">
          <div class="button">
            <span>Select file</span>
          </div>
          <input type="file" @change="this.handleFileChange" />
        </label>
        <div class="selected-file-info">Selected file: {{ this.filename }}</div>
        <div class="selected-file-info">Resolution: {{ this.resolution }}</div>
      </div>
      <div class="progress flex-center">
        <radial-progress-bar
          :diameter="200"
          :completed-steps="this.progress"
          :total-steps="100"
          :stroke-width="2"
          :inner-stroke-width="2"
          :start-color="this.progressColor.startColor"
          :stop-color="this.progressColor.stopColor"
          :animateSpeed="this.radialProgressAnimateSpeed"
        >
          <h3>{{ this.progress }}%</h3>
        </radial-progress-bar>
      </div>
      <div class="action-bar">
        <div class="icon-wrapper flex-center">
          <i
            class="fas fa-play fa-lg play"
            :class="{ 'play-disabled': this.isPlotting }"
            @click="this.startPlotting"
          ></i>
        </div>
        <div class="icon-wrapper flex-center">
          <i
            class="fas fa-stop fa-lg stop"
            :class="{ 'stop-disabled': !this.isPlotting }"
            @click="this.stopPlotting"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RadialProgressBar from 'vue-radial-progress';

@Component({
  components: {
    RadialProgressBar
  }
})
export default class Execution extends Vue {
  private file: File | null;
  private progress: number;
  private isPlotting: boolean;
  private radialProgressAnimateSpeed: number;
  private resolution: string;

  public constructor() {
    super();
    this.file = null;
    this.progress = 50;
    this.isPlotting = false;
    this.radialProgressAnimateSpeed = 1000;
    this.resolution = '-';
  }

  get filename() {
    return this.file ? this.file.name : 'None';
  }

  get progressColor() {
    return this.isPlotting
      ? {
          startColor: '#bbff42',
          stopColor: '#429321'
        }
      : {
          startColor: '#F03B29',
          stopColor: '#FF1119'
        };
  }

  private handleFileChange(event: { target: { files: File[] } }) {
    this.file = event.target.files[0];
    this.resolution = this.parseResolution(this.file);
  }

  private parseResolution(file: File) {
    return '1024 x 720';
  }

  private startPlotting() {
    this.radialProgressAnimateSpeed = 1000;
    this.progress = 0;
    this.isPlotting = true;
  }

  private stopPlotting() {
    this.radialProgressAnimateSpeed = 0;
    this.progress = 50;
    this.isPlotting = false;
  }
}
</script>

<style scoped lang="sass">
.content-container
  position: relative
  color: white
  font-family: Ununtu, sans-serif

.file-selector
  width: 100%

  label
    height: 2rem
    width: 100%
    background: rgb(0, 122, 204)
    color: white
    font-family: Ununtu, sans-serif
    cursor: pointer

    &:hover
      background: rgb(0, 100, 204)

  input
    display: none

.selected-file-info
  padding-top: 1rem
  width: 100%
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.progress
  padding-top: 2rem

.action-bar
  position: absolute
  display: flex
  width: 100%
  bottom: 1rem

  .icon-wrapper
    width: 50%

    .play
      color: rgb(70, 160, 50)

      &-disabled
        color: rgba(70, 160, 50, 0.2)

    .stop
      color: red

      &-disabled
        color: rgba(255, 0, 0, 0.2)
</style>
