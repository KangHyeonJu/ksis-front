import { Routes, Route } from "react-router-dom";
import Sidebar from "./ksis/components/SideBar";
import "./index.css";
import { API_BOARD, API_FORM, API_FORM_EDIT, FILESIZE_FORM, NOTICE_BOARD, NOTICE_FORM } from "./constants/page_constant";
import {
  PC_DTL,
  PC_FORM,
  PC_INVENTORY,
  PC_UPDATE_FORM,
  SIGNAGE_DTL,
  SIGNAGE_FORM,
  SIGNAGE_GRID,
  SIGNAGE_INVENTORY,
} from "./constants/page_constant";
import { ACCOUNT_EDIT_FORM, ACCOUNT_FORM, ACCOUNT_LIST } from "./constants/account_constant";
import PcForm from "./ksis/pages/pc/PcForm";
import PcList from "./ksis/pages/pc/PcList";
import PcDtl from "./ksis/pages/pc/PcDtl";
import PcUpdateForm from "./ksis/pages/pc/PcUpdateForm";
import SignageList from "./ksis/pages/signage/SignageList";
import SignageForm from "./ksis/pages/signage/SignageForm";
import SignageGrid from "./ksis/pages/signage/SignageGrid";
import SignageDtl from "./ksis/pages/signage/SignageDtl";
import ApiBoard from "./ksis/pages/api/ApiBoard";
import ApiForm from "./ksis/pages/api/ApiForm";
import FileSizeBoard from "./ksis/pages/fileSize/FileSizeBoard";
import NoticeBoard from "./ksis/pages/notice/NoticeBoard";
import NoticeForm from "./ksis/pages/notice/NoticeForm";
import AccountRegForm from "./ksis/pages/account/AccountRegForm";
import AccountList from "./ksis/pages/account/AccountList";
import AccountEditForm from "./ksis/pages/account/AccountEditForm";

function App() {
  return (
   
      <div className="dashboard flex">
        <Sidebar />
        <div className="content flex-1 p-4">
          <Routes>
             <Route path={ACCOUNT_FORM} element={<AccountRegForm />} />
             <Route path={ACCOUNT_LIST} element={<AccountList />} />
             <Route path={ACCOUNT_EDIT_FORM} element={<AccountEditForm/>} />

            <Route path={PC_INVENTORY} element={<PcList />} />
            <Route path={PC_FORM} element={<PcForm />} />
            <Route path={PC_DTL + "/:id"} element={<PcDtl />} />
            <Route path={PC_UPDATE_FORM + "/:id"} element={<PcUpdateForm />} />

            <Route path={SIGNAGE_INVENTORY} element={<SignageList />} />
          <Route path={SIGNAGE_FORM} element={<SignageForm />} />
          <Route path={SIGNAGE_GRID} element={<SignageGrid />} />
          <Route path={SIGNAGE_DTL + "/:id"} element={<SignageDtl />} />

            <Route path={API_BOARD} element={<ApiBoard />} />
            <Route path={API_FORM} element={<ApiForm />} /> {/* API 등록 */}
            <Route path={API_FORM_EDIT} element={<ApiForm />} /> {/* API 수정 */}

            <Route path={FILESIZE_FORM} element={<FileSizeBoard />} />
            
            <Route path={NOTICE_BOARD} element={<NoticeBoard />} />
            <Route path={NOTICE_FORM} element={<NoticeForm />} />

            {/* 다른 라우트들을 추가할 수 있습니다 */}
          </Routes>
        </div>
      </div>
   
  );
}

export default App;
