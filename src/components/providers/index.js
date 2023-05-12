"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecoilRoot } from "recoil";

function Providers({ children }) {
  return (
    <>
      <RecoilRoot>
        {children}
        <ToastContainer />
      </RecoilRoot>
    </>
  );
}

export default Providers;
