<template>
  <div id="Execution">
    <div class="content-container h-w-100" ref="contentContainer">
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
      <div class="progress flex-center" ref="progressContainer">
        <radial-progress-bar
          :diameter="this.progressDiameter"
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
  private progressDiameter: number;
  private resolution: string;

  public constructor() {
    super();
    this.file = null;
    this.progress = 50;
    this.isPlotting = false;
    this.radialProgressAnimateSpeed = 1000;
    this.progressDiameter = 200;
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

  private mounted() {
    window.addEventListener('resize', this.updateProgressDiameter);
    this.updateProgressDiameter();
  }

  private updateProgressDiameter() {
    const progressContainer = this.$refs.progressContainer;
    const contentContainer = this.$refs.contentContainer;

    if (
      progressContainer instanceof Element &&
      contentContainer instanceof Element
    ) {
      const diameter = Math.round(progressContainer.clientWidth * 0.8);

      if (diameter <= contentContainer.clientHeight * 0.5) {
        this.progressDiameter = progressContainer.clientWidth * 0.8;
      }
    }
  }

  private handleFileChange(event: { target: { files: File[] } }) {
    this.file = event.target.files[0];
    this.resolution = this.parseResolution(this.file);
  }

  // TODO: implement parsing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

.file-selector
  width: 100%

  label
    height: 2rem
    width: 100%
    background: $btnColor
    color: white
    cursor: pointer

    &:hover
      background: $btnHoverColor

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
  display: flex
  width: 100%
  margin-top: 2rem

  .icon-wrapper
    width: 50%

    .play
      color: rgb(70, 160, 50)
      cursor: pointer

      &-disabled
        color: rgba(70, 160, 50, 0.2)
        cursor: default

    .stop
      cursor: pointer
      color: red

      &-disabled
        color: rgba(255, 0, 0, 0.2)
        cursor: default
</style>
