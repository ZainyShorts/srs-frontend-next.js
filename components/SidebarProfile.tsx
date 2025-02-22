import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import Image from 'next/image'
import { LogOut } from 'lucide-react'

const SidebarProfile = ({title}:{title:string}) => {
  return (
    <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-16 w-full justify-start gap-x-4 px-6 py-3 hover:bg-gray-50">
                      <Image
                        className="h-8 w-8 rounded-full bg-gray-50"
                        src="https://external-preview.redd.it/auth0-stable-support-for-app-router-v0-9hlmLSqkruo0AYwR-TJd50zI1txBKsK5e1Qputn2lGM.jpg?width=1080&crop=smart&auto=webp&s=f25c5459703d0f6d74df1a2bc49103c8629fd396"
                        alt=""
                        width={32}
                        height={32}
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold leading-6 text-gray-900">Zainy</span>
                        <span className="text-xs leading-6 text-gray-400">{title}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
  )
}

export default SidebarProfile