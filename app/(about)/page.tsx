import Container from "@/components/shared/container";
import Social from "@/components/social";
import TechBadge from "@/components/tech-badge";
import Script from "next/script";
import React from "react";
import { techGroups } from "../db/type-badge.data";
import LanguageTools from "@/components/tech-badge";

const structuredData: Record<string, any> = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://rafaelrnzo.vercel.app/#rafael-lorenzo",
  name: "Rafael Lorenzo",
  alternateName: ["Rafael", "Rafael Lorenzo"],
  url: "https://rafaelrnzo.vercel.app",
  headline: "Software Engineer • Backend, UI/UX, and AI Integration",
  jobTitle: "Software Engineer",
  sameAs: [
    "https://www.linkedin.com/in/rafael-lorenzo25",
    "mailto:rl.lorenzo.256@gmail.com",
    "https://rafaelrnzo.vercel.app",
  ],
  description:
    "Software Engineer specializing in full-stack development, backend architecture, and AI-driven solutions.",
  knowsAbout: [
    "Full-Stack Development",
    "Backend Engineering",
    "Frontend Engineering",
    "Mobile Development",
    "AI Engineering",
    "UI/UX Design",
    "React",
    "Golang",
    "Django",
    "Laravel",
    "Next.js",
    "Nest.js",
    "TypeScript",
    "Python",
    "Jupyter Notebooks",
    "FastAPI",
    "ERPNext (Frappe)",
    "Developer Frappe",
    "RAG",
    "Docker",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jakarta",
    addressCountry: "ID",
  },
};

export default function About() {
  const paragraphs = [
    "I’m Rafael Lorenzo a Software Engineer passionate about building user focused products that merge clean design with reliable backend systems. I work across React, Next.js, FastAPI, and ERPNext (Frappe) to craft web and AI-powered applications that feel smooth, efficient, and meaningful to use.",
    "I enjoy exploring how design, data, and AI can simplify complex workflows. Whether it’s integrating retrieval-based automation or refining interfaces, my goal is to create technology that feels human thoughtful, accessible, and built to last.",
  ];

  return (
    <Container size="large" className="prose prose-zinc container animate-enter">
      <p className="text-lg font-medium tracking-tight mb-8">
        Hi 👋, I&apos;m Rafael Lorenzo.
      </p>

      {paragraphs.map((paragraph, index) => (
        <div
          key={index}
          style={
            { "--stagger": index } as React.CSSProperties & { [key: string]: number }
          }
        >
          <p
            className={`text-[15px] leading-relaxed opacity-85 ${index === paragraphs.length - 1 ? "mb-8" : "mb-6"
              }`}
          >
            {paragraph}
          </p>
        </div>
      ))}


      <div className="">
        <p className="text-md font-medium">Language & Tools</p>
        <TechBadge />
      </div>

      <div className="">
        <p className="text-md font-medium">Find Me!</p>
        <Social />
      </div>
      
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Container>
  );
}
