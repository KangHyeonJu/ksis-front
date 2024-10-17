import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from "../../css/dialog";
import fetcher from "../../../fetcher";
import { RESOLUTION } from "../../../constants/api_constant";
import { ImCross } from "react-icons/im";

const ResolutionUpdateModal = ({ isOpen, onRequestClose, resolutionId }) => {
  const [data, setData] = useState({});
  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onRequestClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const loadPage = async () => {
    const loadResponse = await fetcher.get(RESOLUTION + `/${resolutionId}`);
    if (loadResponse) {
      setData(loadResponse.data);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  const onChangeHandler = (e) => {
    const { value, name } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateResolution = async (e) => {
    try {
      e.preventDefault();

      if (data.width % 2 !== 0 || data.height % 2 !== 0) {
        alert("해상도는 짝수만 등록가능합니다.");
        return;
      }

      if (window.confirm("수정하시겠습니까?")) {
        const response = await fetcher.put(RESOLUTION, data);

        if (response.status === 200) {
          alert("해상도가 수정되었습니다.");
          onRequestClose();
        } else {
          alert("해상도 수정 중 오류가 발생했습니다.");
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-3/12 sm:p-6"
        >
          <DialogTitle className="">
            <h1 className="text-xl font-bold text-gray-900 ml-1">
              해상도 수정
            </h1>

            <ImCross
              className="absolute top-5 right-5 text-red-500 cursor-pointer"
              onClick={onRequestClose}
            />
          </DialogTitle>
          <form onSubmit={updateResolution}>
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
            <DialogActions>
              <button
                type="submit"
                className="mr-3 inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[#6dd7e5] text-base font-bold text-black shadow-sm hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm"
              >
                수정
              </button>
            </DialogActions>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default ResolutionUpdateModal;
