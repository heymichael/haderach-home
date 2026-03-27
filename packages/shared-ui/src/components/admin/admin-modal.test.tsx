import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminModal } from './admin-modal.tsx'

describe('AdminModal', () => {
  it('renders the title', () => {
    render(
      <AdminModal title="Edit User" onClose={() => {}}>
        <p>body</p>
      </AdminModal>,
    )
    expect(screen.getByText('Edit User')).toBeInTheDocument()
  })

  it('renders children in the body', () => {
    render(
      <AdminModal title="Test" onClose={() => {}}>
        <p>modal body content</p>
      </AdminModal>,
    )
    expect(screen.getByText('modal body content')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(
      <AdminModal title="Test" onClose={() => {}} footer={<button>Save</button>}>
        <p>body</p>
      </AdminModal>,
    )
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('does not render footer slot when not provided', () => {
    const { container } = render(
      <AdminModal title="Test" onClose={() => {}}>
        <p>body</p>
      </AdminModal>,
    )
    const borders = container.querySelectorAll('.border-t')
    expect(borders).toHaveLength(0)
  })

  it('calls onClose when X button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <AdminModal title="Test" onClose={onClose}>
        <p>body</p>
      </AdminModal>,
    )

    const closeButton = screen.getByRole('button')
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(
      <AdminModal title="Test" onClose={onClose}>
        <p>body</p>
      </AdminModal>,
    )

    const overlay = container.querySelector('.bg-black\\/40') as HTMLElement
    await user.click(overlay)

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('applies custom maxWidth', () => {
    const { container } = render(
      <AdminModal title="Test" onClose={() => {}} maxWidth="max-w-2xl">
        <p>body</p>
      </AdminModal>,
    )
    const panel = container.querySelector('[data-slot="admin-modal"] > .absolute + div')
    expect(panel).toHaveClass('max-w-2xl')
  })
})
