import { LoginButton } from "@/components/SignIn";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center">
      <div className=" p-8 rounded-2xl shadow-lg w-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome</h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in to your account using Google
        </p>
        <LoginButton
          text={
            <>
              {" "}
              <Image src="/google.svg" alt="Google" width={24} height={24} />
              <span className="font-medium text-gray-400">
                Sign in with Google
              </span>
            </>
          }
          variant={"secondary"}
        />

        <div className="mt-6 text-center text-gray-500 text-sm">
          By signing in, you agree to our{" "}
          <span className="text-blue-600 hover:underline">Terms</span> and{" "}
          <span className="text-blue-600 hover:underline">Privacy Policy</span>.
        </div>
      </div>
    </div>
  );
}
