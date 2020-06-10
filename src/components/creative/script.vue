<template>
  <div class="scriptDiagBox">
    <div class="chooseScript">
      <el-button @click="scriptChange" type="primary">选择创意脚本 </el-button>
      <span class="span_tip">当前脚本:</span><el-tag v-show="scriptName" type="success">{{scriptName}}</el-tag>
    </div>

    <el-dialog
      append-to-body
      :lock-scroll="true"
      center
      :visible.sync="dialogVisible"
      width="900px"
      custom-class="scriptDiag">
      <div slot="title" class="diag-title">
        创意脚本中心
      </div>
      <div class="scriptCard">
        <el-row :gutter="10">
          <el-col class="mt10" :span="6" v-for="(item,index) in scriptList" :key="index+'script'">
            <el-card class="card-item" :body-style="{ padding: '0px' }">
              <div class="red-bl">{{item.size}}</div>
              <img src="https://images.magicscorp.com/Mimg/bms/parallax.jpg" class="image">

              <div class="card_foot">
                <el-radio v-model="radioChooseVal" :label="item">{{item.name}}</el-radio>
                <div class="time">{{item.created_at}}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

      </div>


      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="scriptConfrim">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
  import {requestServices} from "../../api/api";

  export default {
    props:{
      script_id:Number
    },
    data(){
      return{
        dialogVisible: false,
        scriptList:[],
        radioChooseVal:'',

        scriptName:''
      }
    },
    created() {
      this.getScript()
    },
    watch:{
      script_id(value){
        this.scriptList.forEach(val=>{
          if(val.id===value){
            this.scriptName  =val.name;
          }
        })
      }
    },
    methods:{
      getScript(){
        requestServices.scriptList({
          user_id:JSON.parse(window.sessionStorage.getItem("user_profile")).id,
        })
        .then(res=>{
          this.scriptList = res.result.script

          if(!this.$route.query.group_id){
            this.scriptName = this.scriptList[0].name
            this.$emit('scriptForm',this.scriptList[0])
          }
        })
      },

      //选择脚本
      scriptChange(){
        this.dialogVisible = true;
      },
      //弹框确认
      scriptConfrim(){
        if(!this.radioChooseVal){
          this.$message.error('请选择创意脚本')
        }else{
          this.dialogVisible = false;
          this.scriptForm= this.radioChooseVal
          this.scriptName = this.scriptList[0].name
          this.$emit('scriptForm',this.radioChooseVal)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .scriptDiagBox{
    padding: 8px;
    border: 1px solid #7ab5e4;
    border-radius: 5px;
  }
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
        width: 100px;
        height: 16px;
        position: absolute;
        top: 17px;
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
      .card_foot{
        padding: 10px;
        .name{
          font-size: 14px;
        }
        .time{
          font-size: 12px;
          color: #546179;
          text-align: right;
        }
      }
    }


  }
</style>
