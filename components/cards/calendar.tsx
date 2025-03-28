"use client";

import { addDays } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

const start = new Date(2023, 5, 5);

export function CardsCalendar() {
  return (
    <Card className="w-full justify-center flex items-center">
      <CardContent className="p-1">
        <Calendar
          className="w-full"
          numberOfMonths={1}
          mode="range"
          defaultMonth={start}
          selected={{
            from: start,
            to: addDays(start, 8),
          }}
        />
      </CardContent>
    </Card>
  );
}
