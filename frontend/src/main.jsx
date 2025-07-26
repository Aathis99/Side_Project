// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css'; เกิด error จอขาว เนื่องจาก import ต้องนำ  import ออกแล้วลบ ไฟล์index.css ออก
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // นำเข้า Bootstrap CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
