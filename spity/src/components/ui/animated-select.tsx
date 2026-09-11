'use client'

import { Select } from '@base-ui/react/select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/class-names'

export type AnimatedSelectOption = {
  disabled?: boolean
  label: string
  value: string
}

export interface AnimatedSelectProps {
  className?: string
  id?: string
  label: string
  onValueChange: (value: string) => void
  options: AnimatedSelectOption[]
  triggerClassName?: string
  value: string
}

export default function AnimatedSelect({
  className,
  id,
  label,
  onValueChange,
  options,
  triggerClassName,
  value,
}: AnimatedSelectProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      <Select.Root
        id={id}
        items={options}
        value={value}
        onValueChange={(nextValue) => {
          if (typeof nextValue === 'string') onValueChange(nextValue)
        }}
      >
        <Select.Label className="block cursor-default text-xs font-semibold text-muted-foreground">
          {label}
        </Select.Label>
        <Select.Trigger
          className={cn(
            'spity-input flex h-12 min-w-0 select-none items-center justify-between gap-3 text-left',
            'hover:border-primary/60 data-popup-open:border-primary data-popup-open:ring-2 data-popup-open:ring-primary/20',
            triggerClassName,
          )}
        >
          <Select.Value className="min-w-0 flex-1 truncate" />
          <Select.Icon className="shrink-0 text-muted-foreground transition-transform duration-150 data-popup-open:rotate-180">
            <ChevronDown aria-hidden="true" className="size-4" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner
            alignItemWithTrigger={false}
            className="z-50 outline-none"
            sideOffset={8}
          >
            <Select.Popup
              className={cn(
                'min-w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-hidden rounded-lg border border-border',
                'bg-popover text-popover-foreground shadow-lg outline-none',
                'transition-[transform,opacity] duration-150 ease-out',
                'data-starting-style:-translate-y-1 data-starting-style:scale-[0.98] data-starting-style:opacity-0',
                'data-ending-style:-translate-y-1 data-ending-style:scale-[0.98] data-ending-style:opacity-0',
              )}
            >
              <Select.List className="max-h-[min(18rem,var(--available-height))] overflow-y-auto overscroll-contain p-1.5 outline-none">
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    className={cn(
                      'grid min-h-10 cursor-default select-none grid-cols-[minmax(0,1fr)_1rem] items-center gap-3 rounded-md px-3 py-2 text-sm outline-none',
                      'data-highlighted:bg-secondary data-selected:font-semibold data-disabled:opacity-50',
                    )}
                    disabled={option.disabled}
                    value={option.value}
                  >
                    <Select.ItemText className="truncate">{option.label}</Select.ItemText>
                    <Select.ItemIndicator className="text-primary">
                      <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}
