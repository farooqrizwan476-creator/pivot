"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIInsights = async (industry) => {
  // Yahan humne Gemini 2.5 Flash ko JSON Mode mein set kar diya hai!
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json", // VIP: AI ko majboor karega sirf JSON dene par
    }
  });

  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage. Include at least 5 skills and trends.
        `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // JSON Mode ki wajah se ab humein .replace() (Regex) safayi ki zaroorat nahi
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini API fail ho gai Onboarding ke doran:", error.message);
    
    // BACKUP PLAN: Yeh sirf tab chalega jab Google ka server sach mein down hoga (503 Error)
    return {
      salaryRanges: [
        { role: "General Professional", min: 40000, max: 120000, median: 75000, location: "Global" },
        { role: "Senior Specialist", min: 80000, max: 160000, median: 110000, location: "Global" },
        { role: "Manager", min: 90000, max: 180000, median: 130000, location: "Global" },
        { role: "Director", min: 130000, max: 250000, median: 175000, location: "Global" },
        { role: "Consultant", min: 70000, max: 150000, median: 100000, location: "Global" }
      ],
      growthRate: 8,
      demandLevel: "Medium",
      topSkills: ["Problem Solving", "Adaptability", "Digital Literacy", "Communication", "Teamwork"],
      marketOutlook: "Neutral",
      keyTrends: ["AI Integration", "Remote Work", "Continuous Learning", "Automation", "Data-Driven Decisions"],
      recommendedSkills: ["AI Prompting", "Data Analysis", "Project Management", "Agile Methodologies", "Cloud Basics"]
    };
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}