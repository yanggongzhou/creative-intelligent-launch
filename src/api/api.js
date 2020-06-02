import axios from 'axios'
import qs from 'qs'//转换formdata类型数据
// import router from '../router/index'//用于跳转页面
import {MessageBox,Message } from 'element-ui';//提示框

const instance = axios.create({
  baseURL:"https://adserver-dev.magics-ad.com/magics_website/client/"
});
// https://adserver-dev.magics-ad.com
//"https://adserver.magics-ad.com/magics_server/client/"
//"http://localhost:8080/"  //本地调试

const prevHandler = ({data}) => {
  // switch (data.status) {
  //
  // }
  return data
};
//错误弹出框
function errorMess(){
  MessageBox.confirm( '系统异常','提示', {
    confirmButtonText: '确定',
    showClose:false,
    type: 'warning',
    closeOnClickModal:false,
    showCancelButton:false,
    confirmButtonClass:"primary-btn",
    center: true
  }).then(() => {
  });
}

const prevErrHandler = ({response}) => {
  switch (response.status) {
    case 404:
      // router.push({name:'error',query:{status:404}});
      break;
    case 401:
      location.reload();
      break;
    case 500:
      break;
    default:
  }
  throw new Error('系统异常');
};

instance.interceptors.response.use(prevHandler,prevErrHandler);
instance.interceptors.request.use(
  config => {
    // let token = auth.getToken();
    // if (token) {
    //   //请求报文添加Authorization，用于用户身份验证
    //   config.headers['Authorization'] = token;
    // }
    return config;
  },
  err => {
    return Promise.reject(err);
  });
export const requestServices={
  // 获取新闻列表
  newsList(params){
    return instance.get(`fetch_news`,{params:params}).then((res) =>res)
  },

  //获取职位列表
// {
//   "page_start": 1,                           // 起始页
//   "page_count": 5,                           // 每页条数
// }
  //获取职位列表
  jobsList(params){
    return instance.get(`fetch_jobs`,{params:params}).then((res) =>res)
  },

  //   预约咨询
// {
//   "company": "appmagics",     // 企业名称
//   "name": "张三",              // 姓名
//   "phone": "13520000000",     // 手机号
//   "email": "xxx@xxx",         // 邮箱，测试时使用，可不填
// }
  sendEmail(params){
    return instance.post(`send_email`,params).then((res) =>res)
  },



};
