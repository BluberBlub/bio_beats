import { useState, useRef, useEffect } from 'react';
import {
    MoreHorizontal,
    Search,
    Plus,
    Trash2,
    Edit2,
    CheckCircle,
    XCircle,
    Shield,
    Upload,
    User,
    ShieldCheck,
    ShieldX
} from 'lucide-react';
import type { UserProfile, UserRole } from '../../../lib/supabase';

// Initial state is empty, fetched from DB
const initialUsers: UserProfile[] = [];

import { supabase } from '../../../lib/supabase';

export default function UserTable() {
    const [users, setUsers] = useState<UserProfile[]>(initialUsers);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setUsers(data as UserProfile[]);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Fallback to empty if table doesn't exist yet
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Filtered Users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.full_name?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'verified' && user.is_verified) ||
            (statusFilter === 'pending' && !user.is_verified);
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Toggle verification status
    const handleToggleVerification = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_verified: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            // Optimistic update
            setUsers(users.map(u =>
                u.id === id ? { ...u, is_verified: !u.is_verified } : u
            ));
        } catch (error) {
            console.error('Error updating verification:', error);
            alert('Failed to update verification status');
        }
    };

    // CRUD Operations
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Note: Creating a user here only creates a profile record.
        // For full auth, we'd need to use supabase.auth.signUp() or Admin API
        const newUser: Partial<UserProfile> = {
            email: formData.get('email') as string,
            full_name: formData.get('full_name') as string,
            role: formData.get('role') as UserRole,
            is_verified: true,
            created_at: new Date().toISOString(),
            avatar_url: avatarPreview || ''
        };

        try {
            const { data, error } = await supabase
                .from('profiles')
                .insert([newUser])
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setUsers([data as UserProfile, ...users]);
                setIsCreateModalOpen(false);
                setAvatarPreview(null);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user. Ensure you have permissions.');
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingUser) return;

        const formData = new FormData(e.currentTarget);
        const updates = {
            email: formData.get('email') as string,
            full_name: formData.get('full_name') as string,
            role: formData.get('role') as UserRole,
            avatar_url: avatarPreview || editingUser.avatar_url || ''
        };

        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', editingUser.id);

            if (error) throw error;

            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...updates } : u));
            setEditingUser(null);
            setAvatarPreview(null);
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
        setAvatarPreview(null);
    };

    const openEditModal = (user: UserProfile) => {
        setEditingUser(user);
        setAvatarPreview(user.avatar_url || null);
    };

    const closeModal = () => {
        setIsCreateModalOpen(false);
        setEditingUser(null);
        setAvatarPreview(null);
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bio-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-white focus:border-bio-accent outline-none"
                        />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="btn-primary flex items-center gap-2 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Create User
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-white text-sm focus:border-bio-accent outline-none"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="artist">Artist</option>
                        <option value="performer">Performer</option>
                        <option value="creative">Creative</option>
                        <option value="manager">Manager</option>
                        <option value="label">Label</option>
                        <option value="booker">Booker</option>
                        <option value="provider">Provider</option>
                        <option value="guest">Guest</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-bio-gray-900 border border-bio-gray-800 rounded-lg text-white text-sm focus:border-bio-accent outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                    </select>
                    {(roleFilter !== 'all' || statusFilter !== 'all') && (
                        <button
                            onClick={() => { setRoleFilter('all'); setStatusFilter('all'); }}
                            className="px-3 py-2 text-sm text-bio-gray-400 hover:text-white transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                    <span className="ml-auto text-sm text-bio-gray-500">
                        {filteredUsers.length} of {users.length} users
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="border border-bio-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-bio-gray-900 border-b border-bio-gray-800 text-bio-gray-400">
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-bio-gray-800 bg-bio-black">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-bio-gray-900/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-bio-gray-800 overflow-hidden flex items-center justify-center">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-bio-gray-500" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{user.full_name}</div>
                                            <div className="text-bio-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bio-gray-800 text-bio-gray-300 border border-bio-gray-700 capitalize">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.is_verified ? (
                                        <button
                                            onClick={() => handleToggleVerification(user.id, user.is_verified)}
                                            className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                                            title="Click to revoke verification"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Verified</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleToggleVerification(user.id, user.is_verified)}
                                            className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
                                            title="Click to verify user"
                                        >
                                            <Shield className="w-4 h-4" />
                                            <span>Pending</span>
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-bio-gray-400">
                                    {user.created_at}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {user.is_verified ? (
                                            <button
                                                onClick={() => handleToggleVerification(user.id, user.is_verified)}
                                                className="p-2 text-green-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Revoke Verification"
                                            >
                                                <ShieldX className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleVerification(user.id, user.is_verified)}
                                                className="p-2 text-yellow-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                                title="Verify User"
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="p-2 text-bio-gray-400 hover:text-white hover:bg-bio-gray-800 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-bio-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && (
                    <div className="p-8 text-center text-bio-gray-400">
                        Loading users...
                    </div>
                )}
                {!loading && filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-bio-gray-400">
                        No users found.
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {(isCreateModalOpen || editingUser) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-bio-gray-900 border border-bio-gray-800 rounded-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {editingUser ? 'Edit User' : 'Create New User'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-bio-gray-400 hover:text-white"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={editingUser ? handleUpdate : handleCreate} className="space-y-4">
                            {/* Avatar Upload */}
                            <div>
                                <label className="block text-sm font-medium text-bio-gray-300 mb-2">Profile Picture</label>
                                <div className="flex gap-4 items-center">
                                    <div
                                        className="w-16 h-16 bg-bio-gray-800 rounded-full overflow-hidden flex items-center justify-center border border-bio-gray-700 cursor-pointer hover:border-bio-accent transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : editingUser?.avatar_url ? (
                                            <img src={editingUser.avatar_url} alt="Current" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-8 h-8 text-bio-gray-600" />
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="btn-ghost text-sm flex items-center gap-2"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Upload
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-bio-gray-300 mb-1">Full Name</label>
                                <input
                                    name="full_name"
                                    defaultValue={editingUser?.full_name}
                                    required
                                    className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bio-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={editingUser?.email}
                                    required
                                    className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bio-gray-300 mb-1">Role</label>
                                <select
                                    name="role"
                                    defaultValue={editingUser?.role || 'guest'}
                                    className="w-full px-4 py-2 bg-bio-black border border-bio-gray-700 rounded-lg text-white focus:border-bio-accent outline-none"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="artist">Artist</option>
                                    <option value="performer">Performer</option>
                                    <option value="creative">Creative</option>
                                    <option value="manager">Manager</option>
                                    <option value="label">Label</option>
                                    <option value="booker">Booker</option>
                                    <option value="provider">Provider</option>
                                    <option value="guest">Guest</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t border-bio-gray-800">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn-ghost w-full"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary w-full"
                                >
                                    {editingUser ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
