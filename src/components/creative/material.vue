<template>
  <el-dialog
    append-to-body
    :lock-scroll="true"
    center
    :visible.sync="materialVisible"
    width="900px"
    custom-class="scriptDiag">
    <div slot="title" class="diag-title">
      素材中心
    </div>

    <el-upload
      style='margin-bottom:10px'
      ref="zipUpload"
      :action="'https://adserver-dev.magics-ad.com/common_server/client/upload'"
      :data="{
                user_id: user_id,
                target: 1,
                type: 0
              }"
      :file-list="tempList"
      :on-success="zipSuccess"
      :on-change="zipChange"
      :auto-upload="false">
      <el-button  type='primary' size="small">上传素材</el-button>
    </el-upload>



    <el-tabs type="card"  v-model="tabsValue">
      <el-tab-pane label="2D素材" name="0">
        <div class="scriptCard">
          <el-row :gutter="10">
            <el-col class="mt10" :span="4" v-for="(item,index) in imageList" :key="index+'png'">
              <el-card class="card-item" :body-style="{ padding: '0px' }">
                <div @click="selectCard(item)" style="cursor: pointer">
                  <div class="red-bl">{{item.size}}</div>
                  <img :src="item.image_url" class="image">
                  <div class="card_foot">
                    <el-radio v-model="radioChooseVal" :label="item" class="foradio">{{item.name}}</el-radio>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <div style="height: 100px;text-align: center" v-show="imageList.length===0">
            暂无数据
          </div>
        </div>
      </el-tab-pane>
<!--      <el-tab-pane label="动效素材" name="1">-->
<!--        <div class="scriptCard">-->
<!--          <el-row :gutter="10">-->
<!--            <el-col class="mt10" :span="6" v-for="item in 2" :key="item">-->
<!--              <el-card class="card-item" :body-style="{ padding: '0px' }">-->
<!--                <div class="red-bl">600:30{{item}}</div>-->
<!--                <img src="https://images.magicscorp.com/Mimg/bms/parallax.jpg" class="image">-->

<!--                <div style="padding: 10px;">-->
<!--                  <el-radio v-model="radioChooseVal" :label="item">素材名称{{item}}</el-radio>-->
<!--                </div>-->
<!--              </el-card>-->
<!--            </el-col>-->
<!--          </el-row>-->

<!--        </div>-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="3D素材">
        <div class="scriptCard">
          <el-row :gutter="10">
<!--            <el-col class="mt10" :span="6" v-for="item in 1" :key="item">-->
<!--              <el-card class="card-item" :body-style="{ padding: '0px' }">-->
<!--                <div class="red-bl">600:30{{item}}</div>-->
<!--                <img src="https://images.magicscorp.com/Mimg/bms/parallax.jpg" class="image">-->

<!--                <div style="padding: 10px;">-->
<!--                  <el-radio v-model="radioChooseVal" :label="item">素材名称{{item}}</el-radio>-->
<!--                </div>-->
<!--              </el-card>-->
<!--            </el-col>-->
          </el-row>
          <div style="height: 100px;text-align: center">
            暂无数据
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>




    <span slot="footer" class="dialog-footer">
        <el-button @click="materialVisible = false">关 闭</el-button>
        <el-button type="primary" @click="materialConfrim">确 定</el-button>
      </span>
  </el-dialog>

</template>
<script>
  import {requestServices} from "../../api/api";
  import {auth} from '../../api/auth'
  export default {
    data(){
      return{
        user_id:'',
        tabsValue:'0',//当前选中标签
        radioMaterial: '图片素材',
        radioChooseVal:'',
        materialVisible: false,
        imageList:[],
        tempList:[],
        materialSize:'',
      }
    },
    created() {
      this.user_id = auth.getCookie('user_profile').id;
      this.getImageList();
    },
    methods:{
      getImageList(){
        requestServices.imageList({
          user_id: this.user_id,
          type:2,
          is_all:1, //is_all：是否需要公共数据；0-需要；1-不需要
          // format:parseInt(this.tabsValue)
        })
        .then(res=>{
          this.imageList = res.result.images
        })
      },
      //卡片选择图片
      selectCard(item){
        this.radioChooseVal = item;
      },
      //素材替换
      materialSelect(item){
        this.radioChooseVal = '';
        this.materialVisible = true;
      },
      //素材确认
      materialConfrim(){
        if(this.radioChooseVal){
          this.materialVisible = false;
          this.$emit('imageForm',this.radioChooseVal)
        }
      },
      //上传2D zip
      zipChange(file){
        const isLt20M = file.size / 1024 / 1024 < 20;
        const isPng = file.raw.type==='image/png';
        const isJpg = file.raw.type==='image/jpeg';
        const isGif = file.raw.type==='image/gif';
        if(!isPng&&!isJpg) {
          this.$message.error('只支持上传 png/jpg 格式!');
          return false
        }
        if (!isLt20M) {
          this.$message.error('图片素材大小不能超过 20MB!');
          return false;
        }
        this.zipSize(file.raw).then(data=>{
          this.materialSize = data;
          this.$refs.zipUpload.submit();
        });
      },

      zipSuccess(res,file){
        if(res.return_code===1000) {
          this.addImage(res.result.upload_url)
        }else {
          this.$message.error('素材上传失败，请重新上传!');
        }
      },

      zipSize(file) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.readAsDataURL(file); // 必须用file.raw
          reader.onload = () => { // 让页面中的img标签的src指向读取的路径
            let img = new Image();
            img.src = reader.result;
            if (img.complete) { // 如果存在浏览器缓存中
              resolve(img.width+':'+img.height)
            } else {
              img.onload = () => {
                resolve(img.width+':'+img.height)
              }
            }
          };
        })
      },


      addImage(materialUrl){
        requestServices.imageAdd({
          user_id:this.user_id,
          type:2,//0-未知；1-背景；2-2D；3-3D；4-粒子（默认2，一期只有2）
          format:0,//0-图片；1-动效素材 (默认0)
          size:this.materialSize,
          image_url:materialUrl
        }).then((res)=>{
          if(res.return_code===1000) {
            this.getImageList();
            this.$message.success('素材上传成功!');
          }else {
            this.$message.error('素材上传失败，请重新上传!');
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>

  /deep/.el-dialog__header {
    padding: 12px 10px 12px !important;
    box-shadow: 0 2px 8px 2px #a09f9f;
    background: #292961 !important;
  }
  /deep/.el-dialog__headerbtn .el-dialog__close{
    color: white;
    font-size: 18px;
    font-weight: 600;
  }
  /deep/.el-dialog__headerbtn{
    top: 15px!important;
  }
  /deep/.el-dialog--center .el-dialog__body{
    padding: 25px 25px 0px;
  }


  .diag-title{
    color: white;
    letter-spacing: 2px;
    font-weight: 600;
    font-size: 16px;
  }
  .scriptCard{
    height: 350px;
    overflow-y: scroll;
    overflow-x: hidden;
    .card-item{
      position: relative;
      font-size: 0;
      .red-bl{
        display: inline-block;
        width: auto;
        position: absolute;
        top: 5px;
        background: #5c6ed0;
        left: 5px;
        color: white;
        text-align: center;
        font-size: 12px;
        border-radius: 4px;
        padding: 2px 4px;
      }
      .image{
        width: 100%;
        height: 100px;
      }
    }
    .card_foot{
      padding: 5px;
      .foradio{

      }
    }
  }
/deep/.el-radio__label{
  font-size: 12px!important;
}
</style>
