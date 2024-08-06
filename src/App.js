// src/App.js
import React from "react";
import "./index.css"; // Catalyst 및 Tailwind CSS 포함

function App() {
  return (
    <div className="bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold">Catalyst 템플릿</h1>
      </header>
      <main className="p-6">
        <h2 className="text-xl font-semibold">환영합니다!</h2>
        <p className="text-gray-700">
          리액트와 테일윈드 CSS의 Catalyst 템플릿을 사용하고 있습니다.
        </p>
      </main>
    </div>
  );
}

export default App;
