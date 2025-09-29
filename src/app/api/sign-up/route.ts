import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import cloudinary from "@/lib/cloudinary";
import streamifier from "streamifier";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const image = formData.get("image") as File;

  if (!name || !email || !password) {
    return NextResponse.json({
      message: "Missing information. Please fill all the fields",
      status: 400,
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json({ message: "User already exists", status: 400 });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  let imageUrl = "";

  if (image) {
    const uploadPromise = async (image: File) => {
      const buffer = Buffer.from(await image.arrayBuffer());
      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "socialMediaApp",
            resource_type: "auto",
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result?.secure_url || "");
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };
    imageUrl = await uploadPromise(image);
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPass,
      ...(imageUrl && { image: imageUrl }),
    },
  });

  if (newUser) {
    return NextResponse.json({
      message: "Registration Complete",
      status: 201,
      newUser,
    });
  } else {
    return NextResponse.json({
      message: "Something went wrong, couldnt register user",
      status: 500,
    });
  }
}
