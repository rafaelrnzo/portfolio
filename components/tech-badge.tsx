"use client";

import React from "react";

type ToolButtonProps = {
  label: string;
};

export function ToolButton({ label }: ToolButtonProps) {
  return (
    <div className="flex w-full md:w-auto items-center justify-between border border-foreground/10 rounded-lg px-4 py-2 hover:bg-foreground/[0.02] hover:border-foreground/20 transition-all group">
      <div className="flex flex-row items-center">
        <span className="text-sm tracking-tight text-foreground/80 group-hover:text-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function TechBadge() {
  const tools = [
    "TypeScript",
    "JavaScript",
    "Python",
    "Golang",
    "React",
    "React Native",
    "Flutter",
    "Next.js",
    "Nest.js",
    "Django",
    "ERPNext (Frappe)",
    "FastAPI",
    "Docker",
    "Linux",
    "Redis",
    "Neo4j",
    "Kafka",
    "PostgreSQL",
    "Tailwind CSS",
    "Figma",
    "Tensorflow",
    "LangChain",
    "RAG",
    "LLM Automation",
  ];

  return (
    <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-2 ">
      {tools.map((tool) => (
        <ToolButton key={tool} label={tool} />
      ))}
    </div>
  );
}
