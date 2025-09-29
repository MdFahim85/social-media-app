import cloudinary from "@/lib/cloudinary";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import streamifier from "streamifier";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (!token) {
      return NextResponse.json({
        message: "You must log in to perform this action",
        status: 401,
      });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ imageUrls: [] });
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
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
    });
    const imageUrls = await Promise.all(uploadPromises);
    return NextResponse.json({ imageUrls, status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
