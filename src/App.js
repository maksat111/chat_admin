import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import ProtectedRoute from './components/protectedRoute';

const Admin = lazy(() => import('./pages/admin/admin'));
const Login = lazy(() => import('./pages/login/login'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOutlined style={{ fontSize: "50px", fontWeight: "700", color: "white" }} />}>
        <Routes>
          <Route exact path='/admin' element={<ProtectedRoute> <Admin /> </ProtectedRoute>} />
          <Route exact path="/" element={<Login />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App;