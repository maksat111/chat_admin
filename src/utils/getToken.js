export const getToken = () => {
    const data = JSON.parse(localStorage.getItem("chat"));
    return data.token;
}