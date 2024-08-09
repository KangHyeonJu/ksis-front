import { BrowserRouter, Routes, Route } from "react-router-dom";
import PcList from "./ksis/pages/pc/PcList";
import "./index.css";
import Sidebar from "./ksis/components/SideBar";
import { PC_FORM, PC_INVENTORY, API_BOARD, API_FORM, API_FORM_EDIT, FILESIZE_FORM, NOTICE_BOARD, NOTICE_FORM } from "./constants/page_constant";
import PcForm from "./ksis/pages/pc/PcForm";
import ApiBoard from "./ksis/pages/api/ApiBoard";
import ApiForm from "./ksis/pages/api/ApiForm"; 
import FileSizeBoard from "./ksis/pages/fileSize/FileSizeBoard"; 
import NoticeBoard from "./ksis/pages/notice/NoticeBoard"; 
import NoticeForm from "./ksis/pages/notice/NoticeForm";

function App() {
  return (
   
      <div className="dashboard flex">
        <Sidebar />
        <div className="content flex-1 p-4">
          <Routes>
            <Route path={PC_INVENTORY} element={<PcList />} />
            <Route path={PC_FORM} element={<PcForm />} />
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
