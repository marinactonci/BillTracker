import React from "react";
import { TranslationOutlined, CaretDownOutlined } from "@ant-design/icons";
import Image from "next/image";

function LanguageSelect() {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="w-auto cursor-pointer">
        <div className="flex items-center gap-2 hover:text-blue-300 transition-colors">
          <TranslationOutlined style={{ fontSize: "24px" }} />
          <CaretDownOutlined />
        </div>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 w-[125px] shadow bg-base-100 rounded-box"
      >
        <li>
          <a className="flex items-center gap-2">
            <Image
              src="/flags/hr.png"
              alt="Croatian flag icon"
              width={15}
              height={15}
            />
            <span>Croatian</span>
          </a>
        </li>
        <li>
          <a className="flex items-center gap-2">
            <Image
              src="/flags/en.png"
              alt="English flag icon"
              width={15}
              height={15}
            />
            <span>English</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default LanguageSelect;
