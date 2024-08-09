import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";

const LocationModal = ({ isOpen, onRequestClose }) => {
  const mapContainer = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // 카카오 맵 API 스크립트가 이미 로드되었는지 확인합니다
    if (window.kakao && window.kakao.maps) {
      setScriptLoaded(true);
      return;
    }

    // 카카오 맵 API 스크립트를 동적으로 로드합니다
    const loadScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a328e13ba073fa7f69738f805fd27068";
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    };

    loadScript();
  }, []);

  useEffect(() => {
    if (scriptLoaded && window.kakao) {
      // 카카오 맵 API가 로드된 후에 맵을 생성합니다
      const mapOption = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapContainer.current, mapOption);
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(
        "제주특별자치도 제주시 첨단로 242",
        (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(
              result[0].y,
              result[0].x
            );

            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });

            const infowindow = new window.kakao.maps.InfoWindow({
              content:
                '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>',
            });
            infowindow.open(map, marker);

            map.setCenter(coords);
          }
        }
      );
    }
  }, [scriptLoaded]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Location Modal"
      appElement={document.getElementById("root")} // 또는 적절한 appElement 설정
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
        },
      }}
    >
      <button onClick={onRequestClose} style={{ float: "right" }}>
        Close
      </button>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }}></div>
    </Modal>
  );
};

export default LocationModal;
