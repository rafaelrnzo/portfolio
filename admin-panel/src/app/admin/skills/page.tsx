'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

interface Skill {
  id: string;
  created_at: string;
  skill: string | null;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setSkills((data ?? []) as Skill[]);
    }
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const { error, data } = await supabase
      .from('skills')
      .insert({ skill: newSkill.trim() })
      .select()
      .single();
    if (error) {
      window.alert('Error: ' + error.message);
      return;
    }
    setSkills((prev) => [...prev, data as Skill]);
    setNewSkill('');
  }

  function startEdit(skill: Skill) {
    setEditingId(skill.id);
    setEditingValue(skill.skill ?? '');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingValue('');
  }

  async function saveEdit(id: string) {
    const value = editingValue.trim();
    if (!value) {
      window.alert('Skill name cannot be empty.');
      return;
    }
    const { error } = await supabase
      .from('skills')
      .update({ skill: value })
      .eq('id', id);
    if (error) {
      window.alert('Error: ' + error.message);
      return;
    }
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, skill: value } : s))
    );
    cancelEdit();
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this skill?')) return;
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) {
      window.alert('Error: ' + error.message);
      return;
    }
    setSkills((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
            Skills
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage the tech stack list used across experiences and projects.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row gap-2 md:items-center"
      >
        <input
          placeholder="e.g. TypeScript"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-lg bg-emerald-500 text-emerald-50 text-sm font-medium hover:bg-emerald-400"
        >
          + Add Skill
        </button>
      </form>

      {error && (
        <div className="text-sm text-red-400 border border-red-500/40 bg-red-950/40 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : skills.length === 0 ? (
        <div className="border border-dashed border-slate-700 rounded-xl p-6 text-sm text-slate-400">
          No skills yet. Add your first skill above.
        </div>
      ) : (
        <div className="border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/60 border-b border-slate-800">
              <tr className="text-left text-xs text-slate-400">
                <th className="px-4 py-2">Skill</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-slate-800/60 hover:bg-slate-900/60"
                >
                  <td className="px-4 py-2">
                    {editingId === s.id ? (
                      <input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    ) : (
                      <span>{s.skill}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {new Date(s.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      {editingId === s.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(s.id)}
                            className="text-xs px-2 py-1 rounded-lg border border-emerald-500 text-emerald-300 hover:bg-emerald-500/10"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-xs px-2 py-1 rounded-lg border border-slate-700 hover:bg-slate-900"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(s)}
                            className="text-xs px-2 py-1 rounded-lg border border-slate-700 hover:bg-slate-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="text-xs px-2 py-1 rounded-lg border border-red-700 text-red-300 hover:bg-red-900/40"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="h-10 rounded-lg bg-slate-900/40 border border-slate-800 animate-pulse" />
  );
}
