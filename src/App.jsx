import { BrowserRouter, Routes, Route } from "react-router-dom";
import PcList from "./ksis/pages/pc/PcList";
import "./index.css";
import Sidebar from "./ksis/components/SideBar";
import { PC_FORM, PC_INVENTORY } from "./constants/page_constant";
import PcForm from "./ksis/pages/pc/PcForm";
import ApiBoard from "./ksis/pages/api/ApiBoard";
import ApiForm from "./ksis/pages/api/ApiForm";
import FileSizeBoard from "./ksis/pages/fileSize/FileSizeBoard";
import NoticeBoard from "./ksis/pages/notice/NoticeBoard";
import NoticeForm from "./ksis/pages/notice/NoticeForm";
import { ACCOUNT_FORM } from "./constants/account_constant";
import AccountRegForm from "./ksis/pages/account/AccountRegForm";

function App() {
  return (
    <div className="dashboard flex">
      <Sidebar />
      <div className="content flex-1 p-4">
        <Routes>
          <Route path={ACCOUNT_FORM} element={<AccountRegForm />} />
          <Route path={PC_INVENTORY} element={<PcList />} />
          <Route path={PC_FORM} element={<PcForm />} />
          <Route path="/apiboard" element={<ApiBoard />} />
          <Route path="/apiform" element={<ApiForm />} /> {/* API 등록 */}
          <Route path="/apiform/:apiId" element={<ApiForm />} />{" "}
          {/* API 수정 */}
          <Route path="/filesizeboard" element={<FileSizeBoard />} />
          <Route path="/noticeboard" element={<NoticeBoard />} />
          <Route path="/noticeform" element={<NoticeForm />} />
          {/* 다른 라우트들을 추가할 수 있습니다 */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
