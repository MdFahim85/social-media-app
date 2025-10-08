"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export function SignIn() {
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const credentialsAction = async (formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
      setError("Email and password is required");
      setLoading(false);
      return;
    }

    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid Email or Password");
      setLoading(false);
      return;
    } else {
      toast.success(`Login successful.`);
      window.location.assign("/");
    }
  };

  return (
    <form action={credentialsAction} className="flex flex-col gap-4 w-full">
      <Input
        type="email"
        placeholder="Email"
        name="email"
        className={error && `border-red-500`}
      />
      <div className="flex gap-2 relative">
        <Input
          type={show ? "text" : "password"}
          placeholder="Password"
          name="password"
          className={error && `border-red-500`}
        />
        <Button
          className="absolute right-0"
          type="button"
          variant={"ghost"}
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? <Eye /> : <EyeOff />}
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button
        variant={"secondary"}
        type="submit"
        onClick={() => setLoading(true)}
      >
        {loading ? "Signing In..." : "Sign in"}
      </Button>
    </form>
  );
}
