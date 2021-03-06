import axios from 'axios'
import qs from 'qs'//转换formdata类型数据
// import router from '../router/index'//用于跳转页面
import {MessageBox,Message } from 'element-ui';//提示框

const instance = axios.create({
  baseURL:"https://adserver-dev.magics-ad.com/"
});

// https://adserver-dev.magics-ad.com/admin_server/login/login

// https://adserver-dev.magics-ad.com
//"https://adserver.magics-ad.com/magics_server/client/"
//"http://localhost:8080/"  //本地调试


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
const prevHandler = ({data}) => {
  // if (data.return_code!==1000) {
  //   Message.error("系统异常！")
  // }
  return data
};


const prevErrHandler = ({response}) => {
  switch (response.status) {
    case 404:
      break;
    case 401:
      location.reload();
      break;
    case 500:
      errorMess()
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
  loginIn:(params)=>instance.get(`admin_server/login/login`,{params:params}),
  //获取创意组
  zuList:(params)=>instance.post(`animation_server/client/get_animation_creatives_groups`,params),
  //创意组详情
  SingleZu:(params)=>instance.post(`animation_server/client/get_animation_creatives_group`,params),

  //新增创意组
  addZu:(params)=>instance.post(`animation_server/client/insert_animation_creatives_group`,params),
  //修改创意组状态or删除
  editStatus:(params)=>instance.post(`animation_server/client/edit_group_status`,params),
  //修改创意组
  editZu:(params)=>instance.post(`animation_server/client/edit_animation_creatives_group`,params),

  //获取地域
  areaList:(params)=>instance.post(`common_server/client/province_opt`,params),

  //获取脚本列表
  scriptList(params){
    return instance.post(`animation_server/client/get_animation_scripts`,params).then((res) =>res)
  },
  //获取素材列表
  imageList(params){
    return instance.post(`animation_server/client/get_animation_images`,params).then((res) =>res)
  },
  //保存or上传脚本动画
  uploadFile(params){
    let _config = {
      'Content-Type':"multipart/form-data"
    }
    return instance.post(`common_server/client/upload`,params,_config)
  },
  //新增创意动画资源
  imageAdd(params){
    return instance.post(`animation_server/client/insert_animation_image`,params)
  }
};
