<template>
  <div>
    <el-button @click="backto" type="primary" plain> << 返回上一页 </el-button>
    <div class="contentBox">
      <div class="bigTitle">选择创意脚本</div>
      <my-script></my-script>
      <div class="material">
        <div class="bigTitle">创意素材</div>
        <div class="material-card">
          <el-tabs type="card" v-model="editableTabsValue" closable @tab-remove="removeTab" @tab-add="addTab" editable>
            <el-tab-pane
              v-for="(val,ind) in tabList"
              :key="ind+'tab'"
              :name="val.name">
              <span slot="label">
                {{val.title}}
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
                        <el-col class="mt10" :span="8" v-for="item in 8" :key="item">
                          <el-card class="card-item" :body-style="{ padding: '0px' }">
                            <div class="bgImage" @click.stop="materialSelect(item)">
                              <div class="bgImage_spine">点击更换图片<br>16:{{item}}</div>
                            </div>
                            <!--                        <div class="red-bl">16:{{item}}</div>-->
                            <!--                        <img src="https://images.magicscorp.com/Mimg/bms/parallax.jpg" class="image">-->

                            <div style="padding: 10px;font-size: 13px;text-align: center">
                              <span>素材{{item}}</span>
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
                        <el-select v-model="ruleForm.name" placeholder="请选择" class="w100">
                          <el-option label="不限" value="不限"></el-option>
                          <el-option label="男" value="男"></el-option>
                          <el-option label="女" value="女"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="地域" prop="experience">
                        <el-select v-model="ruleForm.experience" filterable multiple placeholder="请选择" class="w100">
                          <el-option label="不限" value="不限"></el-option>
                          <el-option label="北京" value="男"></el-option>
                          <el-option label="天津" value="女"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="时间" prop="timeArea">
                        <el-time-picker
                          class="w100"
                          is-range
                          v-model="ruleForm.timeArea"
                          range-separator="至"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          placeholder="选择时间范围">
                        </el-time-picker>
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
            <el-input v-model="scriptUrl"></el-input>
          </el-form-item>
          <el-form-item label="创意组名称">
            <el-input v-model="scriptUrl"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>



    <my-material ref="myMaterial"></my-material>
  </div>
</template>
<script>
  import {requestServices} from "../../api/api";
  import script from "./script";
  import material from "./material";
  export default {
    components:{
      'my-script':script,
      'my-material':material
    },
    data(){
      return{



        editableTabsValue:'2',
        tabList:[
          {
            title:'创意1',
            name:"1",
            content:[
              {

              }
            ]
          },
          {
            title:'创意2',
            name:"2",
          },
          {
            title:'创意3',
            name:"3",
          },
          {
            title:'创意4',
            name:"4",
          }
        ],

        inputvalue:'',

        ruleForm: {
          name: '',
          experience: "",
          timeArea:'',
        },
        rules: {

        }

      }
    },
    created() {
      if(Object.keys(this.$route.params).length){
        this.ruleForm.job_id = this.$route.params.id
        this.ruleForm.name = this.$route.params.name
        this.ruleForm.experience = this.$route.params.experience
        this.ruleForm.number = parseInt(this.$route.params.number)
        this.ruleForm.educational_background = this.$route.params.educational_background
        this.ruleForm.responsibilities = this.$route.params.responsibilities
        this.ruleForm.requirements = this.$route.params.requirements
      }
    },
    methods:{
      //创意移除
      removeTab(val){

      },
      addTab(){
        this.tabList.push(
          {
            title:'创意'+(this.tabList.length+1),
            name:this.tabList.length+1+'',
          },
        )
      },
      //素材替换
      materialSelect(item){
        this.$refs.myMaterial.materialSelect()
      },


      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

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
            height: 390px;
            overflow-y: scroll;
            overflow-x: hidden;
            width: 600px;
            .card-item {
              position: relative;
              .bgImage{
                width: 100%;
                height: 140px;
                background: url("https://images.magicscorp.com/Mimg/bms/parallax.jpg") no-repeat;
                background-size:cover ;
                .bgImage_spine{
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
            border: 1px solid;
            margin: 0 auto;
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
</style>
