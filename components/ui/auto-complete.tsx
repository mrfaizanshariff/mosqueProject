'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp, Search } from 'lucide-react';

import { cn } from '../../lib/utils';

interface AutocompleteProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

const Autocomplete = React.forwardRef<
  HTMLInputElement,
  AutocompleteProps
>(({ options, placeholder = 'Select an option', searchPlaceholder = 'Search...', className, onValueChange }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredOptions, setFilteredOptions] = React.useState(options);
  const [selectedValue, setSelectedValue] = React.useState('');

  React.useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setSearchTerm(options.find(opt => opt.value === value)?.label || '');
    setOpen(false);
    onValueChange?.(value);
  };

  return (
    <SelectPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      value={selectedValue}
      onValueChange={handleSelect}
    >
      <div className="relative">
        <input
          ref={ref}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setOpen(true);
            setSelectedValue('');
          }}
          placeholder={placeholder}
          className={cn(
            'flex h-10 w-full items-center rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          onFocus={() => setOpen(true)}
        />
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
        {selectedValue && (
          <Check className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
        )}
      </div>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={cn(
            'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'data-[side=bottom]:translate-y-1'
          )}
          position="popper"
        >
          <SelectPrimitive.ScrollUpButton
            className="flex cursor-default items-center justify-center py-1"
          >
            <ChevronUp className="h-4 w-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-4 w-4" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))
            ) : (
              <div className="px-8 py-1.5 text-sm text-muted-foreground">
                No results found
              </div>
            )}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton
            className="flex cursor-default items-center justify-center py-1"
          >
            <ChevronDown className="h-4 w-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
});
Autocomplete.displayName = 'Autocomplete';

export { Autocomplete };