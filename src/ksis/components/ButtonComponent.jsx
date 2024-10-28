import React from "react";
import { Link } from "react-router-dom";

const ButtonComponent = ({
                          to,            // Optional: Link path
                          onClick,       // Optional: onClick handler
                          defaultColor,  // 기본 색상
                          shadowColor,    // hover 상태 색상
                          children,      // 버튼 안에 들어갈 텍스트 또는 요소
                      }) => {
    const buttonClass = `mr-2 rounded-md border border-${defaultColor} bg-white text-${defaultColor} py-1 px-2 text-sm font-semibold shadow-sm 
                       hover:bg-${defaultColor} hover:text-white hover:shadow-inner hover:shadow-${shadowColor}
                       focus-visible:outline-${defaultColor} transition duration-200`;

    return to ? (
        <Link to={to}>
            <button type="button" className={buttonClass}>
                {children}
            </button>
        </Link>
    ) : (
        <button type="button" className={buttonClass} onClick={onClick}>
            {children}
        </button>
    );
};

export default ButtonComponent;
