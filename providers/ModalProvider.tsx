"use client";

import { useEffect, useState } from "react";

import AuthModal from "@/app/components/AuthModal";
import UploadModal from "@/app/components/UploadModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  // prevent showing models when user is in ssr
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <UploadModal />
    </>
  );
};

export default ModalProvider;
