import React, { useState } from "react";
import { Link } from "react-router-dom"; // Link 컴포넌트 import
import { BiUser, BiCog, BiBell } from "react-icons/bi"; // 필요한 아이콘 import
import { CiFaceSmile } from "react-icons/ci";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa6";
import {
  MdManageAccounts,
  MdOutlinePermMedia,
  MdChat,
  MdDevices,
} from "react-icons/md";
import { PC_INVENTORY, SIGNAGE_INVENTORY,  API_BOARD, FILESIZE_FORM, NOTICE_BOARD } from "../../constants/page_constant";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    // 로그아웃 로직을 여기에 추가하세요
    console.log("로그아웃");
    // 예를 들어, 세션을 삭제하고 로그인 페이지로 리디렉션할 수 있습니다.
    // sessionStorage.removeItem("user");
    // window.location.href = "/login";
  };

  return (
    <div className="bg-[#ffcf8f] text-black h-screen w-64 p-4 flex flex-col">
      <div>
        <div className="logo mb-8">
          <a href="/public" className="text-2xl font-semibold">
            KSIS
          </a>
        </div>
        <div className="mb-4">
          <a className="flex items-center px-2 font-semibold text-black text-lg">
            <CiFaceSmile className="mr-2" size="24" />
            <span>강현주(hyeonju)</span>
          </a>
        </div>
        <div className="flex space-x-2 mb-4">
          <a
            href="#"
            className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded"
          >
            <BiUser className="mr-1" />
            <span>계정정보</span>
          </a>
          <a
            href="#"
            className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded"
          >
            <BiBell className="mr-1" />
            <span>알림</span>
          </a>
        </div>
        <hr className="border-black border-1 border-dashed" />
        <div className="menu--list">
          <div className="item mt-3">
            <div
              className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded cursor-pointer"
              onClick={() => toggleMenu("account")}
            >
              <MdManageAccounts className="mr-3" />
              <span>계정관리</span>
            </div>
            {openMenu === "account" && (
                <div className="submenu ml-8 mt-2">
                  <Link to="/accountList" className="block py-1">
                    계정목록 조회
                  </Link>
                  <a href="#" className="block py-1">
                    로그기록
                  </a>
                </div>
            )}
          </div>
          <div className="item mt-3">
          <div
              className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded cursor-pointer"
              onClick={() => toggleMenu("profile")}
            >
              <MdOutlinePermMedia className="mr-3" />
              <span>미디어 관리</span>
            </div>
            {openMenu === "profile" && (
              <div className="submenu ml-8 mt-2">
                <a href="#" className="block py-1">
                  이미지 관리
                </a>
                <a href="#" className="block py-1">
                  영상 관리
                </a>
              </div>
            )}
          </div>
          <div className="item mt-3">
            <div className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded cursor-pointer">
              <MdChat className="mr-3" />
              <span><Link
                  to={NOTICE_BOARD} className="block py-1">공지글 관리</Link></span>
            </div>
          </div>
          <div className="item mt-3">
            <div
              className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded cursor-pointer"
              onClick={() => toggleMenu("device")}
            >
              <MdDevices className="mr-3" />
              <span>디바이스 관리</span>
            </div>
            {openMenu === "device" && (
              <div className="submenu ml-8 mt-2">
                <Link
                  to={SIGNAGE_INVENTORY}
                  className="flex items-center block py-1 mt-3 hover:bg-[#fe6500]/30 rounded cursor-pointer"
                >
                  <FaRegCircle size={10} className="mr-2" />
                  <span>재생장치 관리</span>
                </Link>
                <Link
                  to={PC_INVENTORY}
                  className="flex items-center block py-1 mt-3 hover:bg-[#fe6500]/30 rounded cursor-pointer"
                >
                  <FaRegCircle size={10} className="mr-2" />
                  <span>일반 PC 관리</span>
                </Link>
              </div>
            )}
          </div>
          <div className="item mt-3">
            <div
              className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded cursor-pointer"
              onClick={() => toggleMenu("settings")}
            >
              <BiCog className="mr-3" />
              <span>기타 관리</span>
            </div>
            {openMenu === "settings" && (
              <div className="submenu ml-8 mt-2">
                <Link  to={API_BOARD} className="flex items-center block py-1 mt-3 hover:bg-[#fe6500]/30 rounded cursor-pointer">
                <FaRegCircle size={10} className="mr-2" />
                <span>
                  API 조회
                  </span>
                </Link >
                <Link  to={FILESIZE_FORM} className="flex items-center block py-1 mt-3 hover:bg-[#fe6500]/30 rounded cursor-pointer">
                <FaRegCircle size={10} className="mr-2" />
                <span>
                  용량 관리
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center p-2 hover:bg-[#fe6500]/30 rounded"
        >
          <RiLogoutBoxRLine className="mr-2" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
