<template>
  <div>
    <el-button @click="backto" type="primary" plain> << 返回上一页 </el-button>
    <div class="contentBox">
      <my-script></my-script>
      <div class="material">
        <div class="title">创意素材</div>
        <div class="material-card">
          <el-tabs type="card" v-model="editableTabsValue" closable @tab-remove="removeTab" @tab-add="addTab" editable>
            <el-tab-pane
              v-for="(val,ind) in tabList"
              :key="ind+'tab'"
              :name="val.name">
              <span slot="label">
                {{val.title}}
              </span>
              我的行程
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>



    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm-sty">
      <el-form-item class="w50" label="职位" prop="name">
        <el-input placeholder="例:引擎开发工程师" v-model="ruleForm.name"></el-input>
      </el-form-item>

      <el-form-item class="w50" label="工作经验" prop="experience">
        <el-input placeholder="例:1-3年" v-model="ruleForm.experience"></el-input>
      </el-form-item>

      <el-form-item class="w50" label="需求人数" prop="number">
        <el-input-number v-model="ruleForm.number" :min="1" :max="10" label="人"></el-input-number>

      </el-form-item>

      <el-form-item class="w50" label="学历要求" prop="educational_background">
        <el-input placeholder="例:本科及以上" v-model="ruleForm.educational_background"></el-input>
      </el-form-item>

      <el-form-item label="岗位描述" prop="responsibilities">
        <el-input
          placeholder="例：
 1、负责自研3D引擎；
 2、对渲染关键技术进行前瞻性研究；
 3、负责引擎的改进和维护工作；"
          :autosize="{ minRows: 5, maxRows: 8 }"
          type="textarea" v-model="ruleForm.responsibilities"></el-input>
      </el-form-item>
      <el-form-item label="岗位要求" prop="requirements">
        <el-input
          placeholder="例：
同上"
          :autosize="{ minRows: 5, maxRows: 8 }"
          type="textarea" v-model="ruleForm.requirements"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="success" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {requestServices} from "../../api/api";
  import script from "./script";
  export default {
    components:{
      'my-script':script
    },
    data(){
      return{
        editableTabsValue:'2',
        tabList:[
          {
            title:'创意1',
            name:"1",
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


        ruleForm: {
          name: '',
          experience: "",
          number:'',
          educational_background:'',
          responsibilities:'',
          requirements:'',
        },
        rules: {
          name: [
            { required: true, message: '请输入职位名称', trigger: 'blur' },
            { min: 1, max: 100, message: '长度限制', trigger: 'blur' }
          ],
          experience: [
            { required: true, message: '请输入工作经验', trigger: 'blur' },
            { min: 1, max: 100, message: '长度限制', trigger: 'blur' }
          ],

          educational_background: [
            { required: true, message: '请输入学历要求', trigger: 'blur' },
            { min: 1, max: 100, message: '长度限制', trigger: 'blur' }
          ],
          responsibilities: [
            { required: true, message: '请填写岗位描述', trigger: 'blur' }
          ],
          requirements: [
            { required: true, message: '请填写岗位要求', trigger: 'blur' }
          ]
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

      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm.job_id){
              requestServices.updateJobs({
                user_id:JSON.parse(window.sessionStorage.getItem("user_profile")).id,
                job_id:this.ruleForm.job_id,
                name:this.ruleForm.name,
                experience:this.ruleForm.experience,
                number:this.ruleForm.number+'人',
                educational_background:this.ruleForm.educational_background,
                responsibilities:this.ruleForm.responsibilities,
                requirements:this.ruleForm.requirements,
              })
                .then(res=>{
                  if(res.return_code===1000){

                    this.$message.success("修改成功！自动返回上一页...")
                    setTimeout(()=>{
                      this.$router.push({name:"job"})
                    },1000)
                  }else{
                    this.$message.warning("系统异常！提交失败！")
                  }
                })
            }else{
              requestServices.addJobs({
                user_id:JSON.parse(window.sessionStorage.getItem("user_profile")).id,
                name:this.ruleForm.name,
                experience:this.ruleForm.experience,
                number:this.ruleForm.number+'人',
                educational_background:this.ruleForm.educational_background,
                responsibilities:this.ruleForm.responsibilities,
                requirements:this.ruleForm.requirements,
              })
                .then((res)=>{
                  if(res.return_code===1000){
                    this.$message.success("提交成功！")
                    this.$refs[formName].resetFields();
                  }else{
                    this.$message.warning("系统异常！提交失败！")
                  }
                })
            }

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
  .ruleForm-sty{
    width: 800px;
    margin: 0 auto;
  }
  .w50{
    width: 50%;
  }

  .contentBox{
    margin: 20px;
    border: 1px solid;
    padding: 20px;

    .material{
      margin-top: 20px;
      height: 200px;
      .material-card{

      }
    }
  }
</style>
