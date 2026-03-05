"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type DropdownMenuContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextType>({
  open: false,
  setOpen: () => {},
});

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export function DropdownMenuTrigger({
  asChild,
  children,
}: DropdownMenuTriggerProps) {
  const { open, setOpen } = useContext(DropdownMenuContext);

  if (asChild && isValidElement(children)) {
    const child = children as React.ReactElement<
      Record<string, unknown> & { onClick?: (e: React.MouseEvent) => void }
    >;
    return cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        setOpen(!open);
      },
    });
  }

  return (
    <button type="button" onClick={() => setOpen(!open)}>
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
}

export function DropdownMenuContent({
  children,
  className,
  align = "start",
}: DropdownMenuContentProps) {
  const { open } = useContext(DropdownMenuContext);

  if (!open) return null;

  const alignClass = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }[align];

  return (
    <div
      className={cn(
        "absolute top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-border bg-card p-1 shadow-md",
        alignClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

interface DropdownMenuItemProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  onSelect?: (e: Event) => void;
}

export function DropdownMenuItem({
  asChild,
  children,
  className,
  onSelect,
}: DropdownMenuItemProps) {
  const { setOpen } = useContext(DropdownMenuContext);

  const handleSelect = () => {
    if (onSelect) {
      const event = new Event("select", { cancelable: true });
      onSelect(event);
      if (event.defaultPrevented) return;
    }
    setOpen(false);
  };

  const itemClass = cn(
    "flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as React.ReactElement<
      Record<string, unknown> & {
        onClick?: (e: React.MouseEvent) => void;
        className?: string;
      }
    >;
    return cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        handleSelect();
      },
      className: cn(itemClass, child.props.className),
    });
  }

  return (
    <div className={itemClass} onClick={handleSelect}>
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} />;
}
