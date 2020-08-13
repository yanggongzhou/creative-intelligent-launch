<template>
  <div id="screen">
    <MouseParallax>
      <div slot="main" class="stage">
        <img
          data-prax
          src="https://images.magicscorp.com/Mimg/background/timg.jpeg"
          class="cover"
        />
<!--        src="https://images.magicscorp.com/Mimg/bms/parallax.jpg"-->
        <!--        <div data-prax="0.6" class="bbbb">-->
        <!--          测试1-->
        <!--        </div>-->
        <!--        <div data-prax="0.4" class="cccc">-->
        <!--          测试2-->
        <!--        </div>-->
      </div>
    </MouseParallax>

    <div class="loginBox">
      <div class="title">
        创意智能化投放
      </div>
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="loginForm">
          <el-form-item label="" prop="admin_name">
            <el-input
              size="small"
              prefix-icon="el-icon-user-solid"
              placeholder="账号"
              v-model="ruleForm.admin_name"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input
              size="small"
              prefix-icon="el-icon-orange"
              placeholder="密码"
              type="password"
              show-password
              v-model="ruleForm.password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              class="login-btn"
              size="small" type="primary" @click="submitForm('ruleForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { MouseParallax } from './index';
  import {requestServices} from "../api/api";
  import {auth} from '../api/auth'
  export default {
    components: {
      MouseParallax,
    },
    data() {
      return {

        ruleForm: {
          admin_name: '',
          password: '',
        },
        rules: {
          admin_name: [
            { required: true, message: '请输入账户', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            requestServices.loginIn(this.ruleForm)
              .then(res=>{
                if(res.return_code===1000){
                  this.$router.push({name:"creative-list"})
                  this.$message.success(res.result.message)
                  auth.setCookie('user_profile',res.result.user_profile,30)
                }else {
                  this.$message.error("登陆失败，系统异常")
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  #screen {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: #060113;
    .stage {
      position: relative;
      z-index: 1;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      filter: blur(4px);
       .cover {
        /*filter: blur(10px);*/
        position: absolute;
        z-index: 1;
        top: -20vw;
        left: -40vh;
        width: auto;
        height: 150vh;
      }
       .bbbb {
        position: absolute;
        z-index: 2;
        top: 120px;
        left: 120px;
        font-size: 36px;
        color: #fff;
      }
       .cccc {
        position: absolute;
        z-index: 3;
        color: #fff;
        font-size: 36px;
        right: 200px;
        bottom: 120px;
      }
    }
  }
  .loginBox{
    position: absolute;
    z-index: 20;
    left: calc(50% - 180px);
    top: calc(50% - 130px);
    background: #1b1823a1;
    width: 360px;
    height: 250px;
    border-radius: 5px;
    .title{
      text-align: center;
      font-size: 21px;
      border-bottom: 2px solid #ffff;
      padding: 10px;
      color: #fff;
      letter-spacing: 2px;
    }
    .loginForm{
      padding: 25px 40px 0;
      .el-form-item {
        margin-bottom: 15px;
      }
      .login-btn{
        width: 100%;
        letter-spacing: 5px;
      }
    }

  }
</style>
