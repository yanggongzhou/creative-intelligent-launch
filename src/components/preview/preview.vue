<!--vue预览-->
<template>
  <div>
<!--    预览框-->
    <div class="previewBox"
    :style="{
      width:previewWidth+'px',
      height:previewHeight+'px',
    }">
      <transition  v-for="(item,ind) in animateData"
                   :key="ind+'ani'"
                   enter-active-class="animated fadeIn"
                   leave-active-class="animated fadeOut"
                   :duration="{enter: 60, leave: 60}">
        <div
          v-show="item.isShow"
          style="position: absolute"
          :style="{
          width:previewWidth*item.width+'px',
          height:previewHeight*item.height+'px',
          transform: 'scale('+item.scale+')'+' rotate('+item.rotation+'deg)'+' rotateY('+item.isMirror?180:0 +'deg)',
          top: previewHeight*item.pos.y+'px',
          left: previewWidth*item.pos.x+'px',
          'z-index':item.zIndex
        }">
          <img :src="item.content" class="preview-img" alt="">
        </div>
      </transition>
    </div>

  </div>
</template>

<script>
  import { requestServices } from "../../api/api";
  import progress from "./progress";
  import JSZip from 'jszip';
  import JSZipUtils from 'jszip-utils';
  import timer from "../../api/timer";
  import axios from 'axios'
  export default{
    components:{
      'my-progress':progress
    },
    props:{
      previewObj:Object,
    },
    data(){
      return{
        time:'',//总时长
        name:'',//文件名

        previewWidth:633,
        previewHeight:356,

        animateData:[],//动画数据
        StopIcon:false,
      }
    },
    watch:{
      previewObj: {
        handler(newValue, oldValue) {
          let self = this;
          this.animatePreview()
        },
        deep: true
      }
    },
    created() {
    },
    mounted() {
      this.animatePreview()
    },
    methods:{
      animatePreview(){
        let self = this;
        console.log('previewObj',this.previewObj.images)
        return new Promise(resolve => {
          axios.get(this.previewObj.config_url).then(res=>{
            // 画布尺寸
            if(res.data.scene_width==='9'&&res.data.scene_height==='16'){
              self.previewWidth = 200.25
              self.previewHeight = 356
            }else{
              self.previewWidth = 633
              self.previewHeight = 356
            }
            //渲染数据，添加content or url
            let _animateData = JSON.parse(JSON.stringify(res.data.param))
            _animateData.forEach((ani,aniInd)=>{
              // ani.isShow = true ;//用于元素显示时间
              self.previewObj.images.forEach(val=>{
                if(ani.id===val.id){
                  _animateData[aniInd].content = val.image_url
                }
              })
            })
            self.animateData = JSON.parse(JSON.stringify(_animateData));
            resolve(self.animateData,res.data.time)
            self.time = res.data.time
            console.log('当前画布的渲染数据',self.animateData)
          })
        })
      },


      //渲染动画
      renderingAnimation(){
        let self = this;
        self.animateData.forEach((ani,ind)=>{
          timer.setTimeout(()=>{
            ani.isShow = true;
            self.$forceUpdate()
          },  self.animateData[ind].startTime);
          timer.setTimeout(()=>{
            ani.isShow = false
            self.$forceUpdate()
          }, ani.endTime);
        })

        //计时播放总时间
        timer.setTimeout(()=>{
          self.stopIcon=false;
          // timer.clean();
          console.log(self.animateData)
        }, self.time)
        // timer.pauseAll();

      },
      //预览
      previewBtn(){
        this.renderingAnimation();

        // if(this.StopIcon){
        //   this.stopIcon=false;
        //   timer.pauseAll()
        //   return false
        // }else{
        //   this.stopIcon=true;
        //   timer.playAll()
        // }
      },
    }
  }
</script>
<style lang="less" scoped>
  .previewBox{
    background: white;
    border-radius: 3px;
    margin: 0 auto;
    position: relative;

  }
  .preview-img{
    width: 100%;
    height: 100%;
  }


</style>
