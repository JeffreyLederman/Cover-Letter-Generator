import { NextResponse } from "next/server";

export async function GET() {
  const templates = [
    {
      id: "classic",
      name: "Classic",
      description: "Centered name and contact information",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Name left, contact right with blue accent line",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean sans-serif with subtle border",
    },
  ];

  return NextResponse.json(templates);
}


