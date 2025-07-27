// frontend/src/contexts/ThemeContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 1. ดึงค่าจาก localStorage หรือใช้ค่า default ('light')
    const savedTheme = localStorage.getItem('theme');
    const [theme, setTheme] = useState(savedTheme || 'light');

    // 2. ใช้ useEffect เพื่อจัดการ class บน body tag
    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-mode' : '';
        localStorage.setItem('theme', theme); // บันทึกการตั้งค่า
    }, [theme]); // re-run เมื่อ theme เปลี่ยน

    // 3. ฟังก์ชันสำหรับสลับธีม
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom Hook สำหรับใช้งาน Theme Context
export const useTheme = () => {
    return useContext(ThemeContext);
};