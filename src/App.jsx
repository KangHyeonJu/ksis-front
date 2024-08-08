import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Sidebar from "./ksis/components/SideBar";
import {ACCOUNT_FORM} from "./constants/account_constant";
import { PC_FORM, PC_INVENTORY } from "./constants/page_constant";
import AccountRegForm from "./ksis/pages/account/AccountRegForm";
import PcList from "./ksis/pages/pc/PcList";
import PcForm from "./ksis/pages/pc/PcForm";

function App() {
    return (
        <>
            <div className="dashboard flex">
                <Sidebar />
                <div className="content flex-1 p-4">
                    <Routes>
                        <Route path={ACCOUNT_FORM} element={<AccountRegForm />} />
                        <Route path={PC_INVENTORY} element={<PcList />} />
                        <Route path={PC_FORM} element={<PcForm />} />
                        {/* 다른 라우트들을 추가할 수 있습니다 */}
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;