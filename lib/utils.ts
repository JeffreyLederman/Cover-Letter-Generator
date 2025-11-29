import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple encryption/decryption for API keys (basic obfuscation)
// In production, consider using a proper encryption library
export function encryptApiKey(key: string): string {
  if (!key) return "";
  return Buffer.from(key).toString("base64");
}

export function decryptApiKey(encrypted: string): string {
  if (!encrypted) return "";
  try {
    return Buffer.from(encrypted, "base64").toString("utf-8");
  } catch {
    return "";
  }
}


