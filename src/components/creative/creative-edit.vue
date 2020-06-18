<template>
  <div>
    <div>
      <el-button @click="backto" type="text" size="large"> << 返回上一页 </el-button>
    </div>

    <div class="contentBox">
      <div class="bigTitle">选择创意脚本</div>
      <my-script @scriptForm="getScriptForm" @clearCreativeList="clearCreativeList" :creativeList="creativeList" :script_id="script_id"></my-script>

      <div  class="material">
        <div class="bigTitle">创意素材</div>
        <div class="material-card">
          <el-button class="addtab_btn"  v-if="!creativeList.length" type="primary" size="large" icon="el-icon-plus" @click="addTab">添加创意</el-button>
          <el-tabs type="card"
                   v-if="creativeList.length"
                   v-model="editableTabsValue"
                   closable
                   @tab-click="foucsTab"
                   @tab-remove="removeTab"
                   @tab-add="addTab" editable>
            <el-tab-pane
              v-for="(val,ind) in creativeList"
              :key="ind+'tab'"
              :name="val.tabId">
              <span slot="label">
                创意{{ind | indFilter}}
              </span>
              <div class="tabContent">
                <el-row :gutter="0">
                  <el-col :span="16">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" >
                    <div>
                      <span class="vintage">创意名称:</span><br>
                      <el-form-item label-width="0" prop="creative_name">
                        <el-input v-model="val.name" max="10" class="w50 mtb10" placeholder="请输入创意名称"></el-input>
                      </el-form-item>

                    </div>

                    <span class="vintage">素材区:</span>
                    <div class="scriptCard mtb10">
                      <el-row :gutter="10">
                        <div v-for="(item,index) in val.images" :key="index+'scr'">
                          <el-col class="mt10" :span="8" v-if="item.isReplaceable===1" >
                            <el-card class="card-item" :body-style="{ padding: '0px' }">
                              <div class="bgImage" @click.stop="materialSelect(item)">
                                <img style="width: 100%;height: 100%;" class="image" :src="item.image_url" alt="">
                                <div class="bgImage_spine">点击更换图片<br>{{item.size}}</div>
                              </div>
                              <!--                        <div class="red-bl">16:{{item}}</div>-->
                              <!--                        <img src="https://images.magicscorp.com/Mimg/bms/parallax.jpg" class="image">-->

                              <div style="padding: 10px;font-size: 13px;text-align: center">
                                <span>{{item.name}}</span>
                              </div>
                            </el-card>
                          </el-col>
                        </div>

                      </el-row>

                    </div>

                    <span class="vintage">文本声音:</span>
                    <div>
                      <el-tag class="mtb10" type="info">模块开发中...</el-tag>
                    </div>

                    <span class="vintage">设置定向:</span>


                      <div class="directional mtb10">
                        <el-form-item label="性别" prop="gender">
                          <el-select v-model="val.gender" placeholder="请选择" class="w50">
                            <el-option label="不限" value="0"></el-option>
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="地域" prop="areaRadio">
<!--                          <el-select v-model="val.areaRadio" placeholder="请选择" class="w50">-->
<!--                            <el-option label="不限" value="0"></el-option>-->
<!--                            <el-option label="选择城市" value="1"></el-option>-->
<!--                          </el-select>-->

                          <el-radio-group @change="rad=>radioChange(rad,ind)" v-model="ruleForm.areaRadio">
                            <el-radio label="0">不限</el-radio>
                            <el-radio label="1">选择城市</el-radio>
                          </el-radio-group>
                          <el-cascader-panel
                            v-show="val.areaRadio==='1'"
                            class="cascader_panel"
                            @change="cascaderChange(ind)"
                            v-model="val.cascaderArea"
                            :options="areaData"
                            :props="{ multiple: true ,value:'id',label:'label'}"
                            clearable></el-cascader-panel>
                        </el-form-item>
                        <el-form-item label="时间" class="w50">
                          <el-col :span="11">
                            <el-form-item prop="timeArea">
                              <el-select v-model="val.start_time" @change="startChange" placeholder="开始时间">
                                <el-option
                                  v-for="item in startOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  :disabled="item.disabled">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col class="line" :span="2">
                            <div style="width: 100%; text-align: center">--</div>
                          </el-col>
                          <el-col :span="11">
                            <el-form-item prop="timeArea">

                              <el-select v-model="val.end_time" placeholder="开始时间">
                                <el-option
                                  v-for="item in endOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  :disabled="item.disabled">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-form-item>
                      </div>

                    </el-form>



                  </el-col>
                  <el-col :span="8">
                    <span class="vintage">预览区:</span>
                    <div class="previewBox">
                      预览区
                    </div>
                  </el-col>
                </el-row>
              </div>

            </el-tab-pane>
          </el-tabs>
        </div>

        <el-form inline label-width="100px" class="lastForm">
          <el-form-item label="落地页链接">
            <el-input v-model="landing_page_url"></el-input>
          </el-form-item>
          <el-form-item label="创意组名称">
            <el-input v-model="group_name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" :loading="isLoading" @click="submitForm">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <my-material ref="myMaterial" @imageForm="getImageForm"></my-material>
    <my-loading v-if="isLoading" :saveLoading="saveLoading"></my-loading>
  </div>
