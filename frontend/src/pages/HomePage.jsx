// frontend/src/pages/HomePage.js

import React from 'react';
import yourGif from '../assets/frog-frog-laughing.gif';

const HomePage = () => {
    return (
        <div className="container mt-5">
            <div className="jumbotron text-center">
                <h1 className="display-4">ยินดีต้อนรับสู่ระบบ จัดการสินค้า</h1>
                <p className="lead">จัดการสินค้า,ผู้ใช้ ,ประเภทสินค้า, แบบ ง่าย ^_^</p>
                <hr className="my-4" />
                {/* <p>Use the navigation bar to explore different features.</p> */}
                <img
                    src={yourGif}
                    alt="animated GIF"
                    className="img-fluid mb-4" // ใช้ img-fluid ของ Bootstrap เพื่อให้ responsive
                    style={{ maxWidth: '600px', height: 'auto' }} // กำหนดขนาดสูงสุดตามต้องการ
                />
            </div>
        </div>
    );
};

export default HomePage;