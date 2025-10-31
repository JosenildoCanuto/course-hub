"use client";

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";

type Props = {
  order: number;
  title: string;
  onClick: () => void;
  isActive?: boolean;
};

export function BoxLesson({
  order,
  title,
  onClick,
  isActive = false,
}: Props) {
  return (
    <Item
      variant={isActive ? "default" : "outline"}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isActive && "border-primary bg-primary",
      )}
      onClick={onClick}
    >
      <ItemContent className="flex gap-3">
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-medium">
            {order}
          </span>
          <ItemTitle
            className={cn(
              "text-sm font-medium line-clamp-2",
              isActive && 'text-white'
            )}
          >
            {title}
          </ItemTitle>
        </div>
      </ItemContent>
    </Item>
  );
}
