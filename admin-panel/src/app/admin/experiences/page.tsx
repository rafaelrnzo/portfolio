'use client';

import { useEffect, useState } from 'react';
import { bulletsArrayToText, bulletsTextToArray, Experience, formatPeriod } from './types';
import { supabase } from '../../../../lib/supabaseClient';

type FormState = {
  company: string;
  role: string;
  from: string;
  to: string;
  summary: string;
  bulletsText: string;
  company_link: string;
};

const emptyForm: FormState = {
  company: '',
  role: '',
  from: '',
  to: '',
  summary: '',
  bulletsText: '',
  company_link: '',
};

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const isEditing = Boolean(editingId);

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('from', { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      // Map bullets from JSON to string[]
      const mapped = (data ?? []).map((exp: any) => ({
        ...exp,
        bullets: exp.bullets ?? [],
      })) as Experience[];
      setExperiences(mapped);
    }
    setLoading(false);
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditForm(exp: Experience) {
    setEditingId(exp.id);
    setForm({
      company: exp.company ?? '',
      role: exp.role ?? '',
      from: exp.from ?? '',
      to: exp.to ?? '',
      summary: exp.summary ?? '',
      bulletsText: bulletsArrayToText(exp.bullets),
      company_link: exp.company_link ?? '',
    });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      company: form.company || null,
      role: form.role || null,
      from: form.from || null,
      to: form.to || null,
      summary: form.summary || null,
      bullets: bulletsTextToArray(form.bulletsText),
      company_link: form.company_link || null,
    };

    try {
      if (isEditing && editingId) {
        const { error } = await supabase
          .from('experiences')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        window.alert('Experience updated.');
      } else {
        const { error } = await supabase.from('experiences').insert(payload);
        if (error) throw error;
        window.alert('Experience created.');
      }
      closeForm();
      fetchExperiences();
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Something went wrong.');
      window.alert('Error: ' + (err.message ?? 'Unknown error'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this experience?')) return;
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) {
      console.error(error);
      window.alert('Failed to delete: ' + error.message);
      return;
    }
    setExperiences((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
            Experiences
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage your career timeline for the portfolio site.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center px-3 py-2 rounded-xl bg-emerald-500 text-sm font-medium text-emerald-50 hover:bg-emerald-400 transition-colors shadow-sm shadow-emerald-500/30"
        >
          + Add Experience
        </button>
      </header>

      {error && (
        <div className="text-sm text-red-400 border border-red-500/40 bg-red-950/40 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : experiences.length === 0 ? (
        <div className="border border-dashed border-slate-700 rounded-xl p-6 text-sm text-slate-400">
          No experiences yet. Click &ldquo;Add Experience&rdquo; to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <article
              key={exp.id}
              className="border border-slate-800 rounded-2xl bg-slate-900/50 p-4 md:p-5 flex flex-col gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm md:text-base">
                      {exp.role || 'Untitled Role'}
                    </h3>
                    {exp.company_link ? (
                      <a
                        href={exp.company_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-sky-400 hover:text-sky-300 underline underline-offset-2"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400">{exp.company}</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatPeriod(exp.from, exp.to)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditForm(exp)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-800/70 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-700 text-red-300 hover:bg-red-900/40 hover:border-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {exp.summary && (
                <p className="text-xs md:text-sm text-slate-300 line-clamp-3">
                  {exp.summary}
                </p>
              )}

              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-1">
                  {exp.bullets.slice(0, 3).map((b, i) => (
                    <li key={i} className="text-xs text-slate-300 flex gap-2">
                      <span className="mt-[6px] h-[3px] w-[3px] rounded-full bg-slate-500" />
                      <span className="flex-1">{b}</span>
                    </li>
                  ))}
                  {exp.bullets.length > 3 && (
                    <li className="text-[11px] text-slate-500">
                      + {exp.bullets.length - 3} more bullet
                      {exp.bullets.length - 3 > 1 ? 's' : ''}
                    </li>
                  )}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Form drawer/card */}
      {isFormOpen && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/60">
          <div className="w-full md:max-w-xl bg-slate-950 border border-slate-800 rounded-t-2xl md:rounded-2xl p-5 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">
                {isEditing ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <button
                onClick={closeForm}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Company
                  </label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Role
                  </label>
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    name="from"
                    value={form.from}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    To (empty = Present)
                  </label>
                  <input
                    type="date"
                    name="to"
                    value={form.to}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Summary
                </label>
                <textarea
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Bullets (one per line)
                </label>
                <textarea
                  name="bulletsText"
                  value={form.bulletsText}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Company Link (optional)
                </label>
                <input
                  name="company_link"
                  value={form.company_link}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-3 py-1.5 rounded-lg text-xs border border-slate-700 hover:border-slate-500 hover:bg-slate-900/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-emerald-50 hover:bg-emerald-400 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create'}
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
  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-900/40 p-4 animate-pulse space-y-3">
      <div className="h-4 w-40 bg-slate-800 rounded" />
      <div className="h-3 w-24 bg-slate-800 rounded" />
      <div className="h-3 w-full bg-slate-800 rounded" />
      <div className="h-3 w-3/4 bg-slate-800 rounded" />
    </div>
  );
}
