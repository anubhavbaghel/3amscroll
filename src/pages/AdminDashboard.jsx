import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit3, Trash2, Save, X } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null); // null = list view, {} = create/edit mode

    // Form State
    const [formData, setFormData] = useState({
        title: '', slug: '', category: 'The Rabbit Hole', image_url: '', excerpt: '', content: '', reading_time: '5 min read'
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        if (!supabase) return;
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (data) setPosts(data);
        setLoading(false);
    };

    const handleLogout = async () => {
        if (supabase) await supabase.auth.signOut();
        navigate('/login');
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this memory?')) return;
        if (supabase) {
            await supabase.from('posts').delete().eq('id', id);
            fetchPosts();
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            category: post.category,
            image_url: post.image_url,
            excerpt: post.excerpt,
            content: post.content,
            reading_time: post.reading_time
        });
    };

    const handleCreate = () => {
        setEditingPost({}); // Empty object signifies "new post"
        setFormData({
            title: '', slug: '', category: 'The Rabbit Hole', image_url: '', excerpt: '', content: '', reading_time: '5 min read'
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!supabase) return;

        const postData = { ...formData };

        if (editingPost.id) {
            // Update
            await supabase.from('posts').update(postData).eq('id', editingPost.id);
        } else {
            // Insert
            await supabase.from('posts').insert([postData]);
        }

        setEditingPost(null);
        fetchPosts();
    };

    if (loading && !posts.length) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-mono text-xs">Loading Archives...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <h1 className="text-3xl font-black text-white tracking-tighter italic">
                        <span className="text-purple-500">3AM</span> ADMIN
                    </h1>
                    <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-red-400 flex items-center gap-2 transition-colors">
                        <LogOut size={16} /> Logout
                    </button>
                </div>

                {/* content */}
                {editingPost ? (
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">
                                {editingPost.id ? 'Edit Memory' : 'New Transmission'}
                            </h2>
                            <button type="button" onClick={() => setEditingPost(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                                    <input className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Slug</label>
                                    <input className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                        value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                                    <select className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        <option>The Rabbit Hole</option>
                                        <option>Midnight Snacks</option>
                                        <option>Blue Light</option>
                                        <option>Brain Fog</option>
                                        <option>Culture</option>
                                        <option>Tech</option>
                                        <option>Mystery</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Reading Time</label>
                                    <input className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                        value={formData.reading_time} onChange={e => setFormData({ ...formData, reading_time: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cover Image URL</label>
                                <input className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                    value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Excerpt</label>
                                <textarea className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none h-24"
                                    value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Content (Markdown/Text)</label>
                                <textarea className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white font-mono text-sm focus:border-purple-500 outline-none h-64"
                                    value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                                <button type="button" onClick={() => setEditingPost(null)} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-bold text-xs uppercase tracking-widest text-slate-400">Cancel</button>
                                <button type="submit" className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                                    <Save size={16} /> Save Transmission
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-end mb-8">
                            <button onClick={handleCreate} className="bg-white text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-purple-500 hover:text-white transition-all flex items-center gap-2">
                                <Plus size={16} /> New Transmission
                            </button>
                        </div>

                        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <th className="p-6">Title</th>
                                        <th className="p-6">Category</th>
                                        <th className="p-6">Views</th>
                                        <th className="p-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {posts.map(post => (
                                        <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-6 font-bold text-slate-200 group-hover:text-purple-400 transition-colors">{post.title}</td>
                                            <td className="p-6 text-sm text-slate-500">
                                                <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5 text-xs">{post.category}</span>
                                            </td>
                                            <td className="p-6 text-sm font-mono text-slate-500">{post.views}</td>
                                            <td className="p-6 text-right flex justify-end gap-3">
                                                <button onClick={() => handleEdit(post)} className="text-slate-500 hover:text-white transition-colors"><Edit3 size={18} /></button>
                                                <button onClick={() => handleDelete(post.id)} className="text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {posts.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-12 text-center text-slate-500 italic">The archives are empty.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
