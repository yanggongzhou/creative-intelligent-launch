<template>
  <div class="scriptDiagBox">
    <div class="chooseScript">
      <el-button v-show="!scriptName" @click="scriptChange" type="primary" size="large">选择创意脚本 </el-button>
      <span v-show="scriptName" class="span_tip">当前脚本:</span>
      <el-tag style="cursor: pointer" v-show="scriptName" @click="scriptChange" type="success">{{scriptName}}</el-tag>
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
              <div  @click.stop="selectCard(item)" style="cursor: pointer">
                <div class="red-bl">{{item.size}}</div>
                <img :src="item.preview_url" class="image">

                <div class="card_foot">
                  <el-radio v-model="radioChooseVal" :label="item">{{item.name}}</el-radio>
                  <div class="time">{{item.created_at}}</div>
                </div>
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
  import {auth} from "../../api/auth";

  export default {
    props:{
      creativeList:Array,
      script_id:Number,
    },
    data(){
      return{
        dialogVisible: false,
        scriptList:[],
        radioChooseVal:'',
        scriptName:''
      }
    },
    watch:{
      script_id(value){
        if(this.scriptList.length){
          this.scriptList.forEach(val=>{
            if(val.id===value){
              this.scriptName  = val.name;
              this.radioChooseVal = val;
              this.$emit('scriptForm',val)
            }
          })
        }
      }
    },
    created() {
      this.getScript();
    },

    methods:{
      getScript(){
        requestServices.scriptList({
          user_id:auth.getCookie("user_profile").id
        })
        .then(res=>{
          this.scriptList = res.result.script

          if(!this.$route.query.group_id){
            // this.scriptName = this.scriptList[0].name
            // this.$emit('scriptForm',this.scriptList[0])
          }else{
            let ids=[];
            this.scriptList.forEach(val=>{
              ids.push(val.id);
              if(val.id===this.script_id){
                this.scriptName  = val.name;
                this.$emit('scriptForm',val)
              }
            })
            if(ids.indexOf(this.script_id)===-1){
              // this.$message.warning('当前创意组对应的脚本信息不存在，将无法添加创意')
            }
          }
        })
      },
      //卡片选择脚本
      selectCard(item){
        this.radioChooseVal = item;
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

         if(this.creativeList.length &&this.radioChooseVal.id!==this.script_id){
           this.$confirm('检测到更换创意脚本，创意内容将被清空！是否继续？', '确认信息', {
             distinguishCancelAndClose: true,
             confirmButtonText: '确定替换',
             cancelButtonText: '放弃修改'
           })
             .then(() => {
               this.scriptForm= this.radioChooseVal
               this.$emit('scriptForm',this.radioChooseVal)
               this.$emit('clearCreativeList')
             })
             .catch(action => {
               this.$message({
                 type: 'info',
                 message:
                    '放弃更换脚本文件'
               })
             });

         }else{
           this.scriptForm= this.radioChooseVal
           this.$emit('scriptForm',this.radioChooseVal)
         }
          this.dialogVisible = false;
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .scriptDiagBox{
    padding: 15px;
    background-color: #fff;
  }
  .chooseScript{
    .span_tip{
      margin:0 10px 0 0;
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
      .red-bl{
        display: inline-block;
        width: 100px;
        height: 20px;
        line-height: 20px;
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
        height: 140px;
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

  .bigTitle{
   padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom:.5px solid gainsboro;
    font-size: 16px;
    font-weight: 500;
    color: transparent;
    background-color: black;
    text-shadow: rgba(255,255,255,0.5) 0 5px 6px, rgba(255,255,255,0.2) 1px 3px 3px;
    -webkit-background-clip: text;

  }
</style>
