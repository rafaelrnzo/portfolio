'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '../../../../lib/supabaseClient';

// --- Tipe Data ---
type Skill = {
  id: string;
  skill: string;
};

type ProjectRow = {
  id: string;
  title: string | null;
  thumbnail: string | null;
  description: string | null;
  git_link: string | null;
  demo_link: string | null;
  created_at: string;
  project_tech_stacks: {
    skill_id: string;
    skills: { id: string; skill: string } | null;
  }[];
};

type Project = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  git_link: string;
  demo_link: string;
  created_at: string;
  tech_stack: string[];
  tech_stack_ids: string[];
};

type ProjectFormState = {
  title: string;
  thumbnail: string; // URL string (bisa dari DB atau hasil upload)
  description: string;
  git_link: string;
  demo_link: string;
  skillIds: string[];
};

const emptyForm: ProjectFormState = {
  title: '',
  thumbnail: '',
  description: '',
  git_link: '',
  demo_link: '',
  skillIds: [],
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  
  // State khusus untuk file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isEditing = Boolean(editingId);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [projRes, skillsRes] = await Promise.all([
        supabase
          .from('projects')
          .select(`
            id, title, thumbnail, description, git_link, demo_link, created_at,
            project_tech_stacks (skill_id, skills (id, skill))
          `)
          .order('created_at', { ascending: false })
          .returns<ProjectRow[]>(),
        supabase
          .from('skills')
          .select('id, skill')
          .order('skill', { ascending: true })
          .returns<Skill[]>(),
      ]);

      if (projRes.error) throw projRes.error;
      if (skillsRes.error) throw skillsRes.error;

      const mappedProjects: Project[] = (projRes.data || []).map((row) => {
        const validSkills = row.project_tech_stacks
          .map((pts) => pts.skills)
          .filter((s): s is Skill => s !== null);

        return {
          id: row.id,
          title: row.title ?? '',
          thumbnail: row.thumbnail ?? '',
          description: row.description ?? '',
          git_link: row.git_link ?? '',
          demo_link: row.demo_link ?? '',
          created_at: row.created_at,
          tech_stack: validSkills.map((s) => s.skill),
          tech_stack_ids: validSkills.map((s) => s.id),
        };
      });

      setProjects(mappedProjects);
      setSkills(skillsRes.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormOpen(true);
  }

  function openEditForm(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      thumbnail: project.thumbnail,
      description: project.description,
      git_link: project.git_link,
      demo_link: project.demo_link,
      skillIds: project.tech_stack_ids,
    });
    setSelectedFile(null);
    setPreviewUrl(project.thumbnail); // Set preview awal dari URL yang ada
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setPreviewUrl(null);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // --- Handler Khusus Gambar ---
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Buat preview lokal agar user bisa lihat gambar sebelum di-upload
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function toggleSkill(skillId: string) {
    setForm((prev) =>
      prev.skillIds.includes(skillId)
        ? { ...prev, skillIds: prev.skillIds.filter((id) => id !== skillId) }
        : { ...prev, skillIds: [...prev.skillIds, skillId] }
    );
  }

  // --- Proses Upload ke Storage ---
  async function uploadImage(file: File): Promise<string> {
    // Buat nama file unik: timestamp-namafile (hapus spasi)
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    
    const { error: uploadError } = await supabase.storage
      .from('project_thumbnail') // Nama bucket Anda
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error('Upload failed: ' + uploadError.message);
    }

    // Ambil Public URL
    const { data } = supabase.storage
      .from('project_thumbnail')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let finalThumbnailUrl = form.thumbnail;

      // 1. Jika ada file baru dipilih, upload dulu
      if (selectedFile) {
        finalThumbnailUrl = await uploadImage(selectedFile);
      }

      const projectPayload = {
        title: form.title || null,
        thumbnail: finalThumbnailUrl || null, // Gunakan URL hasil upload atau yang lama
        description: form.description || null,
        git_link: form.git_link || null,
        demo_link: form.demo_link || null,
      };

      let projectId = editingId;

      // 2. Simpan data project ke database
      if (isEditing && projectId) {
        const { error } = await supabase
          .from('projects')
          .update(projectPayload)
          .eq('id', projectId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert(projectPayload)
          .select('id')
          .single();

        if (error) throw error;
        projectId = data.id;
      }

      if (!projectId) throw new Error('Missing project id after save.');

      // 3. Update Tech Stack
      const { error: deleteError } = await supabase
        .from('project_tech_stacks')
        .delete()
        .eq('project_id', projectId);
      if (deleteError) throw deleteError;

      if (form.skillIds.length > 0) {
        const rows = form.skillIds.map((skillId) => ({
          project_id: projectId,
          skill_id: skillId,
        }));
        const { error: insertError } = await supabase
          .from('project_tech_stacks')
          .insert(rows);
        if (insertError) throw insertError;
      }

      window.alert(isEditing ? 'Project updated.' : 'Project created.');
      closeForm();
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Failed to save project.');
      window.alert('Error: ' + (err.message ?? 'Unknown error'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this project?')) return;
    // Optional: Hapus file gambar dari storage juga jika mau (butuh logic parsing URL)
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      window.alert('Error deleting project: ' + error.message);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage portfolio projects and their tech stacks.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center px-3 py-2 rounded-xl bg-emerald-500 text-sm font-medium text-emerald-50 hover:bg-emerald-400 transition-colors shadow-sm shadow-emerald-500/30"
        >
          + Add Project
        </button>
      </header>

      {error && (
        <div className="text-sm text-red-400 border border-red-500/40 bg-red-950/40 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : projects.length === 0 ? (
        <div className="border border-dashed border-slate-700 rounded-xl p-6 text-sm text-slate-400">
          No projects yet. Click &ldquo;Add Project&rdquo; to create one.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.id} className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden flex flex-col hover:border-slate-700 transition-colors">
              {project.thumbnail && (
                <div className="relative w-full h-40 md:h-44 border-b border-slate-800/80 bg-slate-900">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">{project.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditForm(project)} className="text-[11px] px-2 py-1 rounded-lg border border-slate-700 hover:bg-slate-900">Edit</button>
                    <button onClick={() => handleDelete(project.id)} className="text-[11px] px-2 py-1 rounded-lg border border-red-700 text-red-300 hover:bg-red-900/40">Delete</button>
                  </div>
                </div>
                {/* ... Tech stack render logic ... */}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-0">
          <div className="w-full md:max-w-2xl bg-slate-950 border border-slate-800 rounded-t-2xl md:rounded-2xl p-5 md:p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-slate-950 z-10 py-2 border-b border-slate-800/50">
              <h3 className="text-sm font-semibold">{isEditing ? 'Edit Project' : 'Add Project'}</h3>
              <button onClick={closeForm} className="text-xs text-slate-400 hover:text-slate-200">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* Row 1: Title & Image Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                
                {/* INPUT GAMBAR DI SINI */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Thumbnail Image</label>
                  <div className="flex gap-2 items-center">
                     {/* Preview Mini */}
                    {previewUrl && (
                      <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden border border-slate-700">
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-slate-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-xs file:font-semibold
                        file:bg-emerald-500/10 file:text-emerald-400
                        hover:file:bg-emerald-500/20
                        cursor-pointer"
                    />
                  </div>
                  {/* Fallback manual URL input (optional, hidden by default or kept for flexibility) */}
                  <input
                    name="thumbnail"
                    value={form.thumbnail}
                    onChange={handleChange}
                    placeholder="Or paste image URL..."
                    className="mt-2 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs focus:outline-none text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">GitHub URL</label>
                  <input name="git_link" value={form.git_link} onChange={handleChange} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Live Demo URL</label>
                  <input name="demo_link" value={form.demo_link} onChange={handleChange} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>

              {/* Tech Stack Section */}
              <div>
                <label className="block text-xs text-slate-400 mb-2">Tech Stack</label>
                <div className="border border-slate-800 rounded-xl bg-slate-900/60 max-h-44 overflow-y-auto p-2 flex flex-wrap gap-1.5">
                  {skills.map((skill) => {
                    const selected = form.skillIds.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] border transition-all ${
                          selected ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200' : 'border-slate-700 bg-slate-800/50 text-slate-400'
                        }`}
                      >
                        {skill.skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800/50 mt-2">
                <button type="button" onClick={closeForm} className="px-3 py-2 rounded-lg text-xs border border-slate-700 hover:bg-slate-900 text-slate-300">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-60 shadow-lg">
                  {saving ? (selectedFile ? 'Uploading & Saving...' : 'Saving...') : isEditing ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return <div className="border border-slate-800 rounded-2xl bg-slate-900/40 p-4 animate-pulse space-y-3 h-64"></div>;
}