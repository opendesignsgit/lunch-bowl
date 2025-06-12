import React from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import myLogo from "../../../public/logo/lunchbowl-logo.svg";
import closeicon from "../../../public/menuclose-icon.svg";
import LoginPopup from "../../components/logInSignUp/LoginPopup";
import HamburgerMenuImg from "../../../public/HamburgerMenuImg.jpg";
import FreeTrialPopup from "../../components/home/FreeTrialPopup";
import SignUpPopup from "../../components/logInSignUp/SignUpPopup";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LogoutConfirmationPopup from "../../components/logInSignUp/LogoutConfirmationPopup";
import { signOut } from "next-auth/react";

const Mainheader = ({ title, description, children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  var pageWidth = window.innerWidth;
  var body = document.getElementsByTagName("body")[0];
  var script = document.createElement("script");
  script.type = "text/javascript";
  const [openLogin, setOpenLogin] = useState(false);
  const [freeTrialPopup, setFreeTrialPopup] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMyAccount, setShowMyAccount] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const userId = session?.user?.id;

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await signOut({ callbackUrl: "/" }); // next-auth signOut, redirects to home
    // If you use any custom localStorage/sessionStorage, clear them here as well:
    localStorage.clear();
    sessionStorage.clear();
  };

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
                <button onClick={() => setOpenLogin(true)}>
                  <span>Login</span>
                </button>
              </li>

              <li className="trialbtn">
                <button onClick={() => setShowSignUp(true)}>
                  <span>Start Free Trial</span>
                </button>
              </li>

              {/* NEW MENU BUTTON */}
              <li className="userMenuBtn" style={{ position: "relative" }}>
                <button onClick={() => setShowUserMenu((prev) => !prev)}>
                  <span>Menu</span>
                </button>
                {showUserMenu && (
                  <ul
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "#fff",
                      border: "1px solid #ddd",
                      padding: "10px",
                      zIndex: 999,
                    }}
                  >
                    <li style={{ padding: "5px 10px" }}>
                      <button
                        onClick={() => router.push("user/my-account")}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          width: "100%",
                          textAlign: "left",
                        }}
                      >
                        My Account
                      </button>
                    </li>
                    <li style={{ padding: "5px 10px" }}>
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          width: "100%",
                          textAlign: "left",
                        }}
                      >
                        Log Out
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
            <div className="hmenubox" onClick={() => setShow(true)}>
              <h6>Menu</h6>
              <div className="hmenuline">
                <div className="line lineone"> &nbsp; </div>
                <div className="line linetwo"> &nbsp; </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className={shadow ? "shadow" : ""} id="HamburgerMegamenu">
        <div className="mm-main-container">
          <div className="megamenu-container">
            <div className="mmMenuColL">
              <Image
                className="w-full h-auto"
                priority
                src={HamburgerMenuImg}
                alt="logo"
              />
            </div>
            <div className="mmMenuColR">
              <button
                className="Hamburgermm-close"
                id="Hamburgermm-close"
                onClick={() => setShow(false)}
              >
                <Image src={closeicon} alt="" />
              </button>
              <div className="mmMenuCon">
                <ul className="HamBSMenu">
                  <li className="nav__item hamnavlink">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="nav__item hamnavlink">
                    <Link href="/">My Account</Link>
                  </li>
                  <li className="nav__item hamnavlink">
                    <Link href="/about-us">About Us</Link>
                  </li>
                  <li className="nav__item hamnavlink">
                    <Link href="/Menulist">Food Menu</Link>
                  </li>
                  <li className="nav__item hamnavlink">
                    <Link href="/contact-us">Contact Us</Link>
                  </li>
                </ul>
                <ul className="HamSMediaul">
                  <li className="nav__item hamnavlink">
                    <Link href="/">Instagram</Link>
                  </li>
                  <li className="nav__item hamnavlink">
                    <Link href="/">Facebook</Link>
                  </li>
                  <li className="nav__item hamnavlink">
                    <Link href="/">Linkedin</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MyAccount component popup/modal */}
      {showMyAccount && (
        <MyAccount userId={userId} onClose={() => setShowMyAccount(false)} />
      )}
      <LoginPopup open={openLogin} onClose={() => setOpenLogin(false)} />
      <FreeTrialPopup
        open={freeTrialPopup}
        onClose={() => setFreeTrialPopup(false)}
      />
      <SignUpPopup open={showSignUp} onClose={() => setShowSignUp(false)} />
      <LogoutConfirmationPopup
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Mainheader;
