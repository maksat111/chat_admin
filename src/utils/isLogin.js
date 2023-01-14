export const isLogin = () => {
  let data = JSON.parse(localStorage.getItem("chat"));
  if(data){
    return true
  }
  return false;
}