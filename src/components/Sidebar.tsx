import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Plus, Trash2 } from "lucide-react"
import { ActionItem } from '../types'
import { speakerColors } from '../data/meetings'
import { cn } from '../lib/utils'

interface ActionItemsProps {
  items: ActionItem[];
  newItem: string;
  onNewItemChange: (value: string) => void;
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (id: string, content: string) => void;
  onSetEditing: (items: ActionItem[]) => void;
}

export function ActionItems({
  items,
  newItem,
  onNewItemChange,
  onAddItem,
  onDeleteItem,
  onEditItem,
  onSetEditing
}: ActionItemsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Action Items</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2 items-center">
            <Input
              placeholder="Add new action item..."
              value={newItem}
              onChange={(e) => onNewItemChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onAddItem()}
              className="flex-1"
            />
            <Button 
              onClick={onAddItem} 
              size="icon" 
              className="rounded-full shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex items-start space-x-2 p-3 rounded-md bg-secondary/50 hover:bg-secondary"
              >
                {item.isEditing ? (
                  <Input
                    defaultValue={item.content}
                    onBlur={(e) => onEditItem(item.id, e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    <p 
                      className="flex-1 leading-relaxed" 
                      onDoubleClick={() => onSetEditing(
                        items.map(i => i.id === item.id ? {...i, isEditing: true} : i)
                      )}
                    >
                      {item.content}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 -mt-1"
                      onClick={() => onDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SpeakerStatsProps {
  stats: Record<string, number>;
}

export function SpeakerStats({ stats }: SpeakerStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Speaker Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(stats).map(([name, percentage]) => (
            <div key={name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{name}</span>
                <span className="text-muted-foreground">
                  {percentage}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${speakerColors[name]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}