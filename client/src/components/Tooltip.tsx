import React from "react"

import {
    Tooltip as TooltipComponent,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const Tooltip = ({ children, label }: { children: React.ReactNode, label: string }) => {
    return (
        <TooltipProvider>
            <TooltipComponent>
                <TooltipTrigger className="h-fit">{children}</TooltipTrigger>
                <TooltipContent sideOffset={0}>
                    <p>{label}</p>
                </TooltipContent>
            </TooltipComponent>
        </TooltipProvider>

    )
}

export default Tooltip