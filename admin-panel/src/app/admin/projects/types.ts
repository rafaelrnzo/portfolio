// app/admin/projects/types.ts

export interface Skill {
  id: string;
  skill: string | null;
}

export interface ProjectTechStackRow {
  skill_id: string | null;
  skills: {
    id: string;
    skill: string | null;
  } | null;
}

export interface Project {
  id: string;
  title: string | null;
  thumbnail: string | null;
  description: string | null;
  git_link: string | null;
  demo_link: string | null;
  created_at: string;
  project_tech_stacks: ProjectTechStackRow[] | null;
}
