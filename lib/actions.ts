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

interface CreateJobData {
  title: string;
  company: string;
  location: string;
  salary?: string;
  type?: string;
  experience?: string;
  description?: string;
  skills: string[];
  recruiterId: string;
}

export async function createJob(data: CreateJobData) {
  try {
    const job = await prisma.job.create({
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        salary: data.salary || null,
        type: data.type || "full-time",
        experience: data.experience || null,
        description: data.description || null,
        skills: data.skills,
        recruiterId: data.recruiterId,
      },
    });

    revalidatePath("/recruiter/dashboard");
    revalidatePath("/recruiter/post-job");
    return { success: true, job };
  } catch (error) {
    console.error("Create job error:", error);
    return { error: "Failed to create job. Please try again." };
  }
}
