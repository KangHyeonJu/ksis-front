import { Routes, Route } from "react-router-dom";
import PcList from "./ksis/pages/pc/PcList";
import "./index.css";
import Sidebar from "./ksis/components/SideBar";
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
import PcForm from "./ksis/pages/pc/PcForm";
import ApiBoard from "./ksis/pages/api/ApiBoard";
import ApiForm from "./ksis/pages/api/ApiForm";
import FileSizeBoard from "./ksis/pages/fileSize/FileSizeBoard";
import NoticeBoard from "./ksis/pages/notice/NoticeBoard";
import NoticeForm from "./ksis/pages/notice/NoticeForm";
import { ACCOUNT_FORM } from "./constants/account_constant";
import AccountRegForm from "./ksis/pages/account/AccountRegForm";
import PcDtl from "./ksis/pages/pc/PcDtl";
import PcUpdateForm from "./ksis/pages/pc/PcUpdateForm";
import SignageList from "./ksis/pages/signage/SignageList";
import SignageForm from "./ksis/pages/signage/SignageForm";
import SignageGrid from "./ksis/pages/signage/SignageGrid";
import SignageDtl from "./ksis/pages/signage/SignageDtl";

function App() {
  return (
    <div className="dashboard flex">
      <Sidebar />
      <div className="content flex-1 p-4">
        <Routes>
          <Route path={ACCOUNT_FORM} element={<AccountRegForm />} />

          <Route path={PC_INVENTORY} element={<PcList />} />
          <Route path={PC_FORM} element={<PcForm />} />
          <Route path={PC_DTL + "/:id"} element={<PcDtl />} />
          <Route path={PC_UPDATE_FORM + "/:id"} element={<PcUpdateForm />} />

          <Route path={SIGNAGE_INVENTORY} element={<SignageList />} />
          <Route path={SIGNAGE_FORM} element={<SignageForm />} />
          <Route path={SIGNAGE_GRID} element={<SignageGrid />} />
          <Route path={SIGNAGE_DTL + "/:id"} element={<SignageDtl />} />

          <Route path="/apiboard" element={<ApiBoard />} />
          <Route path="/apiform" element={<ApiForm />} />
          <Route path="/apiform/:apiId" element={<ApiForm />} />

          <Route path="/filesizeboard" element={<FileSizeBoard />} />
          <Route path="/noticeboard" element={<NoticeBoard />} />
          <Route path="/noticeform" element={<NoticeForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
