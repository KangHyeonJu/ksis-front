import React, { useState } from "react";
import { Link } from 'react-router-dom'; // Link 컴포넌트 import
import { BiUser, BiCog, BiBell } from 'react-icons/bi'; // 필요한 아이콘 import
import { MdManageAccounts, MdOutlinePermMedia, MdChat, MdDevices } from "react-icons/md";

const Sidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    }

    const handleLogout = () => {
        // 로그아웃 로직을 여기에 추가하세요
        console.log("로그아웃");
        // 예를 들어, 세션을 삭제하고 로그인 페이지로 리디렉션할 수 있습니다.
        // sessionStorage.removeItem("user");
        // window.location.href = "/login";
    }

    return (
        <div className="bg-gray-800 text-white h-screen w-64 p-4">
            <div className="logo mb-8">
                <a href="/" className="text-2xl font-semibold">
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
            <hr />
            <div className="menu--list">
                <div className="item">
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => toggleMenu('account')}>
                        <MdManageAccounts className="mr-3" />
                        <span>계정관리</span>
                    </div>
                    {openMenu === 'account' && (
                        <div className="submenu ml-8 mt-2">
                            <a href="#" className="block py-1">계정조회</a>
                            <a href="#" className="block py-1">로그기록</a>
                        </div>
                    )}
                </div>
                <div className="item">
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => toggleMenu('profile')}>
                        <MdOutlinePermMedia className="mr-3" />
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
                        <MdChat className="mr-3" />
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
                        <MdDevices className="mr-3" />
                        <span>디바이스 관리</span>
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
                            <Link to="/api-board" className="block py-1">API 조회</Link> {/* Link 컴포넌트 사용 */}
                            <a href="#" className="block py-1">용량 관리</a>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center p-2 hover:bg-gray-700 rounded"
                >
                    <span>로그아웃</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
