import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Separator } from "./ui/separator"
import { UserCircle, CreditCard, LogOut } from "lucide-react"

export function UserMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <UserCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-card border-border p-2">
        <div className="space-y-3">
          <div className="px-2 py-1.5">
            <div className="font-medium">Garrett Chu</div>
            <div className="text-sm text-muted-foreground">garrett@company.com</div>
          </div>
          <Separator />
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}