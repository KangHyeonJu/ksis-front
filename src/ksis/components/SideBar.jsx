import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link 컴포넌트 import
import {BiUser, BiCog, BiTrash, BiWindowAlt} from "react-icons/bi"; // 필요한 아이콘 import
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
  IMAGE_RESOURCE_BOARD,
  IMAGE_FILE_BOARD,
  ACCESSLOG_INVENTORY,
  MAIN,
  RESOLUTION_LIST,
  TRASH_IMAGE_FILE,
  TRASH_NOTICE,
} from "../../constants/page_constant";
import fetcher from "../../fetcher";
import ksisLogo from "../../img/ksis-logo.png";
import Notification from "../pages/notification/Notification"; // 알림 모달 컴포넌트 import
import NotificationCountComponent from "../pages/notification/NotificationCount"; // 알림 개수 컴포넌트
import { decodeJwt } from "../../decodeJwt";
import {ACCESS_LOG, ACCOUNT_LIST, ACCOUNT_LIST_BOARD, LOG_OUT} from "../../constants/account_constant";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [userInfo, setUserInfo] = useState({ accountId: "", roles: [] });
  const [isNotificationOpen, setNotificationOpen] = useState(false); // 알림 모달 상태 추가
  const [selectedMenu, setSelectedMenu] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const ws = useRef(null);
  const accessToken = localStorage.getItem("accessToken");
  const API_WS_URL = process.env.REACT_APP_API_WS_URL;

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false); // 특정 크기 이하에서는 축소
    } else {
      setIsSidebarOpen(true); // 그 이상에서는 확장
    }
  };

  useEffect(() => {
    const userInfo = decodeJwt();
    if (userInfo) {
      setUserInfo(userInfo);
    }
    handleResize();

    ws.current = new WebSocket(API_WS_URL + "/ws/login");

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
      ws.current.send(
        JSON.stringify({ action: "register", token: accessToken })
      );
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.action === "logout") {
        console.log("Logout action received via WebSocket");
        localStorage.removeItem("accessToken");
        navigate("/downloadApp"); // 로그아웃 후 로그인 페이지로 이동
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = async () => {
    const accountId = userInfo.accountId;

    try {
      // 서버로 로그아웃 요청 전송
      await fetcher.delete(`${LOG_OUT}/${accountId}`);

      await fetcher.post(ACCESS_LOG, {
        accountId,
        category: "LOGOUT",
      });

      ws.current.send(JSON.stringify({ action: "logout", token: accessToken }));

      // 로그아웃 성공 시 로컬스토리지 토큰 제거
      // alert("로그아웃되었습니다.");
      localStorage.removeItem("accessToken");
      navigate("/downloadApp");
    } catch (error) {
      console.error("로그아웃 실패: ", error);
    }
  };

  const handleMenuClick = async (category) => {
    setSelectedMenu(category);
    const accessLog = {
      accountId: userInfo.accountId,
      category: category,
    };
    try {
      const response = await fetcher.post(ACCESS_LOG, accessLog);
      console.log("Log saved successfully", response.data);
    } catch (error) {
      console.error("Error saving log:", error);
    }
  };

  const isAdmin = userInfo.roles.includes("ROLE_ADMIN");

  const handleOpenApp = () => {
    window.location.href = "ksis://open";
  };

  if (isSidebarOpen) {
  return (
    <div className="bg-gray-100 text-black fixed top-0 left-0 h-full w-64 p-4 flex flex-col">
      {/* 알림 모달 창 표시 */}
      {isNotificationOpen && (
        <Notification onClose={() => setNotificationOpen(false)} />
      )}

      <div>
        <div className="logo mb-8">
          <Link
            to={MAIN}
            className="text-2xl font-semibold"
            onClick={() => handleMenuClick("MAIN")}
          >
            <img src={ksisLogo} alt="KSIS Logo" className="w-32" />
          </Link>
        </div>
        <div className="mb-4">
          <a className="flex items-center px-2 font-semibold text-black text-lg">
            <CiFaceSmile className="mr-2" size="24" />
            <span>{userInfo.accountId}</span>
          </a>
        </div>
        <div className="flex space-x-0.2 mb-4">
          <Link
              to={`/account/${userInfo.accountId}`}
              className={`flex items-center p-2 rounded cursor-pointer ${selectedMenu === "ACCOUNT_INFO" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'} w-24 whitespace-nowrap`}
              onClick={() => handleMenuClick("ACCOUNT_INFO")}
          >
            <BiUser className="mr-1"/>
            정보
          </Link>
          <a
              className="relative flex items-center p-2 hover:bg-[#fe6500]/30 rounded w-24 whitespace-nowrap"
              onClick={() => setNotificationOpen(true)} // 알림 버튼 클릭 시 모달 열기
          >
            <NotificationCountComponent/>
            <span>알림</span>
          </a>
          <a
              className="relative flex items-center p-2 hover:bg-[#fe6500]/30 rounded w-24 whitespace-nowrap"
              onClick={handleOpenApp}
          >
            <BiWindowAlt className="mr-1"/>
            App
          </a>


        </div>
        <hr className="border-black border-1 border-dashed"/>
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
                    to={ACCOUNT_LIST_BOARD}
                    className={`flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "ACCOUNT_LIST" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                    onClick={() => handleMenuClick("ACCOUNT_LIST")}
                  >
                    <FaRegCircle size={10} className="mr-2" />
                    계정목록 조회
                  </Link>
                  <Link
                    to={ACCESSLOG_INVENTORY}
                    onClick={() => handleMenuClick("LOG")}
                    className={`flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "LOG" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                  >
                    <FaRegCircle size={10} className="mr-2" />
                    로그 기록
                  </Link>
                </div>
              )}
            </div>
          )}
          <div className="item mt-3">
            <div
              className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded cursor-pointer"
              onClick={() => toggleMenu("media")}
            >
              <MdOutlinePermMedia className="mr-3" />
              <span>미디어 관리</span>
            </div>
            {openMenu === "media" && (
              <div className="submenu ml-8 mt-2">
                <Link
                  to={IMAGE_RESOURCE_BOARD}
                  onClick={() => handleMenuClick("ORIGINAL")}
                  className={`flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "ORIGINAL" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                >
                  <FaRegCircle size={10} className="mr-2" />
                  원본 관리
                </Link>
                <Link
                  to={IMAGE_FILE_BOARD}
                  onClick={() => handleMenuClick("ENCODED")}
                  className={`flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "ENCODED" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                >
                  <FaRegCircle size={10} className="mr-2" />
                  인코딩 관리
                </Link>
              </div>
            )}
          </div>
          <div className="item mt-3">
            <Link
              to={NOTICE_BOARD}
              className={`flex items-center p-2 rounded cursor-pointer ${selectedMenu === "NOTICE" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
              onClick={() => handleMenuClick("NOTICE")}
            >
              <MdChat className="mr-3" />
              <span>공지글 관리</span>
            </Link>
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
                  className={`flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "SIGNAGE" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                >
                  <FaRegCircle size={10} className="mr-2" />
                  <span>재생장치 관리</span>
                </Link>
                <Link
                  to={PC_INVENTORY}
                  onClick={() => handleMenuClick("PC")}
                  className={`flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "PC" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
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
                <Link
                  to={RESOLUTION_LIST}
                  onClick={() => handleMenuClick("RESOLUTION")}
                  className={`flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "RESOLUTION" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                >
                  <FaRegCircle size={10} className="mr-2" />
                  <span>해상도 관리</span>
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      to={API_BOARD}
                      onClick={() => handleMenuClick("API")}
                      className={`flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "API" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                    >
                      <FaRegCircle size={10} className="mr-2" />
                      <span>API 관리</span>
                    </Link>

                    <Link
                      to={FILESIZE_FORM}
                      onClick={() => handleMenuClick("FILE_SIZE")}
                      className={`flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "FILE_SIZE" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                    >
                      <FaRegCircle size={10} className="mr-2" />
                      <span>용량 관리</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="item mt-3">
            <div
              className="flex items-center p-2 hover:bg-[#fe6500]/30 rounded cursor-pointer"
              onClick={() => toggleMenu("trash")}
            >
              <BiTrash className="mr-3" />
              <span>휴지통</span>
            </div>
            {openMenu === "trash" && (
              <div className="submenu ml-8 mt-2">
                <Link
                  to={TRASH_IMAGE_FILE}
                  onClick={() => handleMenuClick("TRASHFILE")}
                  className={`flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "TRASHFILE" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                >
                  <FaRegCircle size={10} className="mr-2" />
                  <span>이미지 및 영상</span>
                </Link>

                <Link
                  to={TRASH_NOTICE}
                  onClick={() => handleMenuClick("TRASHNOTICE")}
                  className={`flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "TRASHNOTICE" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                >
                  <FaRegCircle size={10} className="mr-2" />
                  <span>공지글</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <button
          onClick={() => {
            handleMenuClick("LOGOUT");
            handleLogout();
          }}
          className="w-full text-left flex items-center p-2 hover:bg-[#fe6500]/30 rounded"
        >
          <RiLogoutBoxRLine className="mr-2" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  )} else {
    return (
        <div className="bg-gray-100 text-black fixed top-0 left-0 h-full p-4 flex flex-col">
          {/* 알림 모달 창 표시 */}
          {isNotificationOpen && (
              <Notification onClose={() => setNotificationOpen(false)}/>
          )}

          <div>
            <div className="logo mb-8">
              <Link to={MAIN} className="text-2xl font-semibold">
                <img src={ksisLogo} alt="KSIS Logo" className="w-10 h-10"/>
              </Link>
            </div>
            <div className="flex flex-col space-y-4 mb-4">
              <Link
                  to={`/account/${userInfo.accountId}`}
                  className={`flex items-center p-2 rounded cursor-pointer relative group ${selectedMenu === "ACCOUNT_INFO" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                  onClick={() => handleMenuClick("ACCOUNT_INFO")}
              >
                <BiUser className="mr-1"/>
                <span
                    className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
            정보
          </span>
              </Link>

              <a
                  className="relative flex items-center p-2 rounded cursor-pointer group hover:bg-[#fe6500]/30"
                  onClick={() => setNotificationOpen(true)}
              >
                <NotificationCountComponent/>
                <span
                    className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
            알림
          </span>
              </a>

              <a
                  className="relative flex items-center p-2 rounded cursor-pointer group hover:bg-[#fe6500]/30"
                  onClick={handleOpenApp}
              >
                <BiWindowAlt className="mr-1"/>
                <span
                    className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded">
            앱
          </span>
              </a>
            </div>
            <hr className="border-black border-1 border-dashed"/>
            {isAdmin && (
                <div className="mt-3">
                  <div
                      className={`flex items-center p-2 rounded cursor-pointer hover:bg-[#fe6500]/30 relative group`}
                      onClick={() => toggleMenu("account")}
                  >
                    <MdManageAccounts className="mr-3"/>
                    <span
                        className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">계정관리</span>
                  </div>
                  {openMenu === "account" && (
                      <div className="submenu ml-8 mt-2">
                        <Link
                            to={ACCOUNT_LIST_BOARD}
                            className={`group flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "ACCOUNT_LIST" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                            onClick={() => handleMenuClick("ACCOUNT_LIST")}
                        >
                          <FaRegCircle size={10} className="mr-2" />
                          <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
                            계정목록 조회
                          </span>
                        </Link>
                        <Link
                            to={ACCESSLOG_INVENTORY}
                            onClick={() => handleMenuClick("LOG")}
                            className={`group flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "LOG" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                        >
                          <FaRegCircle size={10} className="mr-2" />
                          <span className="absolute left-full hidden group-hover:block mr-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
                            로그 기록
                          </span>
                        </Link>
                      </div>
                  )}

                </div>
            )}

            <div className="item mt-3">
              <div
                  className={`flex items-center p-2 rounded cursor-pointer hover:bg-[#fe6500]/30 relative group`}
                  onClick={() => toggleMenu("media")}
              >
                <MdOutlinePermMedia className="mr-3"/>
                <span
                    className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">미디어 관리</span>
              </div>
              {openMenu === "media" && (
                  <div className="submenu ml-8 mt-2">
                    <Link
                        to={IMAGE_RESOURCE_BOARD}
                        onClick={() => handleMenuClick("ORIGINAL")}
                        className={`group flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "ORIGINAL" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                    >
                      <FaRegCircle size={10} className="mr-2"/>
                      <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
                        원본 관리
                      </span>
                    </Link>
                    <Link
                        to={IMAGE_FILE_BOARD}
                        onClick={() => handleMenuClick("ENCODED")}
                        className={`group flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "ENCODED" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                    >
                      <FaRegCircle size={10} className="mr-2"/>
                      <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
                        인코딩 관리
                      </span>
                    </Link>
                  </div>
              )}
            </div>

            <div className="mt-3">
              <Link
                  to={NOTICE_BOARD}
                  className={`flex items-center p-2 rounded cursor-pointer hover:bg-[#fe6500]/30 relative group`}
                  onClick={() => handleMenuClick("NOTICE")}
              >
                <MdChat className="mr-3"/>
                <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">공지글 관리</span>
              </Link>
            </div>

            <div className="item mt-3">
              <div
                  className={`flex items-center p-2 rounded cursor-pointer hover:bg-[#fe6500]/30 relative group`}
                  onClick={() => toggleMenu("device")}
              >
                <MdDevices className="mr-3"/>
                <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">디바이스 관리</span>
              </div>
              {openMenu === "device" && (
                  <div className="submenu ml-8 mt-2">
                    <Link
                        to={SIGNAGE_INVENTORY}
                        onClick={() => handleMenuClick("SIGNAGE")}
                        className={`group flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "SIGNAGE" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                    >
                      <FaRegCircle size={10} className="mr-2"/>
                      <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
                        재생장치 관리
                      </span>
                    </Link>
                    <Link
                        to={PC_INVENTORY}
                        onClick={() => handleMenuClick("PC")}
                        className={`group flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "PC" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                    >
                      <FaRegCircle size={10} className="mr-2"/>
                      <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
                        일반 PC 관리
                      </span>
                    </Link>
                  </div>
              )}
            </div>

            <div className="item mt-3">
              <div
                  className={`flex items-center p-2 rounded cursor-pointer hover:bg-[#fe6500]/30 relative group`}
                  onClick={() => toggleMenu("settings")}
              >
                <BiCog className="mr-3"/>
                <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">기타 관리</span>
              </div>
              {openMenu === "settings" && (
                  <div className="submenu ml-8 mt-2">
                    <Link
                        to={RESOLUTION_LIST}
                        onClick={() => handleMenuClick("RESOLUTION")}
                        className={`group flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "RESOLUTION" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                    >
                      <FaRegCircle size={10} className="mr-2"/>
                      <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
                        해상도 관리
                      </span>
                    </Link>
                    {isAdmin && (
                        <>
                          <Link
                              to={API_BOARD}
                              onClick={() => handleMenuClick("API")}
                              className={`group flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "API" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                          >
                            <FaRegCircle size={10} className="mr-2"/>
                            <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
                              API 관리
                            </span>
                          </Link>

                          <Link
                              to={FILESIZE_FORM}
                              onClick={() => handleMenuClick("FILE_SIZE")}
                              className={`group flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "FILE_SIZE" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                          >
                            <FaRegCircle size={10} className="mr-2"/>
                            <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
                              용량 관리
                            </span>
                          </Link>
                        </>
                    )}
                  </div>
              )}
            </div>

            <div className="item mt-3">
              <div
                  className={`flex items-center p-2 rounded cursor-pointer hover:bg-[#fe6500]/30 relative group`}
                  onClick={() => toggleMenu("trash")}
              >
                <BiTrash className="mr-3"/>
                <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">휴지통</span>
              </div>
              {openMenu === "trash" && (
                  <div className="submenu ml-8 mt-2">
                    <Link
                        to={TRASH_IMAGE_FILE}
                        onClick={() => handleMenuClick("TRASHFILE")}
                        className={`group flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "TRASHFILE" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                    >
                      <FaRegCircle size={10} className="mr-2"/>
                      <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
                        이미지 및 영상
                      </span>
                    </Link>

                    <Link
                        to={TRASH_NOTICE}
                        onClick={() => handleMenuClick("TRASHNOTICE")}
                        className={`group flex items-center py-1 mt-3 rounded cursor-pointer ${selectedMenu === "TRASHNOTICE" ? 'bg-[#fe6500]/30' : 'hover:bg-[#fe6500]/30'}`}
                    >
                      <FaRegCircle size={10} className="mr-2"/>
                      <span className="absolute left-full hidden group-hover:block ml-2 bg-black text-white p-1 text-sm rounded whitespace-nowrap">
                        공지글
                      </span>
                    </Link>
                  </div>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <button
                onClick={() => {
                  handleMenuClick("LOGOUT");
                  handleLogout();
                }}
                className={`flex items-center p-2 rounded cursor-pointer hover:bg-[#fe6500]/30 relative group`}
            >
              <RiLogoutBoxRLine className="mr-2"/>
              <span
                  className="absolute left-full hidden group-hover:flex group-hover:ml-2 bg-black text-white p-1 text-xs rounded whitespace-nowrap">로그아웃</span>
            </button>
          </div>
        </div>
    );
  }
};


export default Sidebar;
