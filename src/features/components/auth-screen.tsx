"use client";

import SignCard from "@/features/auth/components/sign-card";

const AuthScreen = () => {
  return (
    <div className="h-full flex items-center justify-center bg-[#5C3858]">
      <div className="md:h-auto md:w-[420px]">
        <SignCard />
      </div>
    </div>
  );
};

export default AuthScreen;
