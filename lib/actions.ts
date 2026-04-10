"use server";

import prisma from "./db";
import { revalidatePath } from "next/cache";

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const existing = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existing) {
      return { message: "You're already on the waitlist! We'll be in touch." };
    }

    await prisma.waitlist.create({
      data: { email },
    });

    revalidatePath("/"); // Revalidate the landing page
    return { success: "Success! You've been added to the waitlist." };
  } catch (error) {
    console.error("Waitlist error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}
