import React, { useEffect, useState } from 'react'
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    Users,
    RefreshCw
} from 'lucide-react'

import {
    apiService,
    UserResponse,
    BackendRole,
    CreateUserRequest,
    UpdateUserRequest
} from '../services/api'

interface UsersManagementPageProps {
    onNotify: (message: string) => void
}

const roles: BackendRole[] = [
    'ADMIN',
    'OPERATIONS_MANAGER',
    'EVENT_COORDINATOR',
    'FINANCE_OFFICER',
    'VENDOR',
    'CUSTOMER'
]

export default function UsersManagementPage({
                                                onNotify
                                            }: UsersManagementPageProps) {

    const [users, setUsers] = useState<UserResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    // Add / Edit dialog
    const [showDialog, setShowDialog] = useState(false)
    const [editingUser, setEditingUser] =
        useState<UserResponse | null>(null)
    const [saving, setSaving] = useState(false)

    // Change password dialog
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [passwordUser, setPasswordUser] =
        useState<UserResponse | null>(null)
    const [newPassword, setNewPassword] = useState('')
    const [changingPassword, setChangingPassword] = useState(false)

    // User form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNum: '',
        role: 'CUSTOMER' as BackendRole
    })

    // --------------------------------------------------
    // Load users
    // --------------------------------------------------

    const loadUsers = async () => {
        try {
            setLoading(true)

            const data = await apiService.getUsers()

            setUsers(data)

        } catch (error: any) {

            console.error('Failed to load users:', error)

            onNotify(
                error.message || 'Failed to load users'
            )

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    // --------------------------------------------------
    // Open Add User dialog
    // --------------------------------------------------

    const handleAddUser = () => {

        // Make sure password dialog is closed
        setShowPasswordDialog(false)
        setPasswordUser(null)
        setNewPassword('')

        setEditingUser(null)

        setFormData({
            name: '',
            email: '',
            password: '',
            phoneNum: '',
            role: 'CUSTOMER'
        })

        setShowDialog(true)
    }

    // --------------------------------------------------
    // Open Edit User dialog
    // --------------------------------------------------

    const handleEditUser = (user: UserResponse) => {

        // Make sure password dialog is closed
        setShowPasswordDialog(false)
        setPasswordUser(null)
        setNewPassword('')

        setEditingUser(user)

        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            phoneNum: user.phoneNum || '',
            role: user.role
        })

        setShowDialog(true)
    }

    // --------------------------------------------------
    // Close Add / Edit dialog
    // --------------------------------------------------

    const closeUserDialog = () => {

        setShowDialog(false)
        setEditingUser(null)

        setFormData({
            name: '',
            email: '',
            password: '',
            phoneNum: '',
            role: 'CUSTOMER'
        })
    }

    // --------------------------------------------------
    // Save user
    // --------------------------------------------------

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault()

        if (!formData.name.trim()) {
            onNotify('Name is required')
            return
        }

        if (!formData.email.trim()) {
            onNotify('Email is required')
            return
        }

        if (
            !editingUser &&
            formData.password.length < 6
        ) {
            onNotify(
                'Password must be at least 6 characters'
            )
            return
        }

        try {

            setSaving(true)

            if (editingUser) {

                const request: UpdateUserRequest = {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phoneNum:
                        formData.phoneNum.trim() ||
                        undefined,
                    role: formData.role
                }

                const updatedUser =
                    await apiService.updateUser(
                        editingUser.userId,
                        request
                    )

                setUsers(prev =>
                    prev.map(user =>
                        user.userId ===
                        updatedUser.userId
                            ? updatedUser
                            : user
                    )
                )

                onNotify(
                    'User updated successfully'
                )

            } else {

                const request: CreateUserRequest = {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    phoneNum:
                        formData.phoneNum.trim() ||
                        undefined,
                    role: formData.role
                }

                const newUser =
                    await apiService.createUser(request)

                setUsers(prev => [
                    ...prev,
                    newUser
                ])

                onNotify(
                    'User created successfully'
                )
            }

            closeUserDialog()

        } catch (error: any) {

            console.error(
                'Failed to save user:',
                error
            )

            onNotify(
                error.message ||
                'Failed to save user'
            )

        } finally {

            setSaving(false)
        }
    }

    // --------------------------------------------------
    // Open Change Password dialog
    // --------------------------------------------------

    const handleOpenPasswordDialog = (
        user: UserResponse
    ) => {

        // Close Add / Edit dialog if it is open
        setShowDialog(false)
        setEditingUser(null)

        // Select user
        setPasswordUser(user)

        // Clear old password
        setNewPassword('')

        // Open password dialog
        setShowPasswordDialog(true)
    }

    // --------------------------------------------------
    // Close Change Password dialog
    // --------------------------------------------------

    const closePasswordDialog = () => {

        setShowPasswordDialog(false)
        setPasswordUser(null)
        setNewPassword('')
    }

    // --------------------------------------------------
    // Change password
    // --------------------------------------------------

    const handleChangePassword = async () => {

        if (!passwordUser) {
            return
        }

        if (newPassword.length < 6) {

            onNotify(
                'Password must be at least 6 characters'
            )

            return
        }

        try {

            setChangingPassword(true)

            await apiService.changeUserPassword(
                passwordUser.userId,
                {
                    newPassword: newPassword
                }
            )

            onNotify(
                'Password changed successfully'
            )

            closePasswordDialog()

        } catch (error: any) {

            console.error(
                'Failed to change password:',
                error
            )

            onNotify(
                error.message ||
                'Failed to change password'
            )

        } finally {

            setChangingPassword(false)
        }
    }

    // --------------------------------------------------
    // Delete user
    // --------------------------------------------------

    const handleDeleteUser = async (
        user: UserResponse
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${user.name}?`
            )

        if (!confirmed) {
            return
        }

        try {

            await apiService.deleteUser(
                user.userId
            )

            setUsers(prev =>
                prev.filter(
                    item =>
                        item.userId !==
                        user.userId
                )
            )

            onNotify(
                'User deleted successfully'
            )

        } catch (error: any) {

            console.error(
                'Failed to delete user:',
                error
            )

            onNotify(
                error.message ||
                'Failed to delete user'
            )
        }
    }

    // --------------------------------------------------
    // Search
    // --------------------------------------------------

    const filteredUsers =
        users.filter(user => {

            const value =
                search.toLowerCase()

            return (
                user.name
                    .toLowerCase()
                    .includes(value) ||

                user.email
                    .toLowerCase()
                    .includes(value) ||

                user.role
                    .toLowerCase()
                    .includes(value)
            )
        })

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div className="min-h-screen bg-[#f7f8fc] p-5 md:p-8">

            {/* Header */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <p className="text-xs font-semibold uppercase tracking-widest text-[#6d55ed]">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#18213a]">
                        User Management
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Create, view, update and delete system users.
                    </p>

                </div>

                <div className="flex gap-2">

                    <button
                        type="button"
                        onClick={loadUsers}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={handleAddUser}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#6048d7] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#513bc5]"
                    >
                        <Plus size={17} />
                        Add User
                    </button>

                </div>

            </div>

            {/* Search */}

            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">

                <div className="relative max-w-md">

                    <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search by name, email or role..."
                        value={search}
                        onChange={e =>
                            setSearch(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-400"
                    />

                </div>

            </div>

            {/* User count */}

            <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">

                <Users size={16} />

                <span>
                    {filteredUsers.length} user
                    {filteredUsers.length !== 1
                        ? 's'
                        : ''}
                </span>

            </div>

            {/* User Table */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

                {loading ? (

                    <div className="p-10 text-center text-sm text-slate-500">
                        Loading users...
                    </div>

                ) : filteredUsers.length === 0 ? (

                    <div className="p-10 text-center text-sm text-slate-500">
                        No users found.
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[800px]">

                            <thead>

                            <tr className="border-b border-slate-200 bg-slate-50">

                                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    ID
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    User
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Email
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Phone
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Role
                                </th>

                                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Actions
                                </th>

                            </tr>

                            </thead>

                            <tbody>

                            {filteredUsers.map(user => (

                                <tr
                                    key={user.userId}
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                >

                                    <td className="px-5 py-4 text-sm font-medium text-slate-500">
                                        #{user.userId}
                                    </td>

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">

                                                {user.name
                                                    .trim()
                                                    .split(/\s+/)
                                                    .slice(0, 2)
                                                    .map(part =>
                                                        part
                                                            .charAt(0)
                                                            .toUpperCase()
                                                    )
                                                    .join('')}

                                            </div>

                                            <span className="text-sm font-semibold text-slate-800">
                                                {user.name}
                                            </span>

                                        </div>

                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {user.email}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {user.phoneNum || '—'}
                                    </td>

                                    <td className="px-5 py-4">

                                        <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">
                                            {user.role}
                                        </span>

                                    </td>

                                    {/* Actions */}

                                    <td className="px-5 py-4">

                                        <div className="flex justify-end gap-2">

                                            {/* Edit */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEditUser(user)
                                                }
                                                title="Edit user"
                                                className="rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            {/* Change Password */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenPasswordDialog(
                                                        user
                                                    )
                                                }
                                                title="Change password"
                                                className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                                            >
                                                🔑
                                            </button>

                                            {/* Delete */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteUser(user)
                                                }
                                                title="Delete user"
                                                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* ==================================================
                ADD / EDIT USER DIALOG
            ================================================== */}

            {showDialog && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                        {/* Dialog Header */}

                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

                            <div>

                                <h2 className="text-lg font-semibold text-slate-800">

                                    {editingUser
                                        ? 'Edit User'
                                        : 'Add User'}

                                </h2>

                                <p className="mt-1 text-xs text-slate-500">

                                    {editingUser
                                        ? 'Update the user information.'
                                        : 'Create a new system user.'}

                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={closeUserDialog}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 p-6"
                        >

                            {/* Name */}

                            <div>

                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                    Full Name
                                </label>

                                <input
                                    value={formData.name}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                                    placeholder="Enter full name"
                                />

                            </div>

                            {/* Email */}

                            <div>

                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                                    placeholder="Enter email"
                                />

                            </div>

                            {/* Password - only for new users */}

                            {!editingUser && (

                                <div>

                                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                password: e.target.value
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                                        placeholder="Minimum 6 characters"
                                    />

                                </div>

                            )}

                            {/* Phone */}

                            <div>

                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                    Phone Number
                                </label>

                                <input
                                    value={formData.phoneNum}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            phoneNum: e.target.value
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                                    placeholder="10 digit phone number"
                                />

                            </div>

                            {/* Role */}

                            <div>

                                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                    Role
                                </label>

                                <select
                                    value={formData.role}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            role:
                                                e.target.value as BackendRole
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                                >

                                    {roles.map(role => (

                                        <option
                                            key={role}
                                            value={role}
                                        >
                                            {role}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* Buttons */}

                            <div className="flex justify-end gap-2 pt-3">

                                <button
                                    type="button"
                                    onClick={closeUserDialog}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-[#6048d7] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#513bc5] disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {saving
                                        ? 'Saving...'
                                        : editingUser
                                            ? 'Update User'
                                            : 'Create User'}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* ==================================================
                CHANGE PASSWORD DIALOG
            ================================================== */}

            {showPasswordDialog && passwordUser && (

                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        {/* Header */}

                        <div className="mb-5 flex items-start justify-between">

                            <div>

                                <h2 className="text-lg font-semibold text-slate-800">
                                    Change Password
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Change password for{' '}
                                    {passwordUser.name}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={closePasswordDialog}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        {/* New Password */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={e =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter new password"
                                autoFocus
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                            />

                            <p className="mt-2 text-xs text-slate-500">
                                Password must be at least 6 characters.
                            </p>

                        </div>

                        {/* Buttons */}

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={closePasswordDialog}
                                disabled={changingPassword}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleChangePassword}
                                disabled={
                                    changingPassword ||
                                    newPassword.length < 6
                                }
                                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                {changingPassword
                                    ? 'Changing...'
                                    : 'Change Password'}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}