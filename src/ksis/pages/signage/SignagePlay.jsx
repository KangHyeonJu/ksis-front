import React, { useEffect, useState, useCallback, useRef } from "react";
import Modal from "react-modal";
import fetcher from "../../../fetcher";
import { SIGNAGE_PLAY } from "../../../constants/api_constant";

const SignagePlay = ({ isOpen, onRequestClose, signageId }) => {
  const [resources, setResources] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutIdRef = useRef(null);

  const loadModal = useCallback(async () => {
    try {
      const response = await fetcher.get(SIGNAGE_PLAY + `/${signageId}`);
      setResources(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [signageId]);

  // const showNextImage = useCallback(() => {
  //   const container = document.getElementById("container");

  //   if (resources.length > 0 && container) {
  //     // 현재 이미지를 제거
  //     container.innerHTML = "";

  //     const resource = resources[currentIndex];

  //     if (resource.resourceType === "IMAGE") {
  //       container.innerHTML = `<img src="${resource.filePath}" alt="이미지 로딩 오류" style="width: 100%; height: 100%;">`;
  //     } else if (resource.resourceType === "VIDEO") {
  //       container.innerHTML = `<video src="${resource.filePath}" style="width: 100%; height: 100%;" autoplay="autoplay" muted="muted"/>`;
  //     }

  //     // 다음 이미지를 일정 시간 후에 표시
  //     timeoutIdRef.current = setTimeout(() => {
  //       setCurrentIndex((prevIndex) => (prevIndex + 1) % resources.length);
  //     }, resource.playTime * 1000);
  //   }
  // }, [resources, currentIndex]);

  // const showNextImage = useCallback(() => {
  //   const container = document.getElementById("container");

  //   if (resources.length > 0 && container) {
  //     const resource = resources[currentIndex];

  //     // 기존 이미지를 페이드 아웃
  //     if (container.firstChild) {
  //       container.firstChild.style.transition = "opacity 0.5s linear";
  //       container.firstChild.style.opacity = "0";
  //     }

  //     // 일정 시간 후에 새로운 이미지나 비디오를 페이드 인
  //     setTimeout(() => {
  //       container.innerHTML = "";

  //       if (resource.resourceType === "IMAGE") {
  //         const imgElement = document.createElement("img");
  //         imgElement.src = resource.filePath;
  //         imgElement.alt = "이미지 로딩 오류";
  //         imgElement.style.width = "100%";
  //         imgElement.style.height = "100%";
  //         imgElement.style.opacity = "0";
  //         imgElement.style.transition = "opacity 0.5s linear";
  //         container.appendChild(imgElement);

  //         // 새 이미지 페이드 인
  //         requestAnimationFrame(() => {
  //           imgElement.style.opacity = "1";
  //         });
  //       } else if (resource.resourceType === "VIDEO") {
  //         const videoElement = document.createElement("video");
  //         videoElement.src = resource.filePath;
  //         videoElement.style.width = "100%";
  //         videoElement.style.height = "100%";
  //         videoElement.autoplay = true;
  //         videoElement.muted = true;
  //         videoElement.style.opacity = "0";
  //         videoElement.style.transition = "opacity 0.5s linear";
  //         container.appendChild(videoElement);

  //         // 새 비디오 페이드 인
  //         requestAnimationFrame(() => {
  //           videoElement.style.opacity = "1";
  //         });
  //       }

  //       // 다음 이미지를 일정 시간 후에 표시
  //       timeoutIdRef.current = setTimeout(() => {
  //         setCurrentIndex((prevIndex) => (prevIndex + 1) % resources.length);
  //       }, resource.playTime * 1000);
  //     }, 50); // 페이드 아웃 시간이 지난 후 새 이미지로 전환
  //   }
  // }, [resources, currentIndex]);

  const showNextImage = useCallback(() => {
    const container = document.getElementById("container");

    if (resources.length > 0 && container) {
      const resource = resources[currentIndex];

      // 일정 시간 후에 새로운 이미지나 비디오를 페이드 인
      setTimeout(() => {
        // 새로운 이미지 또는 비디오 요소 생성
        let newElement;

        if (resource.resourceType === "IMAGE") {
          newElement = document.createElement("img");
          newElement.alt = "이미지 로딩 오류";
        } else if (resource.resourceType === "VIDEO") {
          newElement = document.createElement("video");
          newElement.autoplay = true;
          newElement.muted = true;
        }
        newElement.src = resource.filePath;
        newElement.style.width = "100%";
        newElement.style.height = "100%";
        // 기존 요소가 있으면 교체, 없으면 추가
        if (container.firstChild) {
          container.replaceChild(newElement, container.firstChild);
        } else {
          container.appendChild(newElement);
        }

        // 다음 이미지를 일정 시간 후에 표시
        timeoutIdRef.current = setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % resources.length);
        }, resource.playTime * 1000);
      }, 50); // 페이드 아웃 시간이 지난 후 새 이미지로 전환
    }
  }, [resources, currentIndex]);

  useEffect(() => {
    if (isOpen && signageId) {
      loadModal();
    }
  }, [isOpen, signageId, loadModal]);

  useEffect(() => {
    if (isOpen && resources.length > 0) {
      showNextImage();
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [isOpen, resources, showNextImage]);

  useEffect(() => {
    const fullscreenchangeHandler = () => {
      if (!document.fullscreenElement) {
        onRequestClose(); // 전체화면이 종료되면 모달도 닫기
      }
    };

    window.addEventListener("fullscreenchange", fullscreenchangeHandler);

    // 모달이 열릴 때 전체화면 모드로 전환
    if (isOpen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    }

    return () => {
      window.removeEventListener("fullscreenchange", fullscreenchangeHandler);
    };
  }, [isOpen, onRequestClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc={true}
      style={{
        content: {
          width: "100%",
          height: "100%",
          inset: "0px",
          padding: "0px",
        },
      }}
    >
      <div id="container" className="h-280 w-full"></div>
      <div className="h-24 w-full bg-orange-500 text-center">공지 내용</div>
    </Modal>
  );
};

export default SignagePlay;
