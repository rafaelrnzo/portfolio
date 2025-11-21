"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import IconGithub from "@/components/shared/icons/github";
import IconArrowRightUp from "@/components/shared/icons/arrow-right-up";

type ProjectCardProps = {
  title: string;
  description: string;
  tech: string[];
  href?: string;
  repo?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export default function ProjectCard({
  title,
  description,
  tech,
  href,
  repo,
  imageSrc,
  imageAlt = `${title} preview`,
}: ProjectCardProps) {
  const hasImage = Boolean(imageSrc && imageSrc.trim().length > 0);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-foreground/10 bg-background/50 transition-all hover:border-foreground/20 hover:bg-foreground/[0.02]">
      <div
        className={`flex items-stretch ${
          hasImage ? "flex-col md:flex-row" : "flex-col md:flex-row"
        }`}
      >
        {hasImage && (
          <div className="relative w-full md:w-[40%] lg:w-[36%] xl:w-[34%] md:self-stretch">
            {/* Perubahan di sini:
                md:min-h-full memastikan container gambar merenggang mengikuti teks di sebelahnya.
            */}
            <div className="relative w-full overflow-hidden aspect-[16/9] md:aspect-auto md:h-full md:min-h-[220px]">
              <Image
                src={imageSrc!}
                alt={imageAlt}
                fill
                // UPDATE: Ditambahkan 'object-top'
                // 'object-cover': Memastikan gambar full tanpa gepeng
                // 'object-top': Memastikan gambar di-crop dari bawah (atas selalu kelihatan)
                className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 40vw, 34vw"
                priority={false}
              />
            </div>
          </div>
        )}

        <div
          className={`flex flex-1 flex-col justify-between ${
            hasImage ? "p-4 md:p-4" : "p-4"
          }`}
        >
          <div className="flex items-start justify-start">
            <div className="w-full h-full flex items-start text-start">
              <p className="text-base font-medium tracking-tight text-foreground">
                {href ? (
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-4"
                  >
                    {title}
                  </Link>
                ) : (
                  title
                )}
              </p>
            </div>

            <div className="ml-3 flex items-center gap-2">
              {href && (
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open live project"
                  className="grid h-8 w-8 place-items-center rounded-md border border-foreground/10 text-foreground/70 transition-all hover:border-foreground/20 hover:bg-foreground/[0.04] hover:text-foreground"
                >
                  <IconArrowRightUp />
                </Link>
              )}
              {repo && (
                <Link
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open GitHub repository"
                  className="grid h-8 w-8 place-items-center rounded-md border border-foreground/10 text-foreground/70 transition-all hover:border-foreground/20 hover:bg-foreground/[0.04] hover:text-foreground"
                >
                  <IconGithub />
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 ">
            <span className="h-auto text-sm leading-relaxed text-foreground/80">
              {description}
            </span>

            <div className=" flex flex-wrap gap-2">
              {tech.map((t) => (
                <div
                  key={t}
                  className="flex w-full md:w-auto items-center justify-between border border-foreground/10 rounded-lg px-4 py-1 hover:bg-foreground/[0.02] hover:border-foreground/20 transition-all group"
                >
                  <div className="flex flex-row items-center">
                    <span className="text-sm tracking-tight text-foreground/80 group-hover:text-foreground">
                      {t}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}