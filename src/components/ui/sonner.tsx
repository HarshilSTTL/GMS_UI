"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { X, CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      closeButton
      duration={4000}
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-green-600" />
        ),
        info: (
          <InfoIcon className="size-4 text-blue-600" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-amber-600" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-600" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-gray-500" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:bg-white group-[.toaster]:text-[#0E1C2F] group-[.toaster]:border-[#DDE3EE] group-[.toaster]:shadow-[0_4px_16px_rgba(14,28,47,0.12)]",
          title: "text-[13px] font-semibold text-[#0E1C2F]",
          description: "text-[11px] text-[#7A8FA6]",
          actionButton: "bg-blue-600 text-white text-[11px] font-semibold",
          cancelButton: "bg-white text-[#3D5068] text-[11px] font-semibold border border-[#DDE3EE]",
          closeButton: "!bg-white !border-[#DDE3EE] !text-[#7A8FA6] hover:!text-[#0E1C2F] hover:!border-[#C8D0DE] !right-[-4px] !top-[-4px]",
          success: "group-[.toaster]:border-l-[3px] group-[.toaster]:border-l-green-500",
          error: "group-[.toaster]:border-l-[3px] group-[.toaster]:border-l-red-500",
          warning: "group-[.toaster]:border-l-[3px] group-[.toaster]:border-l-amber-500",
          info: "group-[.toaster]:border-l-[3px] group-[.toaster]:border-l-blue-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
