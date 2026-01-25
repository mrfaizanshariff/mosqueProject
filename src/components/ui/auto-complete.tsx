"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "../../../lib/utils"

export interface AutocompleteOption {
    label: string
    id: string | number
}

interface AutocompleteProps {
    options: AutocompleteOption[]
    value?: string | number | null
    onChange: (value: any) => void
    placeholder?: string
    emptyMessage?: string
    className?: string
}

export function Autocomplete({
    options,
    value,
    onChange,
    placeholder = "Select...",
    emptyMessage = "No results found.",
    className
}: AutocompleteProps) {
    const [open, setOpen] = React.useState(false)

    // Ensure value matching works for both number and string types
    const selectedOption = options.find(option => String(option.id) === String(value))

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-popover text-popover-foreground shadow-md border rounded-md z-50 overflow-hidden" align="start">
                <CommandPrimitive className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground max-h-[300px]">
                    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                        <CommandPrimitive.Input
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search..."
                        />
                    </div>
                    <CommandPrimitive.List className="overflow-y-auto overflow-x-hidden">
                        <CommandPrimitive.Empty className="py-6 text-center text-sm">
                            {emptyMessage}
                        </CommandPrimitive.Empty>
                        <CommandPrimitive.Group>
                            {options.map((option) => (
                                <CommandPrimitive.Item
                                    key={option.id}
                                    value={option.label}
                                    onSelect={() => {
                                        onChange(option.id)
                                        setOpen(false)
                                    }}
                                    className={cn(
                                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground transition-colors",
                                        String(value) === String(option.id) ? "bg-accent/50" : ""
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            String(value) === String(option.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandPrimitive.Item>
                            ))}
                        </CommandPrimitive.Group>
                    </CommandPrimitive.List>
                </CommandPrimitive>
            </PopoverContent>
        </Popover>
    )
}
