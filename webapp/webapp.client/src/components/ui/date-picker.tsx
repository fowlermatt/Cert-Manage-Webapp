import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  name,
  defaultValue,
  dateLimit,
}: {
  name: string;
  defaultValue?: Date | null;
  dateLimit: number;
}) {
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ?? new Date(),
  );

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            required
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            disabled={(date) => {
              // We still want to allow today
              const newDate = new Date(date);
              newDate.setDate(date.getDate() + 1);
              return (
                newDate < new Date() || date > addDays(new Date(), dateLimit)
              );
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <input
        type="hidden"
        required
        name={name}
        value={date?.toISOString() ?? ""}
      />
    </div>
  );
}
