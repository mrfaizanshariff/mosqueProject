import * as React from 'react';
import { cn } from '../../lib/utils';

export interface AutocompleteOption {
  id: string;          // unique id for aria-activedescendant targeting
  label: string;       // rendered text
  value?: string;      // optional separate value
}

export interface AutocompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'onSelect'> {
  options: AutocompleteOption[];
  value?: string; // controlled input text
  defaultValue?: string;
  onChange?: (value: string) => void; // input text change
  onSelect?: (option: AutocompleteOption) => void; // when an option is chosen
  getOptionLabel?: (opt: AutocompleteOption) => string;
  filterOptions?: (opts: AutocompleteOption[], input: string) => AutocompleteOption[];
  renderOption?: (opt: AutocompleteOption, active: boolean) => React.ReactNode;
  emptyText?: string;
  popperClassName?: string;
  optionClassName?: string;
}

const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      className,
      popperClassName,
      optionClassName,
      options,
      value,
      defaultValue,
      onChange,
      onSelect,
      getOptionLabel = (o) => o.label ?? '',
      filterOptions,
      renderOption,
      emptyText = 'No results',
      placeholder,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const [internalValue, setInternalValue] = React.useState<string>(defaultValue ?? '');
    const text = value !== undefined ? value : internalValue;

    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState<number>(-1);
    const listboxId = React.useId();

    const filtered = React.useMemo(() => {
      const base = filterOptions
        ? filterOptions(options, text)
        : options.filter((o) =>
            getOptionLabel(o).toLowerCase().includes(text.trim().toLowerCase())
          );
      return base;
    }, [options, text, filterOptions, getOptionLabel]);

    React.useEffect(() => {
      // Close popup if nothing to show
      if (!disabled && (text.length > 0 || filtered.length > 0)) {
        // keep behavior simple: open when focused and user types/clicks
      }
    }, [text, filtered.length, disabled]);

    const updateText = (next: string) => {
      if (onChange) onChange(next);
      if (value === undefined) setInternalValue(next);
    };

    const commitSelection = (index: number) => {
      if (index < 0 || index >= filtered.length) return;
      const opt = filtered[index];
      updateText(getOptionLabel(opt));
      setOpen(false);
      setActiveIndex(-1);
      onSelect?.(opt);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        setOpen(true);
        setActiveIndex((prev) => {
          if (filtered.length === 0) return -1;
          return e.key === 'ArrowDown' ? 0 : filtered.length - 1;
        });
        e.preventDefault();
        return;
      }

      switch (e.key) {
        case 'ArrowDown': {
          if (!filtered.length) return;
          setActiveIndex((i) => (i + 1) % filtered.length);
          e.preventDefault();
          break;
        }
        case 'ArrowUp': {
          if (!filtered.length) return;
          setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
          e.preventDefault();
          break;
        }
        case 'Home': {
          if (!filtered.length) return;
          setActiveIndex(0);
          e.preventDefault();
          break;
        }
        case 'End': {
          if (!filtered.length) return;
          setActiveIndex(filtered.length - 1);
          e.preventDefault();
          break;
        }
        case 'Enter': {
          if (open && activeIndex >= 0 && activeIndex < filtered.length) {
            commitSelection(activeIndex);
            e.preventDefault();
          }
          break;
        }
        case 'Escape': {
          if (open) {
            setOpen(false);
            setActiveIndex(-1);
            e.preventDefault();
          }
          break;
        }
        case 'Tab': {
          if (open && activeIndex >= 0) {
            commitSelection(activeIndex);
          } else {
            setOpen(false);
          }
          break;
        }
      }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateText(e.target.value);
      setOpen(true);
      setActiveIndex(0);
    };

    const handleFocus = () => {
      if (!disabled) {
        setOpen(true);
      }
    };

    const handleBlur = (e: React.FocusEvent) => {
      // Close only when focus moves outside both input and list
      // Using timeout to allow click on options
      setTimeout(() => {
        const el = document.activeElement;
        const root = containerRef.current;
        if (!root || !el || !root.contains(el)) {
          setOpen(false);
          setActiveIndex(-1);
        }
      }, 0);
    };

    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const activeDescendant =
      open && activeIndex >= 0 && activeIndex < filtered.length
        ? filtered[activeIndex]?.id
        : undefined;

    return (
      <div ref={containerRef} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={activeDescendant}
          placeholder={placeholder}
          disabled={disabled}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            className={cn(
              'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-input bg-popover text-popover-foreground shadow-md',
              'focus:outline-none',
              popperClassName
            )}
          >
            {filtered.length === 0 ? (
              <li
                role="option"
                aria-disabled="true"
                className="px-3 py-2 text-sm text-muted-foreground cursor-default"
              >
                {emptyText}
              </li>
            ) : (
              filtered.map((opt, idx) => {
                const active = idx === activeIndex;
                return (
                  <li
                    key={opt.id}
                    id={opt.id}
                    role="option"
                    aria-selected={active || undefined}
                    tabIndex={-1}
                    onMouseDown={(e) => {
                      // prevent input blur before click handler
                      e.preventDefault();
                    }}
                    onClick={() => commitSelection(idx)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'cursor-pointer select-none px-3 py-2 text-sm',
                      active ? 'bg-accent text-accent-foreground' : '',
                      optionClassName
                    )}
                  >
                    {renderOption ? renderOption(opt, active) : getOptionLabel(opt)}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    );
  }
);

Autocomplete.displayName = 'Autocomplete';

export { Autocomplete };
