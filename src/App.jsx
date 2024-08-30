import { Routes, Route } from "react-router-dom";
import Sidebar from "./ksis/components/SideBar";
import "./index.css";
import {
  API_BOARD,
  API_FORM,
  FILESIZE_FORM,
  NOTICE_BOARD,
  NOTICE_FORM,
  NOTICE_DTL,
  IMAGE_RESOURCE_BOARD,
  IMAGE_FILE_BOARD,
  VIDEO_RESOURCE_BOARD,
  VIDEO_FILE_BOARD,
  VIDEO_RESOURCE_MODAL,
  VIDEO_ENCODING,
  IMAGE_RESOURCE_MODAL,
  IMAGE_ENCODING,
} from "./constants/page_constant";
import {
  PC_DTL,
  PC_FORM,
  PC_INVENTORY,
  PC_UPDATE_FORM,
  SIGNAGE_DTL,
  SIGNAGE_FORM,
  SIGNAGE_GRID,
  SIGNAGE_INVENTORY,
  SIGNAGE_UPDATE_FORM,
} from "./constants/page_constant";
import {
  ACCOUNT_EDIT_FORM,
  ACCOUNT_FORM,
  ACCOUNT_LIST,
  TOKEN_CALLBACK,
} from "./constants/account_constant";
import PcForm from "./ksis/pages/pc/PcForm";
import PcList from "./ksis/pages/pc/PcList";
import PcDtl from "./ksis/pages/pc/PcDtl";
import PcUpdateForm from "./ksis/pages/pc/PcUpdateForm";
import SignageList from "./ksis/pages/signage/SignageList";
import SignageForm from "./ksis/pages/signage/SignageForm";
import SignageGrid from "./ksis/pages/signage/SignageGrid";
import SignageDtl from "./ksis/pages/signage/SignageDtl";
import SignageUpdateForm from "./ksis/pages/signage/SignageUpdateForm";
import ApiBoard from "./ksis/pages/api/ApiBoard";
import ApiForm from "./ksis/pages/api/ApiForm";
import FileSizeBoard from "./ksis/pages/fileSize/FileSizeBoard";
import NoticeBoard from "./ksis/pages/notice/NoticeBoard";
import NoticeForm from "./ksis/pages/notice/NoticeForm";
import NoticeDtl from "./ksis/pages/notice/NoticeDtl.jsx";
import AccountRegForm from "./ksis/pages/account/AccountRegForm";
import AccountList from "./ksis/pages/account/AccountList";
import AccountEditForm from "./ksis/pages/account/AccountEditForm";
import TokenCallback from "./ksis/pages/account/TokenCallback";
import ImageResourceBoard from "./ksis/pages/fileMng/ImageResourceBoard.jsx";
import ImageFileBoard from "./ksis/pages/fileMng/ImageFileBoard.jsx";
import VideoResourceBoard from "./ksis/pages/fileMng/VideoResourceBoard.jsx";
import VideoFileBoard from "./ksis/pages/fileMng/VideoFileBoard.jsx";
import ImageResourceModal from "./ksis/pages/fileMng/ImageResourceModal.jsx";
import ImageEncoding from "./ksis/pages/fileMng/ImageEncoding.jsx";
import VideoResourceModal from "./ksis/pages/fileMng/VideoResourceModal.jsx";
import VideoEncoding from "./ksis/pages/fileMng/VideoEncoding.jsx";

function App() {
  return (
    <div className="dashboard flex">
      <Sidebar />
      <div className="content flex-1 p-4">
        <Routes>
          {/* 계정 관련 경로 */}
          <Route path={ACCOUNT_FORM} element={<AccountRegForm />} />
          <Route path={ACCOUNT_LIST} element={<AccountList />} />
          <Route path={ACCOUNT_EDIT_FORM} element={<AccountEditForm />} />
          <Route path={TOKEN_CALLBACK} element={<TokenCallback />} />

          {/* PC 관련 경로 */}
          <Route path={PC_INVENTORY} element={<PcList />} />
          <Route path={PC_FORM} element={<PcForm />} />
          <Route path={PC_DTL + "/:id"} element={<PcDtl />} />
          <Route path={PC_UPDATE_FORM + "/:id"} element={<PcUpdateForm />} />

          {/* Signage 관련 경로 */}
          <Route path={SIGNAGE_INVENTORY} element={<SignageList />} />
          <Route path={SIGNAGE_FORM} element={<SignageForm />} />
          <Route path={SIGNAGE_GRID} element={<SignageGrid />} />
          <Route path={SIGNAGE_DTL + "/:id"} element={<SignageDtl />} />
          <Route
            path={SIGNAGE_UPDATE_FORM + "/:id"}
            element={<SignageUpdateForm />}
          />

          {/* API 관련 경로 */}
          <Route path={API_BOARD} element={<ApiBoard />} />
          <Route path={API_FORM} element={<ApiForm />} />
          <Route path={API_FORM + "/:apiId"} element={<ApiForm />} />

          {/* File Size 관련 경로 */}
          <Route path={FILESIZE_FORM} element={<FileSizeBoard />} />

          {/* 공지사항 관련 경로 */}
          <Route path={NOTICE_BOARD} element={<NoticeBoard />} />
          <Route path={NOTICE_FORM} element={<NoticeForm />} />
          <Route path={NOTICE_FORM + "/:noticeId"} element={<NoticeForm />} />
          <Route path={NOTICE_DTL + "/:noticeId"} element={<NoticeDtl />} />

          {/* 미디어관리 관련 경로 */}
          <Route path={IMAGE_FILE_BOARD} element={<ImageFileBoard />} />
          <Route path={IMAGE_RESOURCE_BOARD} element={<ImageResourceBoard />} />
          <Route path={VIDEO_FILE_BOARD} element={<VideoFileBoard />} />
          <Route path={VIDEO_RESOURCE_BOARD} element={<VideoResourceBoard />} />
          <Route
            path={IMAGE_RESOURCE_MODAL + "/:originalResourceId"}
            element={<ImageResourceModal />}
          />
          <Route
            path={IMAGE_ENCODING + "/:encodedResourceId"}
            element={<ImageEncoding/>}
          />
          <Route
            path={VIDEO_RESOURCE_MODAL + "/:originalResourceId"}
            element={<VideoResourceModal />}
          />
           <Route
            path={VIDEO_ENCODING + "/:encodedResourceId"}
            element={<VideoEncoding />}
            />

          {/* 다른 라우트들을 추가할 수 있습니다 */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