</template>
<script>
  import {requestServices} from "../../api/api";
  import script from "./script";
  import material from "./material";
  import {auth} from "../../api/auth";
  import axios from 'axios'
  import loading from '../common/loading'
  export default {
    components:{
      'my-script':script,
      'my-material':material,
      'my-loading':loading
    },
    data(){
      var self = this;
      var validateCreative_name = (rule, value, callback) => {
        let _value = self.creativeList[parseInt(self.editableTabsValue)].name
        if (_value === '') {
          callback(new Error('请输入创意名称'));
        } else {
          callback();
        }
      };
      return{
        isLoading:false,
        saveLoading:false,
        user_id:'',
        startOptions:[],//开始时间选项
        endOptions:[],//结束时间选项

        scriptForm:'',//脚本对应的素材
        scriptFormImagesItem:'', //当前选中要替换的素材
        scriptFormImagesIndex:'',//当前选中要替换的素材的索引

        editableTabsValue:'0',//当前创意标签

        script_id:0,// 脚本ID
        creativeList:[],

        group_name:'',// 组名称
        landing_page_url:'',// 落地页

        areaData:[],//地域数据
        ruleForm: {
          areaRadio:'0'
        },
        rules: {
          creative_name:[
            { validator: validateCreative_name, trigger: 'blur' }
          ]
        },

      }
    },
    filters:{
      indFilter(val){
        return val+1
      }
    },
    created() {
      this.user_id = auth.getCookie('user_profile').id;
      //开始结束时间的数据
      for(let i=0;i<=23;i++){
        this.startOptions.push({
          value:i,
          label:i+':00'
        })
      }
      for(let j=1;j<=24;j++){
        this.endOptions.push({
          value:j,
          label:j+':00'
        })
      }
      //修改创意组数据时
      if(this.$route.query.group_id){
        this.isLoading=true;
        this.saveLoading=false;
        this.getAreaData(true);
      }else{
        this.getAreaData(false);
      }
    },
    mounted() {
      window.onbeforeunload = function () {
        return "退出?";
      };
    },
    beforeDestroy() {
      window.onbeforeunload=null;
    },
    methods:{
      foucsTab(val){
        this.ruleForm.areaRadio = this.creativeList[parseInt(val.name)].areaRadio
      },
      radioChange(rad,ind){
        this.creativeList[ind].areaRadio = rad;
        this.$forceUpdate()
      },

      //获取创意组详情
      getSingleZu(){
        requestServices.SingleZu({
          user_id:this.user_id,
          group_id:this.$route.query.group_id
        }).then(res=>{
          this.script_id = res.result.groups.script_id
          this.creativeList = res.result.groups.creative
          this.group_name = res.result.groups.name
          this.landing_page_url = res.result.groups.landing_page_url
          this.creativeList.forEach((val,ind)=>{
            this.creativeList[ind].tabId = ind+'';
            if(val.area==="0"){
              this.creativeList[ind].areaRadio="0";
              this.creativeList[ind].cascaderArea=[];
            }else{
              this.creativeList[ind].cascaderArea=[];
              val.area.split(',').forEach(value=>{
                this.areaData.forEach(i=>{
                  i.children.forEach(j=>{
                    if(parseInt(value)===j.id){
                      this.creativeList[ind].cascaderArea.push([i.id,j.id])
                    }
                  })
                })

              })
              this.creativeList[ind].areaRadio = "1";
              // console.log(this.creativeList)
            }
          })
        }).then(()=>{
          this.isLoading=false;
          this.ruleForm.areaRadio = this.creativeList[0].areaRadio;
        })

      },


      //地域选择
      cascaderChange(ind){
        let creativeItem = this.creativeList[ind],_arr=[];
        creativeItem.area = '';
        creativeItem.cascaderArea.forEach(val=>{
          _arr.push(val[1])
        })
        creativeItem.area = _arr.join(',')
      },
      getAreaData(bool){
        if(bool){
          requestServices.areaList()
            .then(res=>{
              this.areaData = res;
              this.getSingleZu()
            })
        }else{
          requestServices.areaList()
            .then(res=>{
              this.areaData = res;
            })
        }
      },
      //开始时间改变
      startChange(val){
        this.creativeList[parseInt(this.editableTabsValue)].end_time=''
        this.endOptions.forEach(item=>{
          item.disabled=false;
          if(item.value<=val){
            item.disabled=true;
          }
        })
      },
      //清空创意
      clearCreativeList(){
        this.creativeList = [];
      },
      //脚本组件传值
      getScriptForm(val){
        this.scriptForm = val;
        this.script_id = val.id
        console.log('this.script_id',this.script_id)
      },
      //创意移除
      removeTab(val){
        if(this.editableTabsValue === (this.creativeList.length-1+'')){
          this.editableTabsValue =this.creativeList.length-2+''
        }
        this.creativeList.splice(parseInt(val),1)
        this.creativeList.forEach((j,i)=>{
          j.tabId = i+''
          // j.name = '创意'+j.tabId
        })
      },
      addTab(){
        if(!this.scriptForm){
          this.$message.info('请先选择创意脚本');
          return false
        }
        console.log(this.scriptForm.images)
        this.creativeList.push(
          {
            name:'',
            tabId:this.creativeList.length+'',
            gender: "0",            // 性别；0-不限；1-男；2-女
            area: "0",            // 地区；传ID；0-不限
            start_time: 8,      // 起始时间；0-24；以小时为单位
            end_time: 9,
            config_url: this.scriptForm.config_url,
            images: JSON.parse(JSON.stringify(this.scriptForm.images)),

            areaRadio:"0",//不限or地域选择
            cascaderArea:[],//地域绑定值
          },
        )

        this.editableTabsValue = this.creativeList.length-1+''
      },
      //素材替换
      materialSelect(item){
        this.scriptFormImagesItem = item;
        this.scriptFormImagesIndex = item.index;
        this.$refs.myMaterial.materialSelect()
      },
      //素材确认
      getImageForm(item){
        let scriptJson;
        axios.get(this.creativeList[parseInt(this.editableTabsValue)].config_url).then(res=>{
          scriptJson = res.data
          scriptJson.param[this.scriptFormImagesIndex].id=item.id
          scriptJson.param[this.scriptFormImagesIndex].name = item.name;
          this.saveJson(scriptJson);
        })

        //修改本创意显示的素材
        let imgItem = JSON.parse(JSON.stringify(item)),imgList=this.creativeList[parseInt(this.editableTabsValue)].images;
        imgItem.index = this.scriptFormImagesIndex;
        imgItem.isReplaceable = imgList[this.scriptFormImagesIndex].isReplaceable;
        delete imgItem.format;

        this.creativeList[parseInt(this.editableTabsValue)].images.splice(this.scriptFormImagesIndex,1,imgItem)
      },

      //上传json文件修改config_url;
      saveJson(data) {
        var content = JSON.stringify(data);
        var blob = new Blob([content], { type: "text/plain;charset=utf-8" }); // 把数据转化成blob对象
        // console.log(blob, "blob");
        let file = new File([blob], "config.json", { lastModified: Date.now() }); // blob转file
        // console.log(file);

        var fd = new FormData();
        fd.append("file", file);
        fd.append("user_id", this.user_id);
        fd.append("target", 1);
        fd.append("type", 0);

        requestServices.uploadFile(fd)
          .then(res=>{
            this.creativeList[parseInt(this.editableTabsValue)].config_url = res.result.upload_url;
          })
      },

      submitForm(formName) {

        let self = this;
        this.isLoading = true;
        this.saveLoading = true;
        // setTimeout(()=>{
        //   self.isLoading = false
        // },1000)

        let _creative=[];
        this.creativeList.forEach(value=>{
          let _images=[];
          value.images.forEach(val=>{
            _images.push({
              id:val.id,
              isReplaceable:val.isReplaceable,
              index:val.index
            })
          })
          if(value.areaRadio==="1"){
            _creative.push({
              name:value.name,
              gender:value.gender,
              area:value.area,
              start_time:value.start_time,
              end_time:value.end_time,
              config_url: value.config_url,    // 配置文件链接
              images:_images
            })
          }else{
            _creative.push({
              name:value.name,
              gender:value.gender,
              area:'0',
              start_time:value.start_time,
              end_time:value.end_time,
              config_url: value.config_url,    // 配置文件链接
              images:_images
            })
          }
        })
        if(this.$route.query.group_id){
          requestServices.editZu({
            group_id: this.$route.query.group_id,
            user_id:this.user_id,
            group_name:this.group_name,
            script_id:this.script_id,
            landing_page_url:this.landing_page_url,
            creative:_creative
          }).then(res=>{
            if(res.return_code===1000){
              this.$message.success('修改成功...')
              this.isLoading= false;
              this.$router.push({name:'creative-list'})
            }
          })
        }else{
          requestServices.addZu({
            user_id:this.user_id,
            group_name:this.group_name,
            script_id:this.script_id,
            landing_page_url:this.landing_page_url,
            creative:_creative
          }).then(res=>{
            if(res.return_code===1000){
              this.$message.success('保存成功...')
              this.isLoading= false;
              this.$router.push({name:'creative-list'})
            }
          })
        }


        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
        //
        //   } else {
        //     // this.$message.error("表单未验证通过，提交失败！")
        //     return false;
        //   }
        // });
      },

      //返回上一页
      backto(){
        if(this.script_id){
          this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定跳转',
            cancelButtonText: '放弃跳转'
          })
            .then(() => {
              this.$router.push({name:"creative-list"})
            })
            .catch(action => {
              this.$message({
                type: 'info',
                message:
                  '停留在当前页面'
              })
            });
        }else{
          this.$router.push({name:"creative-list"})
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .contentBox{
    margin-bottom: 50px;
    .material{
      .material-card{
        background: #fff;
        min-height: 200px;
        padding: 15px;
        position: relative;
        .addtab_btn{
          position: absolute;
          top: calc(50% - 20px);
          left: calc(50% - 60px);
        }
        .tabContent{
          min-width: 950px;
          .scriptCard {
            max-height: 390px;
            min-height: 200px;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: 10px;
            border: 1px solid gainsboro;
            width: 600px;
            .card-item {
              position: relative;
              .bgImage{
                position: relative;
                width: 100%;
                height: 140px;
                /*background: url("https://images.magicscorp.com/Mimg/bms/parallax.jpg") no-repeat;*/
                /*background-size:cover ;*/
                .bgImage_spine{
                  position: absolute;
                  z-index: 11;
                  top: 0;
                  text-align: center;
                  width: 100%;
                  height: 100%;
                  background-color: #1c2a44ab;
                  opacity: 0;
                  color: white;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.5s;
                  cursor: pointer;
                }
                &:hover .bgImage_spine{
                  opacity: 0.9;
                }
              }
              /*.red-bl {*/
              /*  display: inline-block;*/
              /*  width: 80px;*/
              /*  height: 16px;*/
              /*  position: absolute;*/
              /*  top: 5px;*/
              /*  background: red;*/
              /*  right: -23px;*/
              /*  transform: rotateZ(45deg);*/
              /*  color: white;*/
              /*  text-align: center;*/
              /*  font-size: 13px;*/
              /*}*/

              /*.image {*/
              /*  width: 100%;*/
              /*}*/
            }
          }

          .directional{
            /*width: 50%;*/
            .cascader_panel{
              width: 360px;
            }
          }

          .previewBox{
            width: 300px;
            height: 450px;
            border: 1px dashed #9E9E9E;
            margin: 10px auto;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }


      }
    }
  }
  .vintage {
   color: #333;
    letter-spacing: 0.04em;
    font-size: 16px;
    font-weight: 600;
  }
  .tabtip{
    margin: 5px 0 0 100px;
    font-size: 13px;
    color: #de6d6d;
  }
  .bigTitle{
    margin:10px 0;
    font-size: 20px;
    font-weight: 500;
    color: transparent;
    background-color: black;
    text-shadow: rgba(255,255,255,0.5) 0 5px 6px, rgba(255,255,255,0.2) 1px 3px 3px;
    -webkit-background-clip: text;
  }
  .lastForm{
    padding-top: 20px;
    background: #fff;
    margin-top: 20px;
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

  /deep/.el-tabs__content{
    padding: 15px;
    border-right: .5px solid #e0e0e0;
    border-bottom: .5px solid #e0e0e0;
    border-left: .5px solid #e0e0e0;
  }
  /deep/.el-tabs__header{
    margin: 0;
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

  /deep/.el-tabs__new-tab{
    background-color: #2196F3;
    padding: 5px;
    margin: 0;
    border: 1px solid #2196F3;
    color: #fff;
    font-size: 20px;
    &:hover{
      background-color: #3a74a2;
    }
  }
</style>
