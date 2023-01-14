import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, ArrowRightOutlined, LoadingOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../config/axios";
import "./login.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [eye, setEye] = useState(true);

    const handleClick = async (e) => {
        e.preventDefault();
        setIsFetching(true);

        await axiosInstance.post('admin/login', { email, password }).then((res) => {
            localStorage.setItem("chat", JSON.stringify(res.data.data));
            message.success("Successfully!");
            setIsFetching(false);
            navigate("/admin");
        }).catch(err => {
            setIsFetching(false);
            console.log(err.response.data);
            message.error(err.response.data.data.message)
        })
    }

    return (
        <div className="container">
            <div className="screen">
                <div className="screen__content">
                    <form className="login" onSubmit={handleClick}>
                        <h1 className='h1'>LOGIN</h1>

                        <div className="login__field">
                            <UserOutlined className="login__icon" />
                            <input type="email" className="login__input" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="login__field">
                            <LockOutlined className="login__icon" />
                            <input type={eye ? "password" : "text"} className="login__input" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                            {password ? (eye ? <EyeOutlined className='login__icon' onClick={() => setEye(false)} />
                                : <EyeInvisibleOutlined className='login__icon' onClick={() => setEye(true)} />) : <></>}
                        </div>

                        <button className="button login__submit" type='submit' disabled={isFetching}>
                            {isFetching ? <LoadingOutlined style={{ fontSize: "20px", margin: "auto" }} /> :
                                <>
                                    <span className="button__text">Log In Now</span>
                                    <ArrowRightOutlined className="button__icon" />
                                </>}
                        </button>

                    </form>
                </div>
                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4"></span>
                    <span className="screen__background__shape screen__background__shape3"></span>
                    <span className="screen__background__shape screen__background__shape2"></span>
                    <span className="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
    )
}

export default Login;