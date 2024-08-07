/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BiHome, BiUser, BiBook, BiCalendar, BiCog, BiBell } from 'react-icons/bi'; // 필요한 아이콘 import

const Sidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    }

    return (
        <div className="bg-gray-800 text-white h-screen w-64 p-4">
            <div className="logo mb-8">
                <a href="#" className="text-2xl font-semibold">
                    KSIS
                </a>
            </div>
            <div className="mb-4">
                <a href="#" className="flex items-center p-2 hover:bg-gray-700 rounded">
                    <BiUser className="mr-3" />
                    <span>계정정보</span>
                </a>
                <a href="#" className="flex items-center p-2 hover:bg-gray-700 rounded">
                    <BiBell className="mr-3" />
                    <span>알림</span>
                </a>
            </div>
            <div className="menu--list">
                <div className="item">
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => toggleMenu('account')}>
                        <BiHome className="mr-3" />
                        <span>계정관리</span>
                    </div>
                    {openMenu === 'account' && (
                        <div className="submenu ml-8 mt-2">
                            <a href="#" className="block py-1">Dashboard</a>
                            <a href="#" className="block py-1">Updates</a>
                        </div>
                    )}
                </div>
                <div className="item">
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => toggleMenu('profile')}>
                        <BiUser className="mr-3" />
                        <span>미디어 관리</span>
                    </div>
                    {openMenu === 'profile' && (
                        <div className="submenu ml-8 mt-2">
                            <a href="#" className="block py-1">계정 조회</a>
                            <a href="#" className="block py-1">IP 관리</a>
                        </div>
                    )}
                </div>
                <div className="item">
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => toggleMenu('notice')}>
                        <BiBook className="mr-3" />
                        <span>공지글 관리</span>
                    </div>
                    {openMenu === 'notice' && (
                        <div className="submenu ml-8 mt-2">
                            <a href="#" className="block py-1">이미지 관리</a>
                            <a href="#" className="block py-1">영상 관리</a>
                            <a href="#" className="block py-1">컨텐츠 관리</a>
                        </div>
                    )}
                </div>
                <div className="item">
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => toggleMenu('device')}>
                        <BiCalendar className="mr-3" />
                        <span>재생장치 관리</span>
                    </div>
                    {openMenu === 'device' && (
                        <div className="submenu ml-8 mt-2">
                            <a href="#" className="block py-1">재생장치 관리</a>
                            <a href="#" className="block py-1">일반 PC 관리</a>
                        </div>
                    )}
                </div>
                <div className="item">
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => toggleMenu('settings')}>
                        <BiCog className="mr-3" />
                        <span>기타 관리</span>
                    </div>
                    {openMenu === 'settings' && (
                        <div className="submenu ml-8 mt-2">
                            <a href="#" className="block py-1">API 조회</a>
                            <a href="#" className="block py-1">용량 관리</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
