import React from "react";
import { Dialog, DialogTitle, DialogBody } from "../../css/dialog";

const SignageResourceModal = ({ isOpen, onRequestClose }) => {
  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-[#ffe374] px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-9/12 sm:p-6 h-96">
          <div className="flex h-full">
            <div className="w-4/6 pr-4">
              <DialogTitle className="text-lg font-medium leading-6 text-gray-900 text-center">
                재생장치 이미지/영상
              </DialogTitle>
              <DialogBody className="mt-2">
                <div className="mb-4 flex items-center">
                  <div className="w-full h-60 border border-gray-900 overflow-y-auto p-4 bg-[#f6f6f6]">
                    <div className="space-y-2">
                      <p>내용 1</p>
                      <p>내용 2</p>
                      <p>내용 3</p>
                      <p>내용 4</p>
                      <p>내용 5</p>
                      <p>내용 6</p>
                      <p>내용 7</p>
                      <p>내용 8</p>
                      <p>내용 9</p>
                      <p>내용 10</p>
                    </div>
                  </div>
                </div>
              </DialogBody>
            </div>

            <div className="border-l border-gray-400 pr-4"></div>

            <div className="w-2/6 pr-4">
              <DialogTitle className="text-lg font-medium leading-6 text-gray-900 text-center">
                내 이미지/영상
              </DialogTitle>
              <DialogBody className="mt-2">
                <div className="mb-4 flex items-center">
                  <div className="w-full h-60 border border-gray-900 overflow-y-auto p-4 bg-[#f6f6f6]">
                    <div className="space-y-2">
                      <p>내용 1</p>
                      <p>내용 2</p>
                      <p>내용 3</p>
                      <p>내용 4</p>
                      <p>내용 5</p>
                      <p>내용 6</p>
                      <p>내용 7</p>
                      <p>내용 8</p>
                      <p>내용 9</p>
                      <p>내용 10</p>
                    </div>
                  </div>
                </div>
              </DialogBody>
              <div className="flex flex-row-reverse">
                <button
                  onClick={onRequestClose}
                  className="ml-2 inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[#f48f8f] text-base font-bold text-black shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                >
                  닫기
                </button>
                <button className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[#6dd7e5] text-base font-bold text-black shadow-sm hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm">
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SignageResourceModal;
