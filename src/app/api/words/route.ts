import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface WordPayload {
  word: string;
  meaning: string;
  ipa: string;
  imageUrl: string;
  audioUrl: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WordPayload;

    if (!body.word || !body.meaning || !body.imageUrl || !body.audioUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO words (word, meaning, ipa, image_url, audio_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      body.word,
      body.meaning,
      body.ipa || "",
      body.imageUrl,
      body.audioUrl,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating word:", error);
    return NextResponse.json(
      { error: "Failed to create word" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM words ORDER BY created_at DESC"
    );
    return NextResponse.json({
      success: true,
      data: result.rows.map(
        ({ image_url, audio_url, created_at, ...rest }) => ({
          ...rest,
          createdAt: created_at,
          audioUrl: audio_url,
          imageUrl: image_url,
        })
      ),
    });
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 }
    );
  }
}
