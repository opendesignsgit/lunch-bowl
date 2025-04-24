import React from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import myLogo from "../../../public/logo/lunchbowl-logo.svg";
import closeicon from "../../../public/menuclose-icon.svg";
import LoginPopup from "../../components/logInSignUp/LoginPopup";
import { useState } from "react";

const Mainheader = ({ title, description, children }) => {
  var pageWidth = window.innerWidth;
  var body = document.getElementsByTagName("body")[0];
  var script = document.createElement("script");
  script.type = "text/javascript";
  const [openLogin, setOpenLogin] = useState(false);

  if (pageWidth > 801) {
    const body = document.body;
    const scrollUp = "scroll-up";
    const scrollDown = "scroll-down";
    const scrollanimi = "sscroll-animi";
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll <= 0) {
        body.classList.remove(scrollUp);
        body.classList.remove(scrollanimi);
        return;
      }

      if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
        body.classList.remove(scrollUp);
        body.classList.add(scrollDown);
        body.classList.add(scrollanimi);
      } else if (
        currentScroll < lastScroll &&
        body.classList.contains(scrollDown)
      ) {
        body.classList.remove(scrollDown);
        body.classList.add(scrollUp);
        body.classList.add(scrollanimi);
      }
      lastScroll = currentScroll;
    });
  } else {
  }
  body.appendChild(script);

  const [shadow, setShow] = React.useState();
  return (
    <>
      <Head>
        <title>{title ? `Lunchbowl | ${title}` : "Lunchbowl "}</title>
        {description && <meta name="description" content={description} />}
        <link ref="icon" href="/favicon.png" />
      </Head>
      <header>
        <div className="headbox flex items-center">
          <div className="myLogo relative h-auto transition transition-all duration-[1s] ease-in-out">
            <Link href="/" className="g:block relative leading-[0]">
              <Image
                className="w-full h-auto"
                priority
                src={myLogo}
                alt="logo"
              />
            </Link>
          </div>
          <div className="navbox">
            <ul className="flex items-center logsinul">
              <li className="logbtn">
                <button
                  onClick={() => setOpenLogin(true)}
                  // className="bg-[#ff6514] text-white w-40 px-4 py-2  font-semibold shadow-md"
                >
                  <span>Login</span>
                </button>
              </li>

              <li className="trialbtn">
                <Link href="/" className="">
                  <span>Start Free Trial</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <div className={shadow ? "shadow" : ""} id="HamburgerMegamenu">
        <div className="mm-main-container">
          <div className="megamenu-header">
            <Link href="/">
              <Image src={myLogo} alt="" />
            </Link>
            <button
              className="Hamburgermm-close"
              id="Hamburgermm-close"
              onClick={() => setShow(false)}
            >
              <Image src={closeicon} alt="" /> <span>Close</span>
            </button>
          </div>
          <div className="megamenu-container">
            <div className="mmMenuCon">
              <ul className="HamBSMenu">
                <li className="nav__item hamnavlink">
                  <Link href="/">Home</Link>
                </li>
                <li className="nav__item hamnavlink">
                  <Link href="/">About Us</Link>
                </li>
                <li className="nav__item hamnavlink">
                  <Link href="/">Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LoginPopup open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
};

export default Mainheader;
