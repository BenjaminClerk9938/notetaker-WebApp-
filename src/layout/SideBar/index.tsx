import { Button } from "../../components/ui/button";
import { Plus, Users2 } from "lucide-react";
import React from "react";

const SideBar = () => {
  return (
    <div className=" border-r border-border bg-card p-4 sidebar h-full ">
      <h2 className="text-lg font-semibold mb-4">Spaces</h2>
      <div className="space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <Users2 className="mr-2" />
          Product Team
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Users2 className="mr-2" />
          Engineering
        </Button>

        <Button variant="ghost" className="w-full justify-start text-primary">
          <Plus className="mr-2" />
          Create Space
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
