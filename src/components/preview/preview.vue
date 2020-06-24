<!--vue预览-->
<template>
  <div>
<!--    <div>-->
<!--      总时长：{{time}}s <br/>-->
<!--      文件名：{{name}}<br/>-->
<!--    </div>-->

<!--    预览框-->
    <div class="previewBox"
    :style="{
      width:previewWidth+'px',
      height:previewHeight+'px',
    }">
<!--      <div class="play-stop-icon" @click="previewBtn">-->
<!--        <i class="playicon" :class="{'el-icon-video-play':stopIcon,'el-icon-video-pause':!stopIcon}"></i>-->
<!--      </div>-->
<!--      :duration="{enter: 60, leave: 60}"-->
<!--      'animation-delay': item.startTime/1000+'s',-->
<!--      'animation-duration': '0s',-->
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
          'z-index':item.zIndex,
        }">
          <img :src="item.content" class="preview-img" alt="">
        </div>
      </transition>
    </div>

  </div>
</template>

<script>
  import progress from "./progress";
  import JSZip from 'jszip';
  import JSZipUtils from 'jszip-utils';
  import timer from "../../api/timer";
  export default{
    components:{
      'my-progress':progress
    },
    data(){
      return{
        zipUrl:'https://large.magics-ad.com/ad-animation/1592551196110944.zip',


        time:'',//总时长
        name:'',//文件名

        imgList:[],//zip全部图片素材
        previewWidth:800,
        previewHeight:450,

        jsonContent:'',//zip的JSON文件
        zipFileLength:'',//zip-files的长度
        animateData:[],//动画数据

      }
    },
    watch:{
      imgList(val){
        if(val.length===this.zipFileLength-1){
          this.animatePreview()
        }
      }
    },
    created() {
      this.getZip()
    },
    methods:{
      beforeEnter: function(el) {
        var delay = el.getAttribute("animate-delay"),
          duration = el.getAttribute("animate-duration");
        console.log("attr:" + delay, duration);
        var cssObj = {
          "animation-delay": delay,
          "-webkit-animation-delay": delay,
          "animation-duration": duration,
          "-webkit-animation-duration": duration,
          "visibility": "visible"
        }
        var getCssText = function(obj) {
          var text = [];
          for(var o in obj) {
            text.push(o + ":" + obj[o])
          }
          return text.join(";")
        }
        el.style.cssText = getCssText(cssObj);
      },
      getZip(){
        let self = this;
        JSZipUtils.getBinaryContent(this.zipUrl, function(err, data) {
          if(err) {
            throw err;
          }
          JSZip.loadAsync(data).then((zip)=> {
            console.log('全部文件',zip)
            self.zipFileLength=Object.keys(zip.files).length
            for (let key in zip.files) {
              if (!zip.files[key].dir) {// 判断是否是目录

                if (/\.(png|jpg|jpeg|gif)$/.test(zip.files[key].name)) { // 判断是否是图片格式
                  let base = zip.file(zip.files[key].name).async('base64') // 将图片转化为base64格式
                  base.then(res => {
                    self.imgList.push({
                      fileName: zip.files[key].name,
                      type: 'img',
                      content: `data:image/png;base64,${res}`
                    })
                  })
                }

                if (/\.(json)$/.test(zip.files[key].name)) { // 判断是否是json文件
                  let base = zip.file(zip.files[key].name).async(
                    'string') // 以字符串形式输出文本内容
                  base.then(res => {
                    self.jsonContent = JSON.parse(res);
                  })
                }
              }
            }

          })
        })
      },
      animatePreview(){
        let self = this;
        console.log('当前画布的JSON数据',this.jsonContent)
        // 画布尺寸
        if(this.jsonContent.scene_width==='9'&&this.jsonContent.scene_height=='16'){
          this.previewWidth = 300
          this.previewHeight = 533
        }else{
          this.previewWidth = 300
          this.previewHeight = 168.75
        }
        //渲染数据，添加content or url
        this.animateData = Object.assign([],this.jsonContent.param)
        this.animateData.forEach(ani=>{
          ani.isShow = false;//用于元素显示时间
          this.imgList.forEach(val=>{
            if(ani.name===val.fileName){
              ani.content = val.content
            }
          })
        })
        console.log('当前画布的渲染数据',this.animateData)
      },
      //预览
      previewBtn(){
        let self = this;
        this.animateData.forEach((ani,ind)=>{

          setTimeout(()=>{
            self.animateData[ind].isShow = true;
            self.$forceUpdate()
          }, ani.startTime,ani.id);
          setTimeout(()=>{
            self.animateData[ind].isShow = false
          }, ani.endTime,ani.id);
        })
      },

    }
  }
</script>
<style lang="less" scoped>
  .previewBox{
    /*width: 800px;*/
    /*height: 450px;*/
    background: white;
    border-radius: 3px;
    margin: 0 auto;
    position: relative;
    /*.play-stop-icon{*/
    /*  position: absolute;*/
    /*  font-size: 50px;*/
    /*  height: 100%;*/
    /*  width: 100%;*/
    /*  display: flex;*/
    /*  align-items: center;*/
    /*  justify-content: center;*/
    /*  cursor: pointer;*/
    /*  transition: all .5s;*/
    /*  z-index: 9999;*/
    /*  .playicon{*/
    /*    opacity: 0;*/
    /*    color: #2296f3;*/
    /*    transition: opacity .5s;*/
    /*  }*/
    /*  &:hover .playicon{*/
    /*    opacity: 1;*/
    /*    color: #cee8fd;*/
    /*  }*/
    /*}*/
    /*&:hover .play-stop-icon{*/
    /*  background: #0000005e;*/
    /*}*/
  }
  .preview-img{
    width: 100%;
    height: 100%;
  }


</style>
