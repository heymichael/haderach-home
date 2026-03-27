import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserTable } from './user-table.tsx'
import type { UserTableColumn } from './user-table.tsx'

interface TestUser {
  email: string
  name: string
  role: string
}

const users: TestUser[] = [
  { email: 'alice@example.com', name: 'Alice', role: 'admin' },
  { email: 'bob@example.com', name: 'Bob', role: 'user' },
  { email: 'carol@example.com', name: 'Carol', role: 'admin' },
]

const columns: UserTableColumn<TestUser>[] = [
  { key: 'email', header: 'Email', render: (u) => u.email },
  { key: 'name', header: 'Name', render: (u) => u.name },
  { key: 'role', header: 'Role', render: (u) => u.role },
]

describe('UserTable', () => {
  it('renders column headers', () => {
    render(<UserTable users={users} columns={columns} />)

    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
  })

  it('renders user data in rows', () => {
    render(<UserTable users={users} columns={columns} />)

    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('shows loading state when loading and no users', () => {
    render(<UserTable users={[]} columns={columns} loading />)

    expect(screen.getByText('Loading users…')).toBeInTheDocument()
  })

  it('shows empty state when not loading and no users', () => {
    render(<UserTable users={[]} columns={columns} />)

    expect(screen.getByText('No users found')).toBeInTheDocument()
  })

  it('shows data (not loading message) when loading with existing users', () => {
    render(<UserTable users={users} columns={columns} loading />)

    expect(screen.queryByText('Loading users…')).not.toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('calls onRowClick with the user when a row is clicked', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<UserTable users={users} columns={columns} onRowClick={onRowClick} />)

    await user.click(screen.getByText('Bob'))

    expect(onRowClick).toHaveBeenCalledOnce()
    expect(onRowClick).toHaveBeenCalledWith(users[1])
  })

  it('applies filterFn to exclude users', () => {
    render(
      <UserTable
        users={users}
        columns={columns}
        filterFn={(u) => u.role === 'admin'}
      />,
    )

    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
    expect(screen.queryByText('bob@example.com')).not.toBeInTheDocument()
  })

  it('shows empty state when filterFn excludes all users', () => {
    render(
      <UserTable
        users={users}
        columns={columns}
        filterFn={() => false}
      />,
    )

    expect(screen.getByText('No users found')).toBeInTheDocument()
  })

  it('does not add cursor-pointer class when onRowClick is not provided', () => {
    render(<UserTable users={users} columns={columns} />)

    const row = screen.getByText('alice@example.com').closest('tr')
    expect(row).not.toHaveClass('cursor-pointer')
  })
})
