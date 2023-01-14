import React from "react";
import { Avatar, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./chat.css"

const Chat = ({chats}) => {
    return(
        <div className="chatDiv">
            <div className="chat-details">
                <Avatar size={45} icon={<UserOutlined />} style={{verticalAlign: "sub"}} />
                <div className="chat-name-lastMessage">
                    <h2>{chats?.customer.firstname+' '+chats?.customer.lastname}</h2>
                    <p>{chats?.last_message?.length > 25 ? chats?.last_message.slice(0,25)+" ..." : chats?.last_message }</p>
                    {/* <Divider /> */}
                </div>
            </div>
            <Badge count={chats?.unread} />
        </div>
    )
}

export default Chat;