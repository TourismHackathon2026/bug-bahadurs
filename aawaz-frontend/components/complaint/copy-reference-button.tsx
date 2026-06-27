"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "@phosphor-icons/react"

interface CopyReferenceButtonProps {
  reference: string
}

export function CopyReferenceButton({ reference }: CopyReferenceButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reference)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="gap-2"
      onClick={handleCopy}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy reference"}
    </Button>
  )
}
