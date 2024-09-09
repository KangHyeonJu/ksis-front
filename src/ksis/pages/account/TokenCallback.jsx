import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
const TokenCallback = () => {
    const [message, setMessage] = useState('로그인 동기화 중입니다...');
    const navigate = useNavigate();

    useEffect(() => {
        const storeAccessToken = async () => {
            // 쿼리 파라미터에서 accessToken 가져오기
            const urlParams = new URLSearchParams(window.location.search);
            const accessToken = urlParams.get('accessToken');

            if (!accessToken) {
                console.error('AccessToken 제공되지 않았습니다.');
                return;
            }

            // accessToken을 로컬 스토리지에 저장
            localStorage.setItem('accessToken', accessToken);
            navigate('/');

            window.location.reload();
        };

        storeAccessToken();
    }, [navigate]);

    return null;
};

export default TokenCallback;
