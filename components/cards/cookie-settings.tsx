"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function CardsCookieSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookie Settings</CardTitle>
        <CardDescription>Manage your cookie settings here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-start gap-8">
          <div className="flex-1">
            <p className="font-medium">Strictly Necessary</p>
            <p className="text-sm text-muted-foreground mt-1">
              These cookies are essential in order to use the website and use
              its features.
            </p>
          </div>
          <Switch id="necessary" defaultChecked aria-label="Necessary" />
        </div>
        <div className="flex items-start gap-8">
          <div className="flex-1">
            <p className="font-medium">Functional Cookies</p>
            <p className="text-sm text-muted-foreground mt-1">
              These cookies allow the website to provide personalized
              functionality.
            </p>
          </div>
          <Switch id="functional" aria-label="Functional" />
        </div>
        <div className="flex items-start gap-8">
          <div className="flex-1">
            <p className="font-medium">Performance Cookies</p>
            <p className="text-sm text-muted-foreground mt-1">
              These cookies help to improve the performance of the website.
            </p>
          </div>
          <Switch id="performance" aria-label="Performance" />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Save preferences
        </Button>
      </CardFooter>
    </Card>
  );
}
