import { CheckOutlined, ExclamationCircleOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message, Modal} from "antd";
import React, { useRef, useEffect } from "react";
import { axiosInstance } from "../../../config/axios";
import { time } from '../../../utils/time';
import { getToken } from '../../../utils/getToken';
import deletePng from '../../../img/delete.png';
import './message.css';

const { confirm } = Modal;

const Message = props => {
  const { created_at, receiver } = props;
  let id = props.id;

  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ bahavior: "smooth" });
  }, [])

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure to delete this message?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        const res = await axiosInstance.delete(`admin/messages/delete/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
        if (res.data.success) {
          props.deleteFunction(id)
          return
        }
        message.error("Something went wrong. Try Again!");
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const menu = (
    <Menu
      items={[
        {
          key: props.id,
          label: <button style={{ backgroundColor: "inherit", border: "none", display: "flex" }}><DeleteOutlined className='delete-icon' />Delete</button>,
          danger: true,
          style: { margin: "-2px", padding: "6px 12px" },
          onClick: showDeleteConfirm,
        },
      ]}
    />
  );

  return (
    <div className="message">{
      receiver
        ? <>
          <span className="admin_name">{`${props.admin.firstname}  ${props.admin.lastname}`}</span>
          <div className='admin-message-component'>
            {props.deleted ? <p className='deleted message_receiver'>You have deleted this message</p>
              : <>
                <img src={deletePng} className='delete-icon' onClick={showDeleteConfirm} />
                <Dropdown overlay={menu} trigger={['contextMenu']} >
                  <div className='site-dropdown-context-menu'>
                    <p ref={scrollRef} className="message_receiver">
                      {props.message}
                      <span className='chat__timestamp_receiver'>{created_at ? time(created_at) : <LoadingOutlined style={{ fontSize: "15px", margin: "3px" }} />}</span>
                    </p>
                  </div>
                </Dropdown>
                <CheckOutlined className={created_at ? "check" : "noCheck"} />
              </>
            }
          </div>
        </>
        : <>
          <div className='message-component'>
            {
              props.deleted ? <p className='deleted message_customer'>Customer has deleted this message</p>
                : <p ref={scrollRef} className='message_customer'>
                  {props.message}
                  <span className='chat__timestamp_customer'>{created_at ? time(created_at) : <LoadingOutlined style={{ fontSize: "15px", margin: "3px" }} />}</span>
                </p>
            }
          </div>
        </>
    }</div>
  )
}

export default Message;