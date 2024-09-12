import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import fetcher from "../../../fetcher";
import {ACCOUNT_CREATE, ACCOUNT_LIST_BOARD} from "../../../constants/account_constant";

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
    const navigate = useNavigate();
    useEffect(() => {
        // 비밀번호와 비밀번호 확인이 일치하는지 확인
        if (formData.password && formData.confirmPassword) {
            setPasswordMatch(formData.password === formData.confirmPassword);
        }
    }, [formData.password, formData.confirmPassword]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // 전화번호 필드인 경우 handlePhoneNumberChange 호출
        if (name === 'businessTel' || name === 'emergencyTel') {
            handlePhoneNumberChange(e, name);
        } else {
            // 일반적인 필드에 대한 처리
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handlePhoneNumberChange = (e, fieldName) => {
        let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
        if (value.length > 11) value = value.slice(0, 11); // 최대 11자리 제한
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 7) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
        }
        setFormData({ ...formData, [fieldName]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // 비밀번호와 비밀번호 확인 일치 확인
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
            const response = await fetcher.post(ACCOUNT_CREATE, cleanedFormData, {
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
            navigate(ACCOUNT_LIST_BOARD);
        } catch (error) {
            console.error('Error creating account:', error);
            console.log('Form Data:', JSON.stringify(cleanedFormData));

            // Axios 에러의 상세 정보 확인
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                console.error('Error Response Status:', error.response.status);
                console.error('Error Response Headers:', error.response.headers);
                alert(error.response.data);
            } else if (error.request) {
                console.error('Error Request Data:', error.request);
            } else {
                console.error('Error Message:', error.message);
            }
        }
    };

    return (
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
                계정 등록
            </h1>
            <div className="shadow-sm ring-1 ring-gray-900/5 text-center p-6 bg-white rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center mt-2">
                        <label htmlFor="accountId" className="w-28 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                            아이디*
                        </label>
                        <input
                            id="accountId"
                            name="accountId"
                            type="text"
                            minLength={4}
                            maxLength={20}
                            value={formData.accountId}
                            onChange={handleChange}
                            required
                            className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="flex items-center mt-2">
                        <label htmlFor="password" className="w-28 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                            비밀번호*
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            minLength={8}
                            maxLength={20}
                            value={formData.password}
                            onChange={handlePasswordChange}
                            required
                            className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="flex items-center mt-2">
                        <label htmlFor="confirmPassword" className="w-28 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                            비밀번호 확인*
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            maxLength={20}
                            value={formData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    {formData.confirmPassword && (
                        <div
                            className={`mt-2 font-bold ${passwordMatch ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                        </div>
                    )}
                    <div className="flex items-center mt-2">
                        <label htmlFor="name" className="w-28 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                            이름*
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            maxLength={20}
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="flex items-center mt-2">
                        <label htmlFor="birthDate" className="w-28 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                            생년월일
                        </label>
                        <input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            value={formData.birthDate}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={handleChange}
                            className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="flex items-center mt-2">
                        <label htmlFor="businessTel" className="w-28 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                            업무 전화번호*
                        </label>
                        <input
                            id="businessTel"
                            name="businessTel"
                            type="tel"
                            value={formData.businessTel}
                            onChange={handleChange}
                            required
                            pattern="\d{3}-\d{4}-\d{4}"
                            className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="flex items-center mt-2">
                        <label htmlFor="emergencyTel" className="w-28 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                            긴급 연락처
                        </label>
                        <input
                            id="emergencyTel"
                            name="emergencyTel"
                            type="tel"
                            value={formData.emergencyTel}
                            onChange={handleChange}
                            pattern="\d{3}-\d{4}-\d{4}"
                            className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="flex items-center mt-2">
                        <label htmlFor="email" className="w-28 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                            이메일*
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            maxLength={50}
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="flex items-center mt-2">
                        <label htmlFor="position" className="w-28 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                            직위
                        </label>
                        <input
                            id="position"
                            name="position"
                            type="text"
                            maxLength={20}
                            value={formData.position}
                            onChange={handleChange}
                            className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="flex items-center mt-2">
                        <label className="w-28 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                            성별
                        </label>
                        <div className="flex gap-4 ml-2">
                            <div>
                                <input
                                    type="radio"
                                    id="gender-male"
                                    name="gender"
                                    value="MALE"
                                    checked={formData.gender === 'MALE'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label htmlFor="gender-male">남성</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    id="gender-female"
                                    name="gender"
                                    value="FEMALE"
                                    checked={formData.gender === 'FEMALE'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label htmlFor="gender-female">여성</label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-4 justify-end">
                        <button
                            type="submit"
                            className="bg-[#008080] text-white rounded-full px-4 py-2 font-semibold hover:bg-teal-700"
                        >
                            등록
                        </button>
                        <button
                            type="button"
                            className="bg-[#ff0000] text-white rounded-full px-4 py-2 font-semibold hover:bg-red-700"
                        >
                            <Link to={ACCOUNT_LIST_BOARD}>취소</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default AccountRegForm;
