import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Star, ListTodo, Trash2 } from "lucide-react";
import { Message } from "../types";
import { speakerColors } from "../data/meetings";
import { cn } from "../lib/utils";

interface MessageListProps {
  messages: Message[];
  hoveredDelete: string | null;
  onStar: (id: string) => void;
  onAddToActionItems: (content: string) => void;
  onDelete: (id: string) => void;
  onHoverDelete: (id: string | null) => void;
}

export function MessageList({
  messages,
  hoveredDelete,
  onStar,
  onAddToActionItems,
  onDelete,
  onHoverDelete,
}: MessageListProps) {
  console.log(messages);
  return (
    <ScrollArea className="h-[calc(100vh-350px)]">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "group flex items-start space-x-4 p-4 rounded-lg transition-colors",
              message.isStarred && "bg-yellow-500/10",
              hoveredDelete === message.id && "bg-red-500/10",
              !message.isStarred &&
                hoveredDelete !== message.id &&
                "hover:bg-secondary"
            )}
          >
            <Avatar className={speakerColors[message.speaker]}>
              <AvatarFallback>{message.speaker}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{message.speaker}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-1">{message.content}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  message.isStarred && "text-yellow-500"
                )}
                onClick={() => onStar(message.id)}
              >
                <Star className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAddToActionItems(message.content)}
              >
                <ListTodo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete(message.id)}
                onMouseEnter={() => onHoverDelete(message.id)}
                onMouseLeave={() => onHoverDelete(null)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
