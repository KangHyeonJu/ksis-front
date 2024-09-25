import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from "../../css/dialog";
import fetcher from "../../../fetcher";
import { RESOLUTION } from "../../../constants/api_constant";

const ResolutionAddModal = ({ isOpen, onRequestClose }) => {
  const [data, setData] = useState({
    name: "",
    width: "",
    height: "",
  });

  const onChangeHandler = (e) => {
    const { value, name } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const postResolution = async (e) => {
    try {
      e.preventDefault();
      const response = await fetcher.post(RESOLUTION, data);

      if (response.status === 200) {
        alert("해상도가 등록되었습니다.");
        setData({ name: "", width: "", height: "" });
        onRequestClose();
      } else {
        alert("해상도 등록 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const onCloseHandler = async () => {
    setData({ name: "", width: "", height: "" });
    onRequestClose();
  };

  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-3/12 sm:p-6 h-80">
          <DialogTitle className="">
            <h1 className="text-xl font-bold text-gray-900 ml-1">
              해상도 등록
            </h1>
          </DialogTitle>
          <form onSubmit={postResolution}>
            <DialogBody className="mt-2">
              <div className="mb-4 flex items-center">
                <label className="w-20 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                  이름
                </label>
                <input
                  required
                  value={data.name}
                  onChange={(e) => {
                    onChangeHandler(e);
                  }}
                  name="name"
                  type="text"
                  className="bg-[#ffe69c] block w-80 ml-2 rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="w-20 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                  가로(px)
                </label>
                <input
                  required
                  value={data.width}
                  onChange={(e) => {
                    onChangeHandler(e);
                  }}
                  name="width"
                  type="number"
                  className="bg-[#ffe69c] block w-80 ml-2 rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="w-20 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                  세로(px)
                </label>
                <input
                  required
                  value={data.height}
                  onChange={(e) => {
                    onChangeHandler(e);
                  }}
                  name="height"
                  type="number"
                  className="bg-[#ffe69c] block w-80 ml-2 rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </DialogBody>
            <DialogActions className="mt-4">
              <div
                onClick={onCloseHandler}
                className="cursor-pointer inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600/70 text-base font-medium text-white shadow-sm hover:bg-red-700/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
              >
                닫기
              </div>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[#6dd7e5] text-base font-bold text-black shadow-sm hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm"
              >
                등록
              </button>
            </DialogActions>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default ResolutionAddModal;
