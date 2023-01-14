import { React, useState } from 'react';
import { Button, message } from "antd";
import { SendOutlined } from '@ant-design/icons';
import './sendMessage.css';


const SendMessage = ({ handleSubmit }) => {
    const [newMessage, setNewMessage] = useState("");

    const clickFunc = (e) => {
        e.preventDefault();
        if (newMessage === '') {
            return message.warn("Write your message, please!");
        }
        handleSubmit(newMessage);
        setNewMessage("");
    }

    return (
        <form className="sendMessage_container" onSubmit={clickFunc}>
            <div className="sendMessage_input">
                <input
                    placeholder={"Your message ..."}
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                />
            </div>
            <Button
                shape="circle"
                style={{ width: "7.7vh", height: "6.5vh", backgroundColor: "#0037a3" }}
                size="large"
                icon={<SendOutlined style={{ color: "white", fontSize: "3.4vh", marginLeft: "2px" }} />}
                type="submit"
                onClick={clickFunc}
            />
        </form>
    )
}

export default SendMessage;