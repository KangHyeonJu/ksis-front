import React from "react";
import "./App.css"; // css 파일 임포트

function App() {
  const handleDownload = () => {
    // 다운로드 링크를 설정
    const url = "http://localhost:3002/download";
    const link = document.createElement("a");
    link.href = url;
    link.download = "app.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <img src="/images/ksis-logo.png"></img>
      <h1>사이트 이용을 원하시면 애플리케이션을 설치해주세요.</h1>
      <h3>이미 다운로드 하셨다면 앱을 실행해주세요.</h3>
      <button onClick={handleDownload} className="download-button">
        Download for Windows
      </button>
    </div>
  );
}

export default App;
