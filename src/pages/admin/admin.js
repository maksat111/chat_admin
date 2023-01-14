import React, { useState, useEffect } from "react";
import { message } from "antd";
import {LoadingOutlined} from "@ant-design/icons";

import Chat from "./components/chat";
import Message from "./components/message";
import ToolBar from "./components/toolBar";
import pusher from "../../config/pusher";
import { axiosInstance } from "../../config/axios";
import { playSound } from "../../utils/playSound";
import SearchBox from "./components/searchBox";
import SendMessage from './components/sendMessage';
import { getToken } from "../../utils/getToken";
import png from '../../img/customer2.png';

import "./admin.css"

const user = JSON.parse(localStorage.getItem("chat"));

const Admin = () => {
    const [chats, setChats] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [numberChats, setNumberChats] = useState(0);
    const [numberMessages, setNumberMessages] = useState(0);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState({});
    const [searchValue, setSearchValue] = useState("");
    const [chatPageNumber, setChatPageNumber] = useState(2);
    const [messagePageNumber, setMessagePageNumber] = useState(2);
    const [messageSpin, setMessageSpin] = useState(false);
    const [chatSpin, setChatSpin] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);
    const limitChats = 30;
    const limitMessages = 10;

    useEffect(() => {
        try {
            const channel = pusher.subscribe('private-Staff.Chat.Customers');
            channel.bind('Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', (data) => {
                setArrivalMessage(data);
                playSound();
            });
        } catch (err) {
            console.log(err)
        }
    }, [arrivalMessage]);

    useEffect(() => {
        if (arrivalMessage) {
            const index = chats.findIndex((c) => c.customer.id == arrivalMessage.customer.id);

            if (currentChat?.customer.id == arrivalMessage.customer.id) {
                return setMessages(previousState => [...previousState, arrivalMessage]);
            }

            setChats(previousState => {
                if (index == -1) {
                    arrivalMessage.last_message = arrivalMessage.message;
                    arrivalMessage.unread = 1;
                    let a = [...previousState, arrivalMessage];
                    a.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                    return a
                } else {
                    let a = [...previousState];
                    a[index].unread += 1;
                    a[index].last_message = arrivalMessage.message;
                    a[index].updated_at = Date.now();
                    a.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                    return a;
                }
            });
        }
    }, [arrivalMessage])

    const getChats = async () => {
        await axiosInstance.get(`admin/getChats?page=1&limit=${limitChats}`, { headers: { Authorization: `Bearer ${getToken()}` } }).then((res) => {
            setChats(res.data.data);
            setNumberChats(res?.data.data.length);
        }).catch(err => { message.error(err.message); console.log(err) })
    }

    useEffect(() => {
        if (chats.length === 0 || searchValue === "") {
            getChats()
        }
    }, [searchValue])

    useEffect(() => {
        if (currentChat) {
            const getMessages = async () => {
                try {
                    setMessageLoading(true);
                    const res = await axiosInstance.get(`admin/${currentChat.customer.id}?page=1&limit=${limitMessages}`, { headers: { Authorization: `Bearer ${getToken()}` } });
                    setNumberMessages(res.data.data.length);
                    setMessages(res.data.data);
                    setMessageLoading(false)
                } catch (err) {
                    message.error(err.message);
                    console.log('error on getting messages => ', err)
                }
            }
            setMessagePageNumber(2);
            getMessages()
        }
    }, [currentChat]);

    const handleSubmit = async (newMessage) => {
        try {
            const message = {
                _id: Math.floor(Math.random() * 1000000000),
                admin: {
                    id: user.user.id,
                    firstname: user.user.firstname,
                    lastname: user.user.lastname
                },
                sender: {
                    type: 'admin'
                },
                customer_id: currentChat.customer.id,
                room_id: currentChat.room_id,
                message: newMessage,
                deleted_at: null
            };

            let index = chats.findIndex((c) => c.customer.id == currentChat.customer.id);

            setChats(previousState => {
                if (previousState.length == 0) {
                    return [...previousState]
                } else {
                    let a = [...previousState];
                    a[index].updated_at = Date.now();
                    a[index].last_message = newMessage.length > 25 ? newMessage.slice(0, 25) + " ..." : newMessage;
                    a.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                    return a;
                }
            });

            const length = messages.length;
            const room_id = messages[0].room_id;
            setMessages([...messages, message]);

            axiosInstance.post(`admin/sendMessage`, { customer_id: currentChat.customer.id, message: newMessage }, { headers: { Authorization: `Bearer ${getToken()}` } })
                .then((res) => {
                    if (res.data.success == 1 && res.data.data.room_id == room_id) {
                        setMessages(previousState => {
                            let a = [...previousState];
                            a[length].created_at = res.data.data.created_at;
                            a[length]._id = res.data.data._id;
                            return a;
                        })

                    }
                });
        } catch (err) {
            console.log(err);
        }
    };

    const searchState = (data) => {
        setChats(data);
        setNumberChats(data.length);
    }

    const searchValueChange = (data) => {
        setSearchValue(data);
    }

    const nextChatsButtonSubmit = () => {
        setChatSpin(true);

        axiosInstance.get(`admin/getChats?page=${chatPageNumber}&limit=${limitChats}`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then((res) => {
                if (res.data.success !== 1) {
                    return message.error("Eror on getting Chats!")
                }

                setNumberChats(res.data.data.length)
                setChatPageNumber(chatPageNumber + 1);
                setChats(previousState => [...previousState, ...res.data.data]);
                setChatSpin(false);
            }).catch(err => console.log(err))
    }

    const nextMessagesButtonSubmit = () => {
        setMessageSpin(true);
        axiosInstance.get(`admin/${currentChat.customer.id}?page=${messagePageNumber}&limit=${limitMessages}`,
            { headers: { Authorization: `Bearer ${getToken()}` } }).then((res) => {
                if (res.data.success !== 1) {
                    return message.danger("Error on getting Messages!");
                }

                setNumberMessages(res.data.data.length);
                setMessagePageNumber(messagePageNumber + 1);
                setMessages(previousState => [...res.data.data, ...previousState]);
                setMessageSpin(false);
            }).catch(err => console.log(err))
    }

    const deleteMessage = (message_id) => {
        const messageIndex = messages.findIndex((c) => c._id == message_id);
        setMessages(previousState => {
            let a = [...previousState];
            a[messageIndex].deleted_at = Date.now();
            return a;
        });
    }

    return (
        <div className="admin-container">
            <div className="sidebar">
                <SearchBox searchState={searchState} searchValueChange={searchValueChange} searchValue={searchValue} />
                <div className="chats-container">
                    {chats.length > 0 ? <> {chats?.map((c) => <div className={`chatHover ${c?.room_id == currentChat?.room_id ? "active" : ""}`} key={c._id ? c._id : Math.floor(Math.random() * 1000000000)}
                        onClick={() => {
                            setCurrentChat(c);
                            setChats(previousState => {
                                let index = chats?.findIndex((con) => con.customer.id == c.customer.id);
                                let a = [...previousState];
                                a[index].unread = 0;
                                return a;
                            })
                        }}>
                        <Chat chats={c} />
                    </div>)} </> : <h2 className="noConversation">𝙽𝚘 𝚌𝚘𝚗𝚟𝚎𝚛𝚜𝚊𝚝𝚒𝚘𝚗 ...</h2>
                    }
                    {numberChats >= limitChats ? <button className="add_button" onClick={nextChatsButtonSubmit} disabled={chatSpin} >{chatSpin ? <LoadingOutlined style={{ fontSize: "15px", margin: "3px" }} /> : "Next Chats"}</button> : <></>}
                </div>
            </div>
            <div className='right-part' >
                <ToolBar />
                <div className="messageBox-container">
                    {messages?.length > 0 ? (messageLoading ? <LoadingOutlined className='messageLoading' /> : <> <div>
                        <div className="message_container">
                            {numberMessages >= limitMessages ? <button className='add_button' onClick={nextMessagesButtonSubmit} style={{ width: "160px", marginBottom: "10px" }} disabled={messageSpin} >{messageSpin ? <LoadingOutlined style={{ fontSize: "15px", margin: "3px" }} /> : "Previous Messages"}</button> : <></>}
                            {messages.map((m) => <Message
                                key={m?._id}
                                id={m?._id}
                                receiver={m?.sender.type == 'admin'}
                                message={m?.message}
                                created_at={m?.created_at}
                                admin={m?.admin}
                                deleted={m?.deleted_at !== null}
                                deleteFunction={deleteMessage}
                            />)}
                        </div>
                        <SendMessage handleSubmit={handleSubmit} />
                    </div>
                    </>) : (messageLoading ? <LoadingOutlined className="messageLoading" /> : <img src={png} className='png' />)
                    }
                </div>
            </div>
        </div>
    )
}

export default Admin;