"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, FileText, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Page {
  id: number
  page_number: number
  image_url: string
  extracted_text: string | null
  ocr_status: string
}

interface ExamPageViewerProps {
  pages: Page[]
  examTitle: string
}




export function ExamPageViewer({ pages, examTitle }: ExamPageViewerProps) {


  const [currentPage, setCurrentPage] = useState(0)
  const page = pages[currentPage]
  const hasOcrText = page?.extracted_text && page.extracted_text.trim().length > 0
  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1))
  }

  const handleCopy = async()=>{
    try{
      if(page.extracted_text){
        await navigator.clipboard.writeText(page?.extracted_text);
        toast.success('text copied')
      }
    }catch{

    }
  }

  return (
    <div className="space-y-4">
      {/* Page Navigation */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <Button variant="outline" size="sm" onClick={goToPrevious} disabled={currentPage === 0}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={cn(
                "h-8 w-8 rounded-md text-sm font-medium transition-colors",
                index === currentPage ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={goToNext} disabled={currentPage === pages.length - 1}>
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="image" className="w-full ">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="image" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Image
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2" disabled={!hasOcrText}>
            <FileText className="h-4 w-4" />
            Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="image" className="mt-4 bg-muted ">
          <div className="overflow-hidden rounded-lg  border ">
            <div className="relative aspect-[8.5/11] w-full">
              <Image
                src={page.image_url || "/placeholder.svg"}
                alt={`${examTitle} - Page ${page.page_number}`}
                fill
                className="object-contain"
                priority={currentPage === 0}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="text" className="mt-4 ">
          <div className="rounded-lg border p-6 bg-[#4A4947]" >
            {hasOcrText ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="flex justify-end">
                        <Button onClick={handleCopy} className="hover:scale-105">Copy</Button>
                    </div>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{page.extracted_text}</pre>
              </div>
            ) : (
              <div className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  {page.ocr_status === "pending"
                    ? "OCR processing is pending..."
                    : page.ocr_status === "processing"
                      ? "OCR is currently processing..."
                      : page.ocr_status === "failed"
                        ? "OCR processing failed for this page."
                        : "No text extracted from this page."}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
