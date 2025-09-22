"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

type ErrorCardProps = {
  errorMessage: string;
};

export default function ErrorCard({ errorMessage }: ErrorCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto mt-6 bg-transparent border border-red-300 dark:border-red-700 text-center">
      <CardHeader className="flex flex-col items-center justify-center py-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
        <CardTitle className="text-lg font-semibold text-red-600 dark:text-red-400">
          Something went wrong
        </CardTitle>
        <CardDescription className="text-sm text-red-700 dark:text-red-300 mt-1">
          {errorMessage}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
