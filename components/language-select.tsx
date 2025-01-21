import React, { useCallback, useEffect } from "react";
import { TranslationOutlined, CaretDownOutlined } from "@ant-design/icons";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

function LanguageSelect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const locale = localStorage.getItem("locale");
    if (locale && !pathname.startsWith(`/${locale}`)) {
      router.push(pathname.replace(/^\/[a-z]{2}/, `/${locale}`));
    }
  }, [pathname, router]);

  const setLanguage = useCallback((lang: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("locale", lang);
    }
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${lang}`);
    router.push(newPathname);
  }, [pathname, router]);

  const handleLanguageChange = (lang: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setLanguage(lang);
  };

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
        className="dropdown-content z-[50] menu p-2 w-[125px] shadow bg-base-100 rounded-box"
      >
        <li>
          <a onClick={handleLanguageChange('hr')} className="flex items-center gap-2">
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
          <a onClick={handleLanguageChange('en')} className="flex items-center gap-2">
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
