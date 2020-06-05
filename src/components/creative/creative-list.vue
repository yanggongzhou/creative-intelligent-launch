<template>
  <div>
    <div class="btnBox">
      <el-button type="success" size="small" icon="el-icon-plus" @click="addBtn">新建创意</el-button>
      <!--      <el-button type="danger" size="small">删除</el-button>-->
    </div>
    <!--    @row-contextmenu="rowContextmenu"-->
    <el-table
      ref="tableBox"
      row-key='id'
      class="tableBox"
      size="small"
      v-loading="loading"
      :data="tableData"
      header-row-class-name="table_row"
      highlight-current-row
      stripe
      lazy
      style="width: 100%">
      <!--      type="index"-->
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50">
        <!--        <template slot-scope="scope">-->
        <!--          <p>{{ scope.row.sort }}</p>-->
        <!--        </template>-->
      </el-table-column>
      <el-table-column
        prop="responsibilities"
        align="center"
        label="开关"
        width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.responsibilities"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        prop="id"
        align="center"
        label="组ID"
        width="200">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="创意组名称">
      </el-table-column>

      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button  @click="editBtn(scope.row)" icon="el-icon-edit" type="text" size="small">编辑</el-button>

          <el-popconfirm
            confirmButtonText='好的'
            cancelButtonText='不用了'
            icon="el-icon-info"
            iconColor="red"
            title="确定删除这一职位？"
            @onConfirm="delBtn(scope.row.id)"
          >
            <el-button
              slot="reference"
              icon="el-icon-delete"
              type="text" size="small">删除</el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="mt10"
      style="text-align: end"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import {requestServices} from "../../api/api";
  import {auth} from "../../api/auth"
  export default {
    data() {
      return {
        user_id:"",

        tableData: [{},{},{},{},{},{},{},{},{},],

        currentPage:1,
        total:0,
        pageSize:10,
        menuVisible: false,
        loading:false,
      }
    },
    created() {
      // this.user_id = JSON.parse(window.sessionStorage.getItem("user_profile")).id;
      this.getList();
      console.log(auth.getCookie("user_profile"))
    },

    methods: {

      getList(){
        this.loading = true
        requestServices.zuList({
          user_id:JSON.parse(window.sessionStorage.getItem("user_profile")).id,
          page_start:this.currentPage,
          page_count:this.pageSize
        }).then(res=>{
          if(res.return_code===1000){
            this.tableData = res.result.images;
            this.$forceUpdate();
            this.total = res.result.count;
          }else{
            this.$message.error("系统异常!")
          }
          this.loading = false
        })
      },
      addBtn(){
        this.$router.push({name:"creative-edit"})
      },
      //查看
      editBtn(row) {
        this.$router.push({
          name:"creative-edit",
          params:row
        })
      },
      //删除
      delBtn(id){
        requestServices.delJobs({
          job_id:id,
          user_id:this.user_id
        })
          .then(res=>{
            if(res.return_code===1000){
              this.getList();
              this.$message.info("已删除")
            }else{
              this.$message.warning("系统异常！稍后再试...")
            }
          })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.getList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.getList();
      }

    }
  }
</script>
<style lang="less" scoped>

  .btnBox{
    margin: 10px 0;
  }
  .tableBox{

    .requirements_style{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }

  }
  /deep/.el-table th, .el-table tr{
    background-color: #546179 !important;
    color: #fff;
  }
</style>
