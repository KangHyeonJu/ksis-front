import React, { useEffect } from "react";

const MapComponent = () => {
  const apiKey = process.env.REACT_APP_LOCATION_KEY;

  // 카카오 API 호출
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 초기 중심 좌표 (위도, 경도)
          level: 3, // 지도 확대 레벨
        };
        new window.kakao.maps.Map(container, options);
      });
    });
  }, []);

  return (
    <>
      <div id="map" style={{ width: "100%", height: "90%" }}></div>
    </>
  );
};

export default MapComponent;
