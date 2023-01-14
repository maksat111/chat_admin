import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import axios from 'axios';
import "./toolBar.css"
import { getToken } from '../../../utils/getToken';

const { confirm } = Modal;

const ToolBar = (props) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('chat'));

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure to Log Out?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios.get('https://customers.asmantiz.com/api/admin/auth/logout', { headers: { Authorization: `Bearer ${getToken()}` } }).then(() => {
          localStorage.removeItem("chat");
          navigate("/login");
        }).catch(err => console.error(err))
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <div className='head'>
      <div className='container'>
        <UserOutlined className='icon' />
        <p>{user.user.firstname} {user.user.lastname}</p>
      </div>
      <div style={{ display: "flex" }}>
        <div className='container'>
          <SettingOutlined className='icon' />
          <p>Settings</p>
        </div>

        <div className='logOut-container' onClick={showDeleteConfirm}>
          <LogoutOutlined className='icon' />
          <p>Log Out</p>
        </div>
      </div>
    </div>
  )
}

export default ToolBar;