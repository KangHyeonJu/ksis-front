import React, { useEffect, useState } from "react";
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
import {
  PC_INVENTORY,
  SIGNAGE_INVENTORY,
  API_BOARD,
  FILESIZE_FORM,
  NOTICE_BOARD,
  IMAGE_FILE_BOARD,
  VIDEO_FILE_BOARD,
} from "../../constants/page_constant";
import { jwtDecode } from "jwt-decode";
import fetcher from "../../fetcher";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [userInfo, setUserInfo] = useState({ accountId: "", roles: [] });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        localStorage.setItem("authority", decodedToken.auth);
        localStorage.setItem("accountId", decodedToken.sub);
        console.log(decodedToken);
        setUserInfo({
          accountId: decodedToken.sub, // 토큰에서 계정 ID 가져오기
          roles: decodedToken.auth, // 토큰에서 권한 정보 가져오기
        });
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = async () => {
    // 로그아웃 로직을 여기에 추가하세요
    const accountId = localStorage.getItem('accountId');

    try {
      // 서버로 로그아웃 요청 전송
      await fetcher.delete(`/logout/${accountId}`);

      await fetcher.post('/access-log',{
        accountId,
        category: 'LOGOUT',
      })
      // 로그아웃 성공 시 로컬스토리지 토큰 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('accountId');
      localStorage.removeItem("authority");
      window.location.href = "/downloadApp";
    } catch (error) {
      console.error("로그아웃 실패: ", error);
    }
  };

  const handleMenuClick = async (category) => {
    const accessLog = {
      accountId: userInfo.accountId,
      category: category,
    };
    try {
      const response = await fetcher.post("/access-log", accessLog);
      console.log("Log saved successfully", response.data);
    } catch (error) {
      console.error("Error saving log:", error);
      alert(error.response?.data || "Unknown error occurred");
    }
  };

  const isAdmin = userInfo.roles.includes("ROLE_ADMIN");

  return (
    <div className="bg-[#ffcf8f] text-black h-screen w-64 p-4 flex flex-col">
      <div>
        <div className="logo mb-8">
          <a
            href="/main"
            className="text-2xl font-semibold"
            onClick={() => handleMenuClick("MAIN")}
          >
            KSIS
          </a>
        </div>
        <div className="mb-4">
          <a className="flex items-center px-2 font-semibold text-black text-lg">
            <CiFaceSmile className="mr-2" size="24" />
            <span>{userInfo.accountId}</span>
          </a>
        </div>
        <div className="flex space-x-2 mb-4">
          <a
            href="#"
            className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded"
            onClick={() => handleMenuClick("ACCOUNT_INFO")}
          >
            <BiUser className="mr-1" />
            <Link to={`/account/${userInfo.accountId}`}> 계정정보</Link>
          </a>
          <a
            href="#"
            className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded"
            onClick={() => handleMenuClick("NOTIFICATION")}
          >
            <BiBell className="mr-1" />
            <span>알림</span>
          </a>
        </div>
        <hr className="border-black border-1 border-dashed" />
        <div className="menu--list">
          {isAdmin && (
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
                  <Link
                    to="/accountList"
                    className="block py-1"
                    onClick={() => handleMenuClick("ACCOUNT_LIST")}
                  >
                    계정목록 조회
                  </Link>
                  <a
                    href="#"
                    className="block py-1"
                    onClick={() => handleMenuClick("LOG")}
                  >
                    로그기록
                  </a>
                </div>
              )}
            </div>
          )}
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
                <Link
                  to={IMAGE_FILE_BOARD}
                  onClick={() => handleMenuClick("IMAGE")}
                  className="flex items-center py-1 mt-3 hover:bg-[#fe6500]/30 rounded cursor-pointer"
                >
                  <FaRegCircle size={10} className="mr-2" />
                  이미지 관리
                </Link>
                <Link
                  to={VIDEO_FILE_BOARD}
                  onClick={() => handleMenuClick("VIDEO")}
                  className="flex items-center py-1 mt-3 hover:bg-[#fe6500]/30 rounded cursor-pointer"
                >
                  <FaRegCircle size={10} className="mr-2" />
                  영상 관리
                </Link>
              </div>
            )}
          </div>
          <div className="item mt-3">
            <div className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded cursor-pointer">
              <MdChat className="mr-3" />
              <span>
                <Link
                  to={NOTICE_BOARD}
                  className="block py-1"
                  onClick={() => handleMenuClick("NOTICE")}
                >
                  공지글 관리
                </Link>
              </span>
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
                  onClick={() => handleMenuClick("SIGNAGE")}
                  className="flex items-center py-1 mt-3 hover:bg-[#fe6500]/30 rounded cursor-pointer"
                >
                  <FaRegCircle size={10} className="mr-2" />
                  <span>재생장치 관리</span>
                </Link>
                <Link
                  to={PC_INVENTORY}
                  onClick={() => handleMenuClick("PC")}
                  className="flex items-center py-1 mt-3 hover:bg-[#fe6500]/30 rounded cursor-pointer"
                >
                  <FaRegCircle size={10} className="mr-2" />
                  <span>일반 PC 관리</span>
                </Link>
              </div>
            )}
          </div>
          {isAdmin && (
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
                  <Link
                    to={API_BOARD}
                    onClick={() => handleMenuClick("API")}
                    className="flex items-center py-1 mt-3 hover:bg-[#fe6500]/30 rounded cursor-pointer"
                  >
                    <FaRegCircle size={10} className="mr-2" />
                    <span>API 조회</span>
                  </Link>
                  <Link
                    to={FILESIZE_FORM}
                    onClick={() => handleMenuClick("FILE_SIZE")}
                    className="flex items-center py-1 mt-3 hover:bg-[#fe6500]/30 rounded cursor-pointer"
                  >
                    <FaRegCircle size={10} className="mr-2" />
                    <span>용량 관리</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto">
        <button
          onClick={() => {
            handleMenuClick('LOGOUT');
            handleLogout();
          }}
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
