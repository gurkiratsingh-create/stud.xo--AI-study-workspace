import {
  Bell,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search your workspace..."
          className="pl-9"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>

        <Button
          variant="outline"
          className="gap-2"
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            G
          </div>

          Gurkirat
        </Button>
      </div>
    </header>
  );
}

export default Navbar;