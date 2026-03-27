import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TagBadge } from './tag-badge.tsx'

describe('TagBadge', () => {
  it('renders the label text', () => {
    render(<TagBadge label="admin" />)
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(<TagBadge label="user" />)
    const el = screen.getByText('user')
    expect(el).toHaveClass('bg-accent', 'text-accent-foreground')
  })

  it('applies muted variant classes', () => {
    render(<TagBadge label="vendor" variant="muted" />)
    const el = screen.getByText('vendor')
    expect(el).toHaveClass('bg-muted', 'text-muted-foreground')
  })

  it('merges custom className', () => {
    render(<TagBadge label="test" className="mt-2" />)
    const el = screen.getByText('test')
    expect(el).toHaveClass('mt-2')
  })

  it('sets data-slot attribute', () => {
    render(<TagBadge label="slot-test" />)
    const el = screen.getByText('slot-test')
    expect(el).toHaveAttribute('data-slot', 'tag-badge')
  })
})
