<template>
  <div class="progressBox">

    <progress-bar leftBg="#5778fb" bgc="rgba(0,0,0,.5)" ballBgc="#3F51B5" :percent="percent"
                  @pbar-drag="drag" @pbar-seek="seek"></progress-bar>

    <div class="showCurrentMiao">当前秒数：{{showCurrentMiao}}s</div>

    <button type="button" @click="btnClick">播放</button>
  </div>
</template>

<script>

  import ProgressBar from './ProgressBar.vue';
  export default {
    name: '',
    data: function () {
      return {
        miao: 10,
        currentMiao: 0,
        percent: 0,
        stopRAF:'',
        showPercent:0,
        showCurrentMiao:0,
      }
    },
    watch: {
      currentMiao(cur, old){
        if(cur>this.miao){
          this.currentMiao = this.miao
        }
        this.percent = cur / this.miao * 100;
        this.showCurrentMiao = Math.round(cur)
        this.showPercent = Math.round(cur / this.miao * 100)
      }
    },
    computed: {
    },
    methods: {
      drag(percent){
        this.currentMiao = percent / 100 * this.miao;
      },
      seek(percent){
        this.currentMiao = percent / 100 * this.miao;
      },
      btnClick(){
        let self = this;
        if(this.currentMiao>=this.miao){
          this.currentMiao=0
        }

        this.currentMiao +=0.06;
        let stopRAF = requestAnimationFrame(this.btnClick)
        if(this.currentMiao>=this.miao){
          console.log('stop')
          cancelAnimationFrame(stopRAF)
        }

      }
    },
    components: {
      'progress-bar': ProgressBar,
    },
    mounted(){
      //this.percent = Number((this.currentMiao / this.miao * 100).toFixed(3));
      this.percent = this.currentMiao / this.miao * 100;
    },
  }
</script>

<style scoped>
  .progressBox{
    width: calc(100% - 61px);
    position: relative;
  }
  .showCurrentMiao{
    position: absolute;
    top: -20px;
  }
</style>
