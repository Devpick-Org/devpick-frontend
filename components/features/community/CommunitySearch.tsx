"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CommunitySearchProps {
  onSearch?: (query: string) => void;
}

export function CommunitySearch({ onSearch }: CommunitySearchProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder="질문을 검색해 보세요..."
        value={query}
        onChange={handleChange}
        className="h-12 rounded-lg bg-muted/60 pl-11 pr-4 text-center text-sm text-foreground font-medium placeholder:text-muted-foreground focus-visible:!ring-0 focus-visible:!border-border focus-visible:outline-none"
      />
    </div>
  );
}
