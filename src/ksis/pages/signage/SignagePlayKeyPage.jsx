import { useSearchParams } from "react-router-dom";
import fetcher from "../../../fetcher";
import { SIGNAGE_PLAY } from "../../../constants/api_constant";
import { useEffect, useState } from "react";

const SignagePlayKeyPage = () => {
  const [searchParam, setSearchParam] = useSearchParams();
  const keyValue = searchParam.get("key");
  const [verification, setVerification] = useState(false);

  const loadPage = async () => {
    console.log("keyValue: ", keyValue);

    // ip & key 검증
    const response = await fetcher.get(SIGNAGE_PLAY, {
      params: { key: keyValue },
    });
    if (response.status === 200) {
      console.log("IP와 KEY 검증 성공");
      setVerification(true);
    } else if (response.status === 202) {
      console.log("IP와 KEY 검증 실패");
      setVerification(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  return (
    <div>{verification === true ? <h1>인증 성공</h1> : <h1>인증 실패</h1>}</div>
  );
};

export default SignagePlayKeyPage;
