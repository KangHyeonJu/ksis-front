import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Sidebar from "./ksis/components/SideBar";
import {ACCOUNT_EDIT_FORM, ACCOUNT_FORM, ACCOUNT_LIST} from "./constants/account_constant";
import { PC_FORM, PC_INVENTORY } from "./constants/page_constant";
import AccountRegForm from "./ksis/pages/account/AccountRegForm";
import PcList from "./ksis/pages/pc/PcList";
import PcForm from "./ksis/pages/pc/PcForm";
import AccountList from "./ksis/pages/account/AccountList";
import AccountEditForm from "./ksis/pages/account/AccountEditForm";

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
                        <Route path={ACCOUNT_LIST} element={<AccountList />} />
                        <Route path={ACCOUNT_EDIT_FORM} element={<AccountEditForm/>} />
                        {/* 다른 라우트들을 추가할 수 있습니다 */}
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;