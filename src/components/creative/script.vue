<template>
  <div>
    <div class="chooseScript">
      <el-button @click="scriptChange" type="primary">选择创意脚本 </el-button>
      <span class="span_tip">当前:</span><el-tag type="success">999皮炎平</el-tag>
    </div>


    <el-dialog
      append-to-body
      lock-scroll="true"
      center
      :visible.sync="dialogVisible"
      width="900px"
      custom-class="scriptDiag">
      <div slot="title" class="diag-title">
        创意脚本中心
      </div>
      <div class="scriptCard">
        <el-row :gutter="10">
          <el-col class="mt10" :span="6" v-for="item in 8" :key="item">
            <el-card class="card-item" :body-style="{ padding: '0px' }">
              <div class="red-bl">16:{{item}}</div>
              <img src="https://images.magicscorp.com/Mimg/bms/parallax.jpg" class="image">

              <div style="padding: 10px;">
                <span>脚本{{item}}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                  <el-button type="text" class="button">操作按钮</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

      </div>


      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
  export default {
    data(){
      return{
        dialogVisible: false,
        scriptList:[
          {},{},{},{},{},{},{}
        ]
      }
    },
    methods:{
      //选择脚本
      scriptChange(){
        this.dialogVisible = true;
      },

      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }
  }
</script>
<style lang="less" scoped>
  .chooseScript{
    .span_tip{
      margin:0 10px 0 20px;
      font-size: 13px;
      color: gray;
      font-weight: 500;
    }
  }

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
        top: 5px;
        background: red;
        right: -23px;
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
