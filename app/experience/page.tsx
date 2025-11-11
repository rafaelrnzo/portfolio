import Container from "@/components/shared/container";
import React from "react";

type WorkItem = {
  company: string;
  role: string;
  period: string;
  summary: React.ReactNode;
  bullets: React.ReactNode[];
};

const workItems: WorkItem[] = [
  {
    company: "PT Falah Inovasi Teknologi",
    role: "Backend Developer",
    period: "Jul 2024 - Present",
    summary:
      "PT Falah Inovasi Teknologi is a fast-growing technology company dedicated to delivering robust ERP, AI, and enterprise solutions for modern businesses. My role focuses on building scalable backend architectures, integrating AI automation, and streamlining system reliability across deployments.",
    bullets: [
      "Engineered RESTful APIs and backend modules within ERPNext (Frappe) and FastAPI ecosystems to support multi-tenant enterprise systems.",
      "Integrated AI-driven services for document summarization, content generation, and intelligent automation workflows using Python.",
      "Managed Linux-based server environments, ensuring high availability and secure deployment of AI and ERP applications.",
      "Containerized environments with Docker and orchestrated Git-based CI/CD workflows for consistent releases.",
      "Collaborated with cross-functional teams to improve system scalability, reduce latency, and ensure smooth delivery pipelines.",
    ],
  },
  {
    company: "Lantech",
    role: "Founder",
    period: "Mar 2025 - Present",
    summary:
      "Lantech is an independent digital studio I founded to provide tailor-made software and design solutions for startups, education, and creative industries. The mission is to combine technology and design to create meaningful user experiences with lasting impact.",
    bullets: [
      "Led multidisciplinary teams to deliver web and mobile projects, including online exam platforms and learning games for children with special needs.",
      "Oversaw the entire product lifecycle from ideation and prototyping to launch and maintenance ensuring on-time and high-quality delivery.",
      "Designed scalable UI systems and optimized Git workflows for collaborative development and rapid iteration.",
      "Balanced technical execution with client relations, ensuring transparent communication and long-term satisfaction.",
    ],
  },
  {
    company: "Upwork",
    role: "Freelance UI/UX Designer",
    period: "Aug 2023 - Jul 2024",
    summary:
      "As an independent designer on Upwork, I collaborated with international clients to craft visually engaging, accessible, and responsive user interfaces that elevate brand identity and usability.",
    bullets: [
      "Delivered end-to-end UI/UX projects, transforming client visions into intuitive designs through Figma and iterative user feedback.",
      "Created reusable design systems using Auto Layout and Components to enhance scalability across products.",
      "Applied user-centered design principles to optimize layouts, accessibility, and overall user flow.",
      "Maintained close communication with clients, providing design recommendations and refining outputs based on usability testing.",
    ],
  },
  {
    company: "PT Solusi Intek Indonesia",
    role: "Mobile Developer & UI/UX Designer",
    period: "Oct 2022 - Apr 2023",
    summary:
      "PT Solusi Intek Indonesia specializes in industrial automation and technology integration. I contributed to building cross-platform mobile and IoT solutions that merge design thinking with technical precision.",
    bullets: [
      "Designed interactive mobile interfaces wireframes, flows, and layouts to deliver seamless user experiences.",
      "Developed hybrid applications using React Native and Flutter with consistent component patterns.",
      "Built IoT features for real-time robot control and parameter monitoring via MQTT and Bluetooth communication.",
      "Worked closely with engineers and designers to align UX goals with system constraints for reliable, efficient deployments.",
    ],
  },
];

export default function Work() {
  return (
    <Container size="large">
      <main className="prose prose-neutral">
        <header>
          <p className="text-[15px] leading-relaxed opacity-80">
            On a mission to craft software that blends design, intelligence, and
            reliability. Below is an overview of my professional journey each
            role shaped by a commitment to technical depth, collaboration, and
            meaningful user impact.
          </p>
        </header>

        <section>
          {workItems.map((item) => (
            <article key={item.company} className="mb-12">
              <header className="mb-4">
                <h2 className="font-medium text-xl mb-1 tracking-tight">
                  {item.company}
                </h2>
                <time className="opacity-60 text-[15px] tracking-tight flex items-center gap-2">
                  <span>{item.role}</span>
                  <span className="text-xs">•</span>
                  <span>{item.period}</span>
                </time>

              </header>

              <p className="text-[15px] leading-relaxed opacity-80">
                {item.summary}
              </p>

              <ul className="text-[15px] leading-relaxed opacity-80">
                {item.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
    </Container>
  );
}
