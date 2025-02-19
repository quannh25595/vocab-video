import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const filename = formData.get("filename") as string;

    if (!file || !filename) {
      return NextResponse.json(
        { error: "File and filename are required" },
        { status: 400 }
      );
    }

    const extension = extname(file.name); // Get extension from original file
    const filenameWithExt = `${filename}${extension}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the directory exists
    const resourcePath = join(process.cwd(), "public/resources");
    await mkdir(resourcePath, { recursive: true });

    // Save the file with extension
    const filePath = join(resourcePath, filenameWithExt);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      path: `/resources/${filenameWithExt}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
