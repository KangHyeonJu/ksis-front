import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AccountRegForm.css'; // CSS 파일을 import합니다.

const AccountRegForm = () => {
    const [formData, setFormData] = useState({
        accountId: '',
        password: '',
        confirmPassword: '',
        name: '',
        birthDate: '',
        businessTel: '',
        emergencyTel: '',
        email: '',
        position: '',
        gender: '',
    });
    const [passwordMatch, setPasswordMatch] = useState(true);

    useEffect(() => {
        // 비밀번호와 비밀번호 확인이 일치하는지 확인
        if (formData.password && formData.confirmPassword) {
            setPasswordMatch(formData.password === formData.confirmPassword);
        }
    }, [formData.password, formData.confirmPassword]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'password' || name === 'confirmPassword') {
            setPasswordMatch(formData.password === formData.confirmPassword);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordMatch) {
            alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
            return;
        }

        const cleanedFormData = {
            ...formData,
            gender: formData.gender.trim() === '' ? 'UNKNOWN' : formData.gender, // 'UNKNOWN'으로 설정
        };

        try {
            await axios.post('http://localhost:8080/api/account', cleanedFormData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setFormData({
                accountId: '',
                password: '',
                confirmPassword: '',
                name: '',
                birthDate: '',
                businessTel: '',
                emergencyTel: '',
                email: '',
                position: '',
                gender: '',
            });

            console.log(cleanedFormData);
        } catch (error) {
            console.error('Error creating account:', error);
            console.log('Form Data:', JSON.stringify(cleanedFormData));

            // Axios 에러의 상세 정보 확인
            if (error.response) {
                // 서버가 응답을 했고, 그 응답이 에러를 포함
                console.error('Error Response Data:', error.response.data);
                console.error('Error Response Status:', error.response.status);
                console.error('Error Response Headers:', error.response.headers);
            } else if (error.request) {
                // 요청이 이루어졌으나 응답을 받지 못한 경우
                console.error('Error Request Data:', error.request);
            } else {
                // 오류를 발생시킨 요청을 설정하는 과정에서 문제가 있었던 경우
                console.error('Error Message:', error.message);
            }
        }
    };

    return (
        <div className="form-container">
            <h2>계정 등록</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">아이디</label>
                    <input
                        type="text"
                        name="accountId"
                        value={formData.accountId}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">비밀번호 확인</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                {formData.confirmPassword && (
                    <div className={`password-match ${passwordMatch ? 'match' : 'mismatch'}`}>
                        {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                    </div>
                )}
                <div className="form-group">
                    <label className="form-label">이름</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">생년월일</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">업무 전화번호</label>
                    <input
                        type="tel"
                        name="businessTel"
                        value={formData.businessTel}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">긴급 연락처</label>
                    <input
                        type="tel"
                        name="emergencyTel"
                        value={formData.emergencyTel}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">직위</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">성별</label>
                    <div className="form-gender">
                        <div>
                            <input
                                type="radio"
                                name="gender"
                                value="MALE"
                                checked={formData.gender === 'MALE'}
                                onChange={handleChange}
                                className="form-radio"
                            />
                            <label>남성</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="gender"
                                value="FEMALE"
                                checked={formData.gender === 'FEMALE'}
                                onChange={handleChange}
                                className="form-radio"
                            />
                            <label>여성</label>
                        </div>
                    </div>
                </div>

                <div className="button-group">
                    <button type="submit" className="submit-button">
                        등록
                    </button>
                    <button type="button" className="cancel-button">
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountRegForm;
