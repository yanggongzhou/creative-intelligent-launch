//添加cookie
function setCookie(name, value,time){
  var date=new Date(); //获取当前时间
  var expiresDays=time;  //将date设置为n天以后的时间
  date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
  document.cookie=name + "=" + JSON.stringify(value) +";expires="+date.toGMTString();  //设置cookie
}
// 获取cookie
function getCookie(name) {
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
    return JSON.parse(unescape(arr[2]));
  else
    return null;
}
// 删除cookie
function delCookie(name){
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null)
    document.cookie= name + "="+cval+"; path=/;expires="+exp.toGMTString();
}
// 封装至auth
export const auth={
  getCookie,
  setCookie,
  delCookie,
};
