<template>
  <div class="h100">
    <el-header class="headerBox clearfix" height="58px">
      <img class="float_left" style="height: 50px;margin: 4px 0 0 50px" src="static/magicLogo.png" alt="">
      <div class="header_company float_left">

        迈吉客科技
      </div>
      <div class="header_btn float_right">
        <el-button type="default" @click="loginOutEve" plain>退出登录</el-button>
      </div>




    </el-header>
    <div class="contentBox">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {

        userName:'',
      }
    },
    watch:{
      $route(to){
        this.defaultActive = to.path.split('/')[1]
      }
    },
    created() {
      // this.userName = JSON.parse(window.sessionStorage.getItem("user_profile")).user_name
      this.defaultActive = this.$route.path.split('/')[1]
    },
    methods:{

      loginOutEve(){
        this.$router.push({name:'login'})
      },

    }
  }
</script>

<style lang="less" scoped>
  .headerBox{
    /*background: #F9F9F9;*/
    position: fixed;
    top: 0;
    z-index: 112;
    width: 100%;
    min-width: 680px;
    background-color: #0A2140;
    /*border-bottom: 2px solid #daddf7;*/
    text-align: right;
    font-size: 0;
    /*box-shadow: 0px 1px 4px 0px #3F51B5;*/
    .header_company{

      display: inline-block;
      padding-left: 20px;
      /* padding: 5px 10px 5px 20px; */
      font-size: 22px;
      color: #fff;
      /*color: #606266;*/
      font-weight: 500;
      height: 58px;
      line-height: 58px;
    }
    .header_btn{
      margin-right: 50px;
      height: 58px;
      line-height: 66px;
    }
  }

  .contentBox{
    /*padding: 15px;*/
    margin: 85px auto 0;
    max-width: 1200px;
    min-width: 600px;
    /*width: 90%;*/
    border-radius: 5px;
    /*box-shadow: 0 0 8px 1px #acafb1;*/
  }
</style>
