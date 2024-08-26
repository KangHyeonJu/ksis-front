import React, { useEffect, useState } from 'react';
import fetcher from "../../../fetcher";
import {Link} from "react-router-dom";
import {TOKEN_CALLBACK} from "../../../constants/account_constant";
const TokenCallback = () => {
    const [message, setMessage] = useState('로그인 동기화 중입니다...');

    useEffect(() => {
        const fetchRefreshToken = async () => {
            try {
                // 쿼리 파라미터에서 accountId를 가져오기
                const urlParams = new URLSearchParams(window.location.search);
                const accountId = urlParams.get('accountId');
                console.log("accountId", accountId);
                // accountId가 존재하는지 확인
                if (!accountId) {
                    setMessage('accountId가 제공되지 않았습니다.');
                    return;
                }
                const response = await fetcher.get(`${TOKEN_CALLBACK}?accountId=${accountId}`);
                console.log("response:", response);
                if (response && response.data) {
                    const { accessToken, refreshToken } = response.data;
                    if (accessToken && refreshToken) {
                        // 리프레시 토큰을 로컬 스토리지에 저장
                        localStorage.setItem('refreshToken', refreshToken);
                        localStorage.setItem('accessToken', accessToken);
                        // localStorage.setItem('accessToken', accessToken);
                        setMessage('로그인 동기화가 완료되었습니다.');
                    } else {
                        setMessage('토큰이 응답에 포함되지 않았습니다.');
                    }
                } else {
                    setMessage('토큰을 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('Error fetching refresh token:', error);
                setMessage('서버와의 통신 중 오류가 발생했습니다.');
            }
        };

        fetchRefreshToken();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>{message}</h2>
        </div>
    );
};

export default TokenCallback;
