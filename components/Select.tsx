"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type SelectOption = { value: string; label: string };

// A drop-down in the style of the site (the native one cannot be styled). It
// follows the "select-only combobox" pattern: the button keeps the focus, the
// arrows move through the list, Enter or Space pick, Esc closes only the list
// (so it does not close the dialog the form may sit in), letters jump to an option.
export default function Select({
  value,
  onChange,
  options,
  placeholder,
  label,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  // Shown while nothing is picked (the option with the empty value).
  placeholder: string;
  // The accessible name of the control.
  label: string;
  // Look of the button; the form passes the same classes as for its inputs.
  className?: string;
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const [open, setOpen] = useState(false);
  const [upward, setUpward] = useState(false);
  const [active, setActive] = useState(0);

  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selected = value ? options.find((option) => option.value === value) : undefined;

  const show = () => {
    // Opens upward when there is no room below, e.g. at the bottom of a dialog.
    const rect = rootRef.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      setUpward(below < 280 && rect.top > below);
    }
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
  };

  // A click anywhere else closes the list.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the highlighted option in view. Scrolling the list itself, not the
  // page: scrollIntoView could also move the page under the smooth scroller.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[active] as HTMLElement | undefined;
    if (!open || !list || !item) return;
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
    }
  }, [open, active]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((index) => Math.min(options.length - 1, index + 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        setActive((index) => Math.max(0, index - 1));
        return;
      case "Home":
        event.preventDefault();
        setActive(0);
        return;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        return;
      case "Escape":
        // Only the list closes; a dialog around the form stays open.
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        return;
      case "Tab":
        setOpen(false);
        return;
    }
    // Letters: jump to the next option that starts with what was typed.
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      const state = typed.current;
      state.text = now - state.at < 700 ? state.text + event.key.toLowerCase() : event.key.toLowerCase();
      state.at = now;
      // The same letter pressed again cycles through the options starting with it.
      const query = /^(.)\1+$/.test(state.text) ? state.text[0] : state.text;
      const start = query.length === 1 ? active + 1 : active;
      for (let step = 0; step < options.length; step++) {
        const index = (start + step) % options.length;
        if (options[index].label.toLowerCase().startsWith(query)) {
          setActive(index);
          break;
        }
      }
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        // Space activates a button on key release; the key press already did the work.
        onKeyUp={(event) => {
          if (event.key === " ") event.preventDefault();
        }}
        onBlur={(event) => {
          if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
        }}
        className={`flex cursor-pointer items-center justify-between gap-3 text-left ${
          open ? "!border-white/30" : ""
        } ${className}`}
      >
        <span className={`truncate ${selected ? "text-white" : "text-gray-500"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className={`select-pop select-scroll absolute right-0 left-0 z-50 max-h-64 overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-popover p-2 text-left shadow-2xl shadow-shade/60 ${
            upward ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value || "none"}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                // The button keeps the focus while the pointer is on the list.
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-2.5 transition-colors ${
                  index === active ? "bg-white/8 text-white" : "text-gray-300"
                } ${option.value ? "" : "text-gray-400"}`}
              >
                <span>{option.label}</span>
                {isSelected && option.value && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
