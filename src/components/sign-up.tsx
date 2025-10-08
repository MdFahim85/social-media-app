"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import { Camera, Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/api/registerApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type PreviewItem = {
  file: File;
  url: string;
  id: number;
};

function SignUpComp() {
  const initialUserState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null as File | null,
  };
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [userData, setUserData] = useState(initialUserState);

  const [formError, setFormError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const [preview, setPreview] = useState<PreviewItem>();

  const [formData, setFormData] = useState(new FormData());

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => registerUser(formData),
    onSuccess: () => {
      toast.success("Registration complete");
      const { email, password } = userData;
      signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/",
      });
      setFormData(new FormData());
      setUserData(initialUserState);
    },
    onError: (error) => {
      toast.error(error.message);
      setFormData(new FormData());
    },
  });

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement & { files: File[] }>
  ) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, image: file });
      const newPreview: PreviewItem = {
        file,
        url: URL.createObjectURL(file),
        id: Date.now() + Math.random(),
      };
      setPreview(newPreview);
    }
  };

  const formValidate = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };
    if (!userData.name) {
      newErrors.name = "Please provide user name";
    }
    if (!userData.email) {
      newErrors.email = "Please provide user email";
    }

    if (!userData.password) {
      newErrors.password = "Please provide valid password";
    }
    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Please write password again";
    }

    if (userData.password !== userData.confirmPassword) {
      newErrors.general = "Passwords dont match";
    }

    setFormError(newErrors);

    const err = Object.values(newErrors).some((er) => er !== "");

    return err;
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidate()) {
      return;
    }
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    if (userData.image) {
      formData.append("image", userData.image);
    }
    mutate(formData);
  };

  return (
    <form onSubmit={(e) => handleFormSubmit(e)} className="space-y-4 w-full">
      <div className="flex justify-center ">
        {preview ? (
          <Label htmlFor="picture">
            <Image
              src={preview.url}
              alt="Profile picture"
              width={100}
              height={100}
              className="rounded-full"
            />
          </Label>
        ) : (
          <Label htmlFor="picture" className="p-4 border rounded-full ">
            <Camera />
          </Label>
        )}
        <Input
          id="picture"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <Input
        type="name"
        placeholder="User name"
        name="name"
        value={userData.name}
        onChange={(e) => {
          setUserData({ ...userData, name: e.target.value });
          setFormError({ ...formError, name: "" });
        }}
      />
      {formError.name && (
        <p className="text-red-400 text-sm px-3">{formError.name}</p>
      )}
      <Input
        type="email"
        placeholder="Email"
        name="email"
        value={userData.email}
        onChange={(e) => {
          setUserData({ ...userData, email: e.target.value });
          setFormError({ ...formError, email: "" });
        }}
      />
      {formError.email && (
        <p className="text-red-400 text-sm px-3">{formError.email}</p>
      )}
      <div>
        <div className="flex gap-2 relative">
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={(e) => {
              setUserData({ ...userData, password: e.target.value });
              setFormError({ ...formError, password: "" });
            }}
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
        <div>
          {formError.password && (
            <p className="text-red-400 text-sm px-3">{formError.password}</p>
          )}
        </div>
      </div>
      <div>
        <div className="flex gap-2 relative">
          <Input
            type={confirmShow ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirm-password"
            value={userData.confirmPassword}
            onChange={(e) => {
              setUserData({ ...userData, confirmPassword: e.target.value });
              setFormError({ ...formError, confirmPassword: "", general: "" });
            }}
          />
          <Button
            className="absolute right-0"
            type="button"
            variant={"ghost"}
            onClick={() => setConfirmShow((prev) => !prev)}
          >
            {confirmShow ? <Eye /> : <EyeOff />}
          </Button>
        </div>
        <div>
          {formError.confirmPassword && (
            <p className="text-red-400 text-sm px-3">
              {formError.confirmPassword}
            </p>
          )}
          {formError.general && (
            <p className="text-red-400 text-sm px-3">{formError.general}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        variant={"secondary"}
        disabled={isPending}
      >
        Sign Up
      </Button>
    </form>
  );
}

export default SignUpComp;
