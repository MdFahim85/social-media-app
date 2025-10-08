"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { CalendarIcon, Camera } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { getProfileInfo, updateProfile } from "@/lib/api/profileApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { differenceInYears, format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { redirect } from "next/navigation";
import UpdateUserSkeleton from "./UpdateUserSkeleton";

type PreviewItem = {
  file: File;
  url: string;
  id: number;
};

function UpdateCard() {
  const initialUserState = {
    name: "",
    bio: "",
    location: "",
    birthday: undefined as Date | undefined,
    image: null as File | null,
    banner: null as File | null,
  };
  const queryClient = useQueryClient();
  const session = useSession();
  const currentUser = session.data?.user;
  const id = currentUser?.id;

  const [userData, setUserData] = useState(initialUserState);

  const [preview, setPreview] = useState<PreviewItem>();
  const [previewBanner, setPreviewBanner] = useState<PreviewItem>();

  const [formData, setFormData] = useState(new FormData());
  const [dateError, setDateError] = useState("");

  const { isPending: isLoading, data: userDetails } = useQuery({
    queryKey: ["fetchProfileInfo", id],
    queryFn: () => getProfileInfo(id as string),
    retry: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => updateProfile(id as string, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchProfileInfo"],
      });
      toast.success("Profile updated successfully");
      window.location.assign(`/profile/${id}`);
    },
    onError: (error) => {
      toast.error(error.message);
      setFormData(new FormData());
    },
  });

  if (isLoading) {
    return <UpdateUserSkeleton />;
  }

  const { user } = userDetails?.data;

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
  const handleBannerUpload = (
    e: ChangeEvent<HTMLInputElement & { files: File[] }>
  ) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, banner: file });
      const newPreview: PreviewItem = {
        file,
        url: URL.createObjectURL(file),
        id: Date.now() + Math.random(),
      };
      setPreviewBanner(newPreview);
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userData.birthday) {
      const age = differenceInYears(new Date(), userData.birthday);
      if (age < 18) {
        setDateError("You must be at least 18 years old");
        return;
      }
    }

    if (userData.name) {
      formData.append("name", userData.name);
    }

    if (userData.image) {
      formData.append("image", userData.image);
    }

    if (userData.bio) {
      formData.append("bio", userData.bio);
    }

    if (userData.banner) {
      formData.append("banner", userData.banner);
    }

    if (userData.location) {
      formData.append("location", userData.location);
    }
    if (userData.birthday) {
      formData.append("birthday", userData.birthday.toISOString());
    }
    mutate(formData);
  };

  return (
    <form
      onSubmit={(e) => handleFormSubmit(e)}
      className="space-y-6 w-full max-w-4xl mx-auto p-4"
    >
      {/* Profile Picture */}
      <div className="flex justify-center">
        {user.image || preview ? (
          <Label htmlFor="picture" className="cursor-pointer">
            <Image
              src={preview?.url || user.image}
              alt="Profile picture"
              width={100}
              height={100}
              className="rounded-full border-2 border-primary shadow"
            />
          </Label>
        ) : (
          <Label
            htmlFor="picture"
            className="p-6 border rounded-full cursor-pointer flex items-center justify-center"
          >
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Banner */}

        <div className="space-y-4">
          {/* Banner */}
          <h2 className="text-2xl font-semibold text-center md:text-left">
            User Banner
          </h2>
          <div className="relative w-full h-40 md:h-54 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
            {user.banner || previewBanner ? (
              <Label htmlFor="banner" className="cursor-pointer ">
                <Image
                  src={previewBanner?.url || user.banner}
                  alt="Banner"
                  fill
                  className="object-cover"
                />
              </Label>
            ) : (
              <Label
                htmlFor="banner"
                className="cursor-pointer flex flex-col items-center justify-center text-muted-foreground"
              >
                <Camera className="w-8 h-8 mb-2" />
                <span>Upload Banner</span>
              </Label>
            )}
            <Input
              id="banner"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerUpload}
            />
          </div>
        </div>

        {/* Right: User details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center md:text-left">
            User Details
          </h2>

          <Input
            type="text"
            placeholder="User name"
            name="name"
            value={userData.name || user?.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />

          <Input
            type="text"
            placeholder="Tell something about yourself"
            name="bio"
            value={userData.bio || user?.bio}
            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
          />

          <Input
            type="text"
            placeholder="Your location"
            name="location"
            value={userData.location || user?.location}
            onChange={(e) =>
              setUserData({ ...userData, location: e.target.value })
            }
          />

          {/* Birthday Picker */}
          <div className="flex flex-col space-y-2">
            <Label>Birthday</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {userData?.birthday
                    ? format(userData.birthday, "PPP")
                    : user?.birthday
                    ? format(user.birthday, "PPP")
                    : format(new Date(2000, 0, 1), "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-neutral-800 rounded-xl m-2">
                <Calendar
                  mode="single"
                  selected={userData?.birthday}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setUserData({ ...userData, birthday: date });
                    setDateError("");
                  }}
                />
              </PopoverContent>
              {dateError && <p className="text-red-500">{dateError}</p>}
            </Popover>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <Button type="submit" variant="secondary" disabled={isPending}>
          Update
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={isPending}
          onClick={() => redirect(`/profile/${id}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default UpdateCard;
