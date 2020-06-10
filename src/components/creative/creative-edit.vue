<template>
  <div>
    <el-button @click="backto" type="text"> << 返回上一页 </el-button>
    <div class="contentBox">
      <div class="bigTitle">选择创意脚本</div>
      <my-script @scriptForm="getScriptForm" :script_id="script_id"></my-script>

      <div class="material">
        <div class="bigTitle">创意素材</div>
        <div class="material-card">
          <el-tabs type="card" v-model="editableTabsValue" closable @tab-remove="removeTab" @tab-add="addTab" editable>
            <el-tab-pane
              v-for="(val,ind) in creativeList"
              :key="ind+'tab'"
              :name="val.tabId">
              <span slot="label">
                {{val.name}}
              </span>
              <div class="tabContent">
                <el-row :gutter="20">
                  <el-col :span="16">
                    <div>
                      <span class="vintage">创意名称:</span><br>
                      <el-input v-model="val.title" max="10" class="w50 mtb10" placeholder="请输入创意名称"></el-input>
                    </div>

                    <span class="vintage">素材区:</span>
                    <div class="scriptCard mtb10">
                      <el-row :gutter="10">
                        <el-col class="mt10" :span="8" v-for="(item,index) in val.images" :key="index+'scr'">
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
                      </el-row>

                    </div>

                    <span class="vintage">文本声音:</span>
                    <div>
                      <el-tag class="mtb10" type="info">模块开发中...</el-tag>
                    </div>

                    <span class="vintage">设置定向:</span>

                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" class="directional mtb10">
                      <el-form-item label="性别" prop="name">
                        <el-select v-model="val.gender" placeholder="请选择" class="w100">
                          <el-option label="不限" :value="0"></el-option>
                          <el-option label="男" :value="1"></el-option>
                          <el-option label="女" :value="2"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="地域" prop="experience">
                        <el-select v-model="ruleForm.experience" filterable multiple placeholder="请选择" class="w100">
                          <el-option label="不限" value="不限"></el-option>
                          <el-option label="北京" value="男"></el-option>
                          <el-option label="天津" value="女"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="时间" required>
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
                        <el-col class="line" :span="2">-</el-col>
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
            <el-button type="success">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>



    <my-material ref="myMaterial" @imageForm="getImageForm"></my-material>
  </div>
</template>
<script>
  import {requestServices} from "../../api/api";
  import script from "./script";
  import material from "./material";
  import {auth} from "../../api/auth";
  export default {
    components:{
      'my-script':script,
      'my-material':material
    },
    data(){
      return{
        startOptions:[],//开始时间选项
        endOptions:[],//结束时间选项

        scriptForm:'',//脚本对应的素材
        scriptFormImagesItem:'', //当前选中要替换的素材

        editableTabsValue:'1',//当前创意标签

        script_id:0,// 脚本ID
        creativeList:[
          {
            name:'创意1', // 创意名称
            tabId:"1",
            gender: 0,            // 性别；0-不限；1-男；2-女
            area: "3",            // 地区；传ID；0-不限
            start_time: "3:00",      // 起始时间；0-24；以小时为单位
            end_time: "6:00",        // 结束时间；0-24；以小时为单位 结束时间要比起始时间大
            config_url: "https://xxx",    // 配置文件链接
            images: [
              {
                id: 1,
                image_url: "https://small.magics-ad.com/ad/20190611/95de21e4c66d7415487406935eaddb37f5cec6b6.png",
                size: "1:1",
              },
              {
                id: 2,
                image_url: "https://magics-large.oss-cn-beijing.aliyuncs.com/ad/20190513/ZIPPO.png",
                size: "2:2",
              },
              {
                id: 3,
                image_url: "https://magics-large.oss-cn-beijing.aliyuncs.com/ad/20190513/%E5%9B%BE%E7%89%87/O1CN01G6eaJ41gUufTzvRbd_!!4280074146.jpg",
                size: "3:3",
              }

              ],   // 素材资源ID
          },
        ],
        group_name:'',// 组名称
        landing_page_url:'',// 落地页

        ruleForm: {
          name: '',
          experience: "",
          timeArea:'',
        },
        rules: {

        },

      }
    },
    created() {
      //开始结束时间的数据
      for(let i=0;i<=23;i++){
        this.startOptions.push({
          value:i,
          label:i+':00'
        })
      }
      for(let j=1;j<24;j++){
        this.endOptions.push({
          value:j,
          label:j+':00'
        })
      }
      //修改创意组数据时
      if(this.$route.query.group_id){
       requestServices.SingleZu({
         user_id:auth.getCookie('user_profile').id,
         group_id:this.$route.query.group_id
       }).then(res=>{
         this.script_id = res.result.groups.script_id
         this.creativeList = res.result.groups.creative
         this.group_name = res.result.groups.name
         this.landing_page_url = res.result.groups.landing_page_url
         this.creativeList.forEach((val,ind)=>{
           val.tabId = ind+1+'';
         })
       })
      }
    },
    methods:{
      //开始时间改变
      startChange(val){
        this.creativeList[parseInt(this.editableTabsValue)-1].end_time=''
        this.endOptions.forEach(item=>{
          item.disabled=false;
          if(item.value<=val){
            item.disabled=true;
          }
        })
      },
      //脚本组件传值
      getScriptForm(val){
        this.scriptForm = val;
      },

      //创意移除
      removeTab(val){
        if(this.editableTabsValue === (this.creativeList.length+'')){
          this.editableTabsValue =this.creativeList.length-1+''
        }
        this.creativeList.splice((parseInt(val)-1),1)
        this.creativeList.forEach((j,i)=>{
          j.tabId = i+1+''
          j.name = '创意'+j.tabId
        })
      },
      addTab(){
        this.creativeList.push(
          {
            name:'创意'+(this.creativeList.length+1),
            tabId:this.creativeList.length+1+'',
            gender: 0,            // 性别；0-不限；1-男；2-女
            area: "0",            // 地区；传ID；0-不限
            start_time: "8",      // 起始时间；0-24；以小时为单位
            end_time: "9",
            config_url: "https://xxx",
            images: [1,2,3,4,5],
          },
        )
        this.editableTabsValue = this.creativeList.length+''
      },
      //素材替换
      materialSelect(item){
        this.scriptFormImagesItem = item;
        this.$refs.myMaterial.materialSelect()
      },
      //素材确认
      getImageForm(item){
        let replaceIndex ;
        this.scriptForm.images.forEach((val,ind)=>{
          if(this.scriptFormImagesItem.id===val.id){
            replaceIndex = ind;
          }
        })
        this.scriptForm.images.splice(replaceIndex,1,item)
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            requestServices.addZu({
              user_id:auth.getCookie('user_profile').id,
              group_name:'',
              script_id:'',
              landing_page_url:'',
            })
          } else {
            // this.$message.error("表单未验证通过，提交失败！")
            return false;
          }
        });
      },

      //返回上一页
      backto(){
        this.$router.push({name:"creative-list"})
      }

    }
  }
</script>
<style lang="less" scoped>


  .contentBox{
    margin: 20px;


    .material{
      .material-card{
        border: 1px solid #b6c2ff;
        padding: 10px;
        border-radius: 5px;
        .tabContent{
          min-width: 950px;
          .scriptCard {
            max-height: 390px;
            /*overflow-y: scroll;*/
            /*overflow-x: hidden;*/
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
            width: 50%;
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
    color: transparent;
    -webkit-text-stroke: 1px black;
    letter-spacing: 0.04em;
    font-size: 18px;
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
    border: 1px solid #a5caa5;
    border-radius: 5px;
    margin-top: 10px;
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
