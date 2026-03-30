import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MultiSelect } from './multi-select.tsx'
import type { MultiSelectItem } from './multi-select.tsx'

const items: MultiSelectItem[] = [
  { id: '1', label: 'Alpha' },
  { id: '2', label: 'Beta' },
  { id: '3', label: 'Gamma' },
  { id: '4', label: 'Delta' },
]

describe('MultiSelect', () => {
  it('renders "None" when nothing selected', () => {
    render(
      <MultiSelect items={items} selectedIds={[]} onSelectionChange={() => {}} />,
    )
    expect(screen.getByText('None')).toBeInTheDocument()
  })

  it('shows item label when exactly one item is selected', () => {
    render(
      <MultiSelect items={items} selectedIds={['2']} onSelectionChange={() => {}} />,
    )
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('shows "Multiple" when more than one item is selected', () => {
    render(
      <MultiSelect items={items} selectedIds={['1', '3']} onSelectionChange={() => {}} />,
    )
    expect(screen.getByText('Multiple')).toBeInTheDocument()
  })

  it('shows "All" when all items are selected', () => {
    render(
      <MultiSelect items={items} selectedIds={['1', '2', '3', '4']} onSelectionChange={() => {}} />,
    )
    expect(screen.getByText('All')).toBeInTheDocument()
  })

  it('opens popover on trigger click and shows all items', async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect items={items} selectedIds={[]} onSelectionChange={() => {}} />,
    )

    await user.click(screen.getByText('None'))

    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.getByText('Delta')).toBeInTheDocument()
  })

  it('filters items by search text', async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect items={items} selectedIds={[]} onSelectionChange={() => {}} />,
    )

    await user.click(screen.getByText('None'))
    await user.type(screen.getByPlaceholderText('Search…'), 'alp')

    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
  })

  it('calls onSelectionChange with toggled id when item is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <MultiSelect items={items} selectedIds={['1']} onSelectionChange={onChange} />,
    )

    await user.click(screen.getByText('Alpha'))
    await user.click(screen.getByText('Beta'))

    expect(onChange).toHaveBeenCalledWith(['1', '2'])
  })

  it('removes id when a selected item is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <MultiSelect items={items} selectedIds={['1', '2']} onSelectionChange={onChange} />,
    )

    await user.click(screen.getByText('Multiple'))
    await user.click(screen.getByText('Alpha'))

    expect(onChange).toHaveBeenCalledWith(['2'])
  })

  it('select all adds all filtered items', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <MultiSelect items={items} selectedIds={[]} onSelectionChange={onChange} />,
    )

    await user.click(screen.getByText('None'))
    await user.click(screen.getByText('Select all'))

    expect(onChange).toHaveBeenCalledWith(['1', '2', '3', '4'])
  })

  it('select all only adds filtered items when search is active', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <MultiSelect items={items} selectedIds={['1']} onSelectionChange={onChange} />,
    )

    await user.click(screen.getByText('Alpha'))
    await user.type(screen.getByPlaceholderText('Search…'), 'eta')
    await user.click(screen.getByText('Select all'))

    expect(onChange).toHaveBeenCalledWith(['1', '2'])
  })

  it('clear all removes only filtered items', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <MultiSelect
        items={items}
        selectedIds={['1', '2', '3', '4']}
        onSelectionChange={onChange}
      />,
    )

    await user.click(screen.getByText('All'))
    await user.type(screen.getByPlaceholderText('Search…'), 'eta')
    await user.click(screen.getByText('Clear'))

    expect(onChange).toHaveBeenCalledWith(['1', '3', '4'])
  })

  it('shows "No results" when search matches nothing', async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect items={items} selectedIds={[]} onSelectionChange={() => {}} />,
    )

    await user.click(screen.getByText('None'))
    await user.type(screen.getByPlaceholderText('Search…'), 'zzz')

    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('uses custom renderItem when provided', async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect
        items={items}
        selectedIds={[]}
        onSelectionChange={() => {}}
        renderItem={(item) => `** ${item.label} **`}
      />,
    )

    await user.click(screen.getByText('None'))

    expect(screen.getByText('** Alpha **')).toBeInTheDocument()
    expect(screen.getByText('** Beta **')).toBeInTheDocument()
  })
})
