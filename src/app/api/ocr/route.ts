import { streamText } from 'ai';
import 'dotenv/config';
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { db } from '@/db';
import { examImages } from '@/db/data_schema';
import { eq } from 'drizzle-orm';
export async function POST(request: Request) {
  try {
    const { examId } = await request.json()

    if (!examId) {
      return NextResponse.json({ error: "Missing exam ID" }, { status: 400 })
    }

    const pages = await db.select().from(examImages).where(eq(examImages.ocr_stauts,'pending'))    

    let successCount = 0
    let failCount = 0
    
    // Process each page with OCR
    for (const page of pages) {
      // Update status to processing
      await db.update(examImages).set({ocr_stauts:'processing'}).where(eq(examImages.id,page.id))
      try {
        const { text } = await generateText({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all text from this exam paper image. Preserve the original formatting as much as possible, including question numbers, equations, and any special characters. Return only the extracted text, nothing else.",
                },
                {
                  type: "image",
                  image: page.image_url as any ,
                },
              ],
            },
          ],
        })

        // Update page with extracted text
        await db.update(examImages).set({extracted_text:text,ocr_stauts:'compelted'}).where(eq(examImages.id,page.id))
        successCount++
      } catch (ocrError) {
        console.error(`OCR failed for page ${page.id}:`, ocrError)

        await db.update(examImages).set({ocr_stauts:'failed'}).where(eq(examImages.id,page.id))
        failCount++
      }
    }

    return NextResponse.json({
      success: true,
      pagesProcessed: successCount,
      pagesFailed: failCount,
    })
  } catch (error) {
    console.error("OCR processing error:", error)
    return NextResponse.json({ error: "OCR processing failed" }, { status: 500 })
  }
}
