<template>
  <el-dialog
    append-to-body
    lock-scroll="true"
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
                user_id: cmp_user_id,
                target: 1,
                type: 0
              }"
      :file-list="tempList"
      :on-success="zipSuccess"
      :on-change="zipChange"
      :auto-upload="false"
    >
      <el-button  type='primary' size="small">上传素材</el-button>
    </el-upload>



    <el-tabs type="card">
      <el-tab-pane label="全部素材">
        <div class="scriptCard">
          <el-row :gutter="10">
            <el-col class="mt10" :span="6" v-for="item in 8" :key="item">
              <el-card class="card-item" :body-style="{ padding: '0px' }">
                <div class="red-bl">600:30{{item}}</div>
                <img src="https://images.magicscorp.com/Mimg/bms/parallax.jpg" class="image">

                <div style="padding: 10px;">
                  <el-radio v-model="radioChooseVal" :label="item">素材名称{{item}}</el-radio>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </div>
      </el-tab-pane>
      <el-tab-pane label="图片素材">
        <div class="scriptCard">
          <el-row :gutter="10">
            <el-col class="mt10" :span="6" v-for="item in 4" :key="item">
              <el-card class="card-item" :body-style="{ padding: '0px' }">
                <div class="red-bl">600:30{{item}}</div>
                <img src="https://images.magicscorp.com/Mimg/bms/parallax.jpg" class="image">

                <div style="padding: 10px;">
                  <el-radio v-model="radioChooseVal" :label="item">素材名称{{item}}</el-radio>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </div>
      </el-tab-pane>
      <el-tab-pane label="动效素材">
        <div class="scriptCard">
          <el-row :gutter="10">
            <el-col class="mt10" :span="6" v-for="item in 2" :key="item">
              <el-card class="card-item" :body-style="{ padding: '0px' }">
                <div class="red-bl">600:30{{item}}</div>
                <img src="https://images.magicscorp.com/Mimg/bms/parallax.jpg" class="image">

                <div style="padding: 10px;">
                  <el-radio v-model="radioChooseVal" :label="item">素材名称{{item}}</el-radio>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </div>
      </el-tab-pane>
      <el-tab-pane label="3D素材">
        <div class="scriptCard">
          <el-row :gutter="10">
            <el-col class="mt10" :span="6" v-for="item in 1" :key="item">
              <el-card class="card-item" :body-style="{ padding: '0px' }">
                <div class="red-bl">600:30{{item}}</div>
                <img src="https://images.magicscorp.com/Mimg/bms/parallax.jpg" class="image">

                <div style="padding: 10px;">
                  <el-radio v-model="radioChooseVal" :label="item">素材名称{{item}}</el-radio>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </div>
      </el-tab-pane>
    </el-tabs>




    <span slot="footer" class="dialog-footer">
        <el-button @click="materialVisible = false">取 消</el-button>
        <el-button type="primary" @click="materialVisible = false">确 定</el-button>
      </span>
  </el-dialog>

</template>
<script>
  export default {
    data(){
      return{
        radioMaterial: '图片素材',
        radioChooseVal:'',
        materialVisible: false,
        scriptList:[
          {},{},{},{},{},{},{}
        ],

        tempList:[],


      }
    },
    methods:{
      //素材替换
      materialSelect(item){
        this.materialVisible = true;
      },

      //上传2D zip
      zipChange(file){
        const isLt20M = file.size / 1024 / 1024 < 20;
        const isZip = file.raw.type==='application/zip';
        if(!isZip) {
          this.$message.error('只支持上传 ZIP 格式!');
          return false
        }
        if (!isLt20M) {
          this.$message.error('底图大小不能超过 20MB!');
          return false;
        }
        //2D zip包校验
        var new_zip = new JsZip();
        new_zip.loadAsync(file.raw)
          .then((item)=>{
            console.log('zipfile:',item.files)
            let _atlas = false,_json = false, _png = false;

            let fileObj = Object.values(item.files)
            fileObj.forEach(val=>{
              if(!val.dir){
                //后缀名
                let _hzm = val.name.substr(val.name.lastIndexOf('.')+1)
                if(_hzm==='atlas'){
                  _atlas = true
                }else if(_hzm==='png'){
                  _png = true
                }else if(_hzm==='json'){
                  _json = true
                }
              }
            })
            if(_atlas&&_json&&_png){
              this.$refs.zipUpload.submit();
            }else{
              this.$message.error('请上传包含atlas、json及png的zip压缩文件')
              return false
            }
          })

      },

      zipSuccess(res,file){
        if(res.return_code===1000) {
          // this.template.template_url = res.result.upload_url;
        }else {
          this.$message.error('模版上传失败，请重新上传!');
        }
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


  .diag-title{
    color: white;
    letter-spacing: 2px;
    font-weight: 600;
    font-size: 16px;
  }
  .scriptCard{
    .card-item{
      position: relative;
      .red-bl{
        display: inline-block;
        width: 80px;
        height: 16px;
        position: absolute;
        top: 14px;
        background: #3F51B5;
        right: -19px;
        transform: rotateZ(45deg);
        color: white;
        text-align: center;
        font-size: 13px;
      }
      .image{
        width: 100%;
      }
    }


  }

</style>
