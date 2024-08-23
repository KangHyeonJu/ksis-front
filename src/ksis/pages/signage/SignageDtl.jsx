import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import fetcher from "../../../fetcher";
import {
  SIGNAGE_LIST,
  SIGNAGE_PLAYLIST,
  SIGNAGE_UPDATE,
} from "../../../constants/api_constant";
import { SIGNAGE_UPDATE_FORM } from "../../../constants/page_constant";
import LocationModal from "../../components/LocationModal";
import { Switch } from "@headlessui/react";
import { format, parseISO } from "date-fns";
import NoticeModal from "./NoticeModal";
import SignageResourceModal from "./SignageResourceModal";
import SignagePlaylistModal from "./SignagePlaylistModal";
import PlaylistUpdateModal from "./PlaylistUpdateModal";

const SignageDtl = () => {
  const [enabled, setEnabled] = useState(false);
  const [radiobox, setRadiobox] = useState(null);

  //불러오기
  const [data, setData] = useState({});
  const params = useParams();
  const [playlists, setPlaylists] = useState([]);

  const [playlistDtl, setPlaylistDtl] = useState([]);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [slideTime, setSlideTime] = useState(null);
  const [playListId, setPlayListId] = useState(null);

  //위치 지도 보기
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  //공지 조회
  const [noticeModalIsOpen, setNoticeModalIsOpen] = useState(false);
  const openNoticeModal = () => setNoticeModalIsOpen(true);
  const closeNoticeModal = () => setNoticeModalIsOpen(false);

  //이미지/영상 불러오기
  const [resourceModalIsOpen, setResourceModalIsOpen] = useState(false);
  const openResourceModal = () => setResourceModalIsOpen(true);
  const closeResourceModal = () => setResourceModalIsOpen(false);

  //재생목록 추가
  const [playlistAddIsOpen, setPlaylistAddIsOpen] = useState(false);
  const openPlaylistAdd = () => setPlaylistAddIsOpen(true);
  const closePlaylistAdd = () => setPlaylistAddIsOpen(false);

  //재생목록 수정
  const [playlistUpdateIsOpen, setPlaylistUpdateIsOpen] = useState(false);
  const openPlaylistUpdate = () => setPlaylistUpdateIsOpen(true);
  const closePlaylistUpdate = () => setPlaylistUpdateIsOpen(false);

  // 이전 페이지로 이동
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1);
  };

  const loadSignageDtl = async (signageId) => {
    try {
      const response = await fetcher.get(SIGNAGE_LIST + `/${signageId}`);
      console.log("Signage response:", response);
      setData(response.data);

      const playlistResponse = await fetcher.get(
        SIGNAGE_PLAYLIST + `/${signageId}`
      );

      console.log("Playlist data:", playlistResponse);
      setPlaylists(playlistResponse.data);

      const selectedPlaylist = playlistResponse.data.find(
        (playlist) => playlist.play === true
      );
      if (selectedPlaylist) {
        setRadiobox(selectedPlaylist.playlistId);
      }

      setEnabled(response.data.isShow);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    loadSignageDtl(params.id);
  }, [params.id]);

  // Switch 상태 변경 핸들러
  const handleToggle = async () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    try {
      await fetcher.put(SIGNAGE_UPDATE + `/${data.deviceId}`, {
        showNotice: newEnabled,
      });
      console.log("DB 상태 업데이트 성공");
    } catch (error) {
      console.error("DB 상태 업데이트 실패", error);
    }
  };

  const formattedDate = data.regTime
    ? format(parseISO(data.regTime), "yyyy-MM-dd")
    : "";

  //재생목록 선택
  const onChangeRadio = async (e) => {
    const selectedRadiobox = Number(e.target.value);
    setRadiobox(selectedRadiobox);

    try {
      await fetcher.put(SIGNAGE_PLAYLIST + `/${data.deviceId}`, {
        selectedPlaylist: selectedRadiobox,
      });
      console.log("DB 상태 업데이트 성공");
    } catch (error) {
      console.error("DB 상태 업데이트 실패", error);
    }
  };

  //재생목록 조회
  const onClickPlaylist = async (playlistId, title, playTime) => {
    try {
      console.log(playlistId);
      const response = await fetcher.get(SIGNAGE_PLAYLIST, {
        params: { playlistDtlId: playlistId },
      });
      console.log(response);

      setPlaylistDtl(response.data);

      setSlideTime(playTime);
      setPlaylistTitle(title);
      setPlayListId(playlistId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //재생목록 수정
  const openPlaylist = () => {
    if (playListId == null) {
      alert("수정할 재생목록을 선택하세요.");
    } else {
      openPlaylistUpdate();
    }
  };

  //재생목록 삭제
  const deletePlaylist = async (playlistId) => {
    try {
      if (playlistId == null) {
        alert("삭제할 재생목록을 선택하세요.");
      } else {
        if (window.confirm("삭제하시겠습니까?")) {
          const response = await fetcher.delete(SIGNAGE_PLAYLIST, {
            params: { playlistId: playlistId },
          });

          console.log(response.data);

          setPlaylists((prevPlaylists) =>
            prevPlaylists.filter(
              (playlist) => playlist.playlistId !== playlistId
            )
          );

          alert("삭제되었습니다.");

          setPlaylistDtl([]);
          setSlideTime(null);
          setPlaylistTitle("");
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        재생장치 설정
      </h1>
      <div className="text-center pt-5 pb-5">
        <div className="flex items-center">
          <input
            value={data.deviceName}
            readOnly
            maxLength="50"
            name="deviceName"
            type="text"
            className="bg-[#ffe374] block w-80 px-4 py-1.5 text-gray-900 text-center h-10"
          />
          <button
            onClick={openNoticeModal}
            type="button"
            className="ml-2 h-10 relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            공지조회
          </button>
          <NoticeModal
            isOpen={noticeModalIsOpen}
            onRequestClose={closeNoticeModal}
            signageId={data.deviceId}
          />

          <div className="ml-auto">공지 표시</div>
          <Switch
            checked={enabled}
            onChange={handleToggle}
            className="ml-2 group relative inline-flex h-6 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 data-[checked]:bg-orange-600"
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={`${
                enabled ? "translate-x-10" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
            <span
              className={`absolute left-2 text-sm font-medium transition duration-200 ease-in-out ${
                enabled ? "opacity-100" : "opacity-0"
              }`}
            >
              ON
            </span>
            <span
              className={`absolute right-2 text-sm font-medium transition duration-200 ease-in-out ${
                enabled ? "opacity-0" : "opacity-100"
              }`}
            >
              OFF
            </span>
          </Switch>
        </div>

        <div className="flex items-center mt-5">
          <input
            type="text"
            value={data.location}
            readOnly
            className="flex-auto bg-[#ffe374] block w-80 px-4 py-1.5 text-gray-900 text-center h-10"
          />
          <button
            onClick={openModal}
            type="button"
            className="relative h-10 inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            위치 보기
          </button>
          <LocationModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            address={data.location}
          />

          <input
            type="text"
            value={formattedDate}
            readOnly
            className="flex-none bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center h-10"
          />

          <input
            value={data.macAddress}
            type="text"
            className="flex-auto bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center h-10"
          />
          <button
            type="button"
            className="ml-2 h-10 relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Link to={SIGNAGE_UPDATE_FORM + `/${data.deviceId}`}>
              정보 수정
            </Link>
          </button>
        </div>

        <div className="flex items-center mt-5">
          <input
            value={data.screenSize}
            type="text"
            className="flex-none h-10 bg-[#ffe374] block w-40 px-4 py-1.5 text-gray-900 text-center"
          />

          <input
            value={data.resolution}
            type="text"
            className="flex-1 h-10 bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />

          <input
            type="text"
            value={
              data.accountList &&
              data.accountList
                .map((account) => `${account.name}(${account.accountId})`)
                .join(", ")
            }
            readOnly
            className="flex-auto h-10 bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />
        </div>

        <div className="flex items-center mt-5">
          <button
            onClick={openResourceModal}
            type="button"
            className="rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            영상/이미지 불러오기
          </button>
          <SignageResourceModal
            isOpen={resourceModalIsOpen}
            onRequestClose={closeResourceModal}
            signageId={data.deviceId}
          />
        </div>

        <div className="flex items-center mt-5">
          <div className="flex-1 overflow-y-auto bg-[#ffe374] px-4 py-4 h-140">
            <div className="flex items-center justify-between space-x-2">
              <div className="text-lg font-semibold ml-2">재생목록 내역</div>
              <button
                onClick={openPlaylistAdd}
                type="button"
                className="relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                추가
              </button>
              <SignagePlaylistModal
                isOpen={playlistAddIsOpen}
                onRequestClose={closePlaylistAdd}
                signageId={data.deviceId}
              />
            </div>
            <table className="min-w-full divide-y divide-gray-300 border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-[#ffe69c]">
                  <th className="border border-gray-400 p-2">재생목록명</th>
                  <th className="border border-gray-400 p-2">등록일</th>
                  <th className="border border-gray-400 p-2">선택</th>
                </tr>
              </thead>
              <tbody>
                {playlists.map((playlist) => (
                  <tr
                    key={playlist.playlistId}
                    className={`${
                      playListId === playlist.playlistId
                        ? "bg-orange-50"
                        : "bg-white"
                    }`}
                    onClick={() =>
                      onClickPlaylist(
                        playlist.playlistId,
                        playlist.title,
                        playlist.playTime
                      )
                    }
                  >
                    <td className="border border-gray-400 p-2">
                      {playlist.title}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {format(parseISO(playlist.regTime), "yyyy-MM-dd")}
                    </td>
                    <td className="border border-gray-400 p-2">
                      <input
                        type="radio"
                        className="border-gray-300 text-orange-600 focus:ring-orange-600"
                        value={playlist.playlistId}
                        onChange={onChangeRadio}
                        name="selectedPlaylist"
                        checked={radiobox === playlist.playlistId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex-1 overflow-y-auto bg-[#ffe374] ml-2 px-4 py-4 h-140">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold ml-2">{playlistTitle}</div>
              <div className="bg-[#d9d9d8] p-1 flex">
                <p className="bg-[#f2f2f2] pr-1 pl-1">slide time</p>
                <p className="bg-white pr-1 pl-1 ml-1">{slideTime}(s)</p>
              </div>
              <div>
                <button
                  type="button"
                  className="relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  onClick={openPlaylist}
                >
                  수정
                </button>
                <PlaylistUpdateModal
                  isOpen={playlistUpdateIsOpen}
                  onRequestClose={closePlaylistUpdate}
                  signageId={data.deviceId}
                  playlistId={playListId}
                />
                <button
                  type="button"
                  className="ml-2 relative inline-flex items-center rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  onClick={() => deletePlaylist(playListId)}
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3">
              {playlistDtl.map((resource) => (
                <div
                  key={resource.encodedResourceId}
                  className="group relative border border-gray-900 mb-5"
                >
                  <div className="absolute top-0 left-0 m-2 rounded-full border border-black bg-gray-200 h-6 w-6 flex items-center justify-center">
                    {resource.sequence}
                  </div>

                  <div className="w-full overflow-hidden bg-gray-200 lg:h-52">
                    <img
                      src={resource.thumbFilePath}
                      alt={resource.fileTitle}
                      height=""
                      width=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="text-gray-700 text-center w-full p-1 bg-white">
                    {resource.fileTitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center mt-5 justify-between">
          <button
            type="button"
            className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={onCancel}
          >
            뒤로가기
          </button>
          <button
            type="button"
            className="rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            재생
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignageDtl;
