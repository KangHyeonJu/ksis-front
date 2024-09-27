import axios from "axios";
import { TOKEN_CALLBACK } from "./constants/account_constant";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetcher = axios.create({
  baseURL: API_BASE_URL,
  headers: {},
});

// 요청 인터셉터 설정
fetcher.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 로컬스토리지에서 액세스 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 요청 헤더에 토큰 추가
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정 (옵션)
fetcher.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 403) {
      console.log("에러났습니다. 왜냐하면 액세스 토큰이 만료됐거든요.");
      const accessToken = localStorage.getItem("accessToken"); // 만료된 액세스 토큰 담기
      if (accessToken) {
        // 만료된 액세스 토큰 갱신 요청
        const response = await fetcher.post(`${TOKEN_CALLBACK}`, null, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 담기
          },
        });
        console.log("received response :", response);

        // 리프레시 토큰이 만료된 경우
        if (!response.data) {
          console.log("에러났습니다. 리프레시토큰도 만료됐거든요");
          localStorage.removeItem("accessToken");
          // 일렉트론 앱이 다운로드 되어있어야 함
          alert("재로그인이 필요합니다.");
          window.location.href = "ksis://open";
          return Promise.resolve();
        }

        const { accessToken: newAccessToken } = response.data;

        // 갱신된 액세스 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 갱신된 액세스 토큰으로 재요청
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default fetcher;
