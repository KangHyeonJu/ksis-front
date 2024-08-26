import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetcher = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
fetcher.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken'); // 로컬스토리지에서 액세스 토큰 가져오기
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // 요청 헤더에 토큰 추가
      }
      return config;
    },
    (error) =>  Promise.reject(error)
);

// 응답 인터셉터 설정 (옵션)
fetcher.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error) {
        // 401 에러 처리 로직 추가 가능 (예: 토큰 갱신)
          console.log("에러났습니다.");
      }
      return Promise.reject(error);
    }
);

export default fetcher;
