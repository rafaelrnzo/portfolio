import { SocialButtonProps } from "@/types";
import IconArrowRightUp from "./shared/icons/arrow-right-up";
import IconYoutube from "./shared/icons/youtube";
import IconGithub from "./shared/icons/github";
import IconCv from "./shared/icons/cv";

import Link from "next/link";
import IconDribbble from "./shared/icons/dribble";

function SocialButton({ href, children }: SocialButtonProps) {
  return (
    <Link
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      passHref
      className="flex min-h-12 w-full items-center justify-between gap-2 rounded-lg border border-foreground/10 px-3 py-2.5 no-underline transition-all hover:border-foreground/20 hover:bg-foreground/[0.02] group"
    >
      {children}
      <div className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <IconArrowRightUp />
      </div>
    </Link>
  );
}

export default function Social() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">

      <SocialButton href="https://www.linkedin.com/in/rafael-lorenzo25/">
        <div className="flex min-w-0 flex-row items-center">
          <IconCv />
          <span className="ml-2 truncate text-[14px] tracking-tight">LinkedIn</span>
        </div>
      </SocialButton>
      <SocialButton href="https://github.com/rafaelrnzo">
        <div className="flex min-w-0 flex-row items-center">
          <IconGithub />
          <span className="ml-2 truncate text-[14px] tracking-tight">Github</span>
        </div>
      </SocialButton>
      <SocialButton href="https://drive.google.com/file/d/1Y4mdX2ICbP1yIOtgpTr9sYtmHneO5QDr/view?usp=sharing">
        <div className="flex min-w-0 flex-row items-center">
          <IconCv />
          <span className="ml-2 truncate text-[14px] tracking-tight">CV</span>
        </div>
      </SocialButton>
      <SocialButton href="https://drive.google.com/file/d/1bUkRaAY_SHbVqguG-UrLUz9I3A93vYP-/view?usp=sharing">
        <div className="flex min-w-0 flex-row items-center">
          <IconCv />
          <span className="ml-2 truncate text-[14px] tracking-tight">Portfolio</span>
        </div>
      </SocialButton>
      <SocialButton href="https://instagram.com/rafaelrnzo">
        <div className="flex min-w-0 flex-row items-center">
          <IconDribbble />
          <span className="ml-2 truncate text-[14px] tracking-tight">IG</span>
        </div>
      </SocialButton>
    </div>
  );
}
