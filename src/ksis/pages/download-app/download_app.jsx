import React from "react";
import "./download_app.css"; // css 파일 임포트

function download_app() {
  const handleDownload = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    // 다운로드 링크를 설정
    const url = "http://localhost:8080/api/download";
    // const url = API_BASE_URL + "/api/download";
    const link = document.createElement("a");
    link.href = url;
    link.download = "ElectronReact Setup 4.6.0.exe";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ksis 앱 실행 이벤트
  const handleOpenApp = () => {
    // 특정 URL 프로토콜 호출
    const url = "ksis://open";
    window.location.href = url;
  };

  return (
    <div className="App">
      <img src="/images/ksis-logo.png" alt="Ksis Logo"></img>
      <h1>사이트 이용을 원하시면 애플리케이션을 설치해주세요.</h1>
      <h3>이미 다운로드 하셨다면 앱을 실행해주세요.</h3>
      <button onClick={handleDownload} className="download-button">
        Download for Windows
      </button>
      <br></br>
      <button onClick={handleOpenApp} className="open-app-button">
        Open Installed App
      </button>
    </div>
  );
}

export default download_app;
