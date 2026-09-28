import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import VxButton from '../src/components/controls/VxButton.vue'
import VxInput from '../src/components/controls/VxInput.vue'
import VxPagination from '../src/components/controls/VxPagination.vue'
import VxStepper from '../src/components/controls/VxStepper.vue'
import VxTable from '../src/components/data/VxTable.vue'
import VxUptimeBar from '../src/components/data/VxUptimeBar.vue'
import VxPopover from '../src/components/overlays/VxPopover.vue'
import VxTooltip from '../src/components/overlays/VxTooltip.vue'
import { useToast } from '../src/composables/useToast'

describe('VxButton', () => {
  it('renders variants, sizes and square icon buttons', () => {
    const w = mount(VxButton, { props: { variant: 'danger-solid', size: 'sm', icon: true, label: 'Delete' }, slots: { default: '×' } })
    const b = w.get('button')
    expect(b.classes()).toEqual(expect.arrayContaining(['vx-btn', 'is-danger-solid', 'is-sm', 'is-icon']))
    expect(b.attributes('aria-label')).toBe('Delete')
  })

  it('is disabled and busy while loading', () => {
    const w = mount(VxButton, { props: { loading: true }, slots: { default: 'Save' } })
    expect(w.get('button').attributes('disabled')).toBeDefined()
    expect(w.get('button').attributes('aria-busy')).toBe('true')
    expect(w.find('.vx-spinner').exists()).toBe(true)
  })
})

describe('VxInput', () => {
  it('puts attributes and listeners on the <input>, class and style on the wrapper', async () => {
    let blurred = 0
    const w = mount(VxInput, { attrs: { 'aria-label': 'Title', min: '1', class: 'extra', style: 'max-width: 10px', onBlur: () => blurred++ } })
    const input = w.get('input')
    expect(input.attributes('aria-label')).toBe('Title')
    expect(input.attributes('min')).toBe('1')
    expect(input.attributes('class')).toBe('vx-input')
    expect(w.classes()).toEqual(expect.arrayContaining(['vx-input-wrap', 'extra']))
    expect(w.attributes('style')).toContain('max-width: 10px')
    expect(w.attributes('aria-label')).toBeUndefined()
    await input.trigger('blur')
    expect(blurred).toBe(1)
  })
})

describe('VxStepper', () => {
  it('steps by 0.1 and by 1 with shift', async () => {
    const w = mount(VxStepper, { props: { modelValue: 1.5, step: 0.1, 'onUpdate:modelValue': (v: number) => w.setProps({ modelValue: v }) } })
    const [minus, plus] = w.findAll('button')
    await plus!.trigger('click')
    expect(w.props('modelValue')).toBe(1.6)
    await minus!.trigger('click', { shiftKey: true })
    expect(w.props('modelValue')).toBe(0.6)
  })
})

describe('VxPagination', () => {
  it('marks the current page and moves with the arrows', async () => {
    const w = mount(VxPagination, { props: { modelValue: 3, total: 54, 'onUpdate:modelValue': (v: number) => w.setProps({ modelValue: v }) } })
    expect(w.get('[aria-current=page]').text()).toBe('3')
    await w.get('[aria-label="Next page"]').trigger('click')
    expect(w.props('modelValue')).toBe(4)
    expect(w.findAll('.vx-gap')).toHaveLength(1)
  })
})

describe('VxTable', () => {
  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'len', label: 'Length', sortable: true, align: 'right' as const },
  ]
  const rows = [
    { title: 'b', len: 10 },
    { title: 'a', len: 2 },
    { title: 'c', len: 100 },
  ]

  it('sorts locally from v-model:sort', async () => {
    const w = mount(VxTable, { props: { columns, rows, sort: null, 'onUpdate:sort': (s: unknown) => w.setProps({ sort: s as never }) } })
    const firstCol = () => w.findAll('tbody tr').map((r) => r.find('td').text())
    expect(firstCol()).toEqual(['b', 'a', 'c'])
    await w.findAll('th')[1]!.trigger('click')
    expect(firstCol()).toEqual(['a', 'b', 'c'])
    expect(w.findAll('th')[1]!.attributes('aria-sort')).toBe('ascending')
    await w.findAll('th')[1]!.trigger('click')
    expect(firstCol()).toEqual(['c', 'b', 'a'])
  })

  it('renders custom cells', () => {
    const w = mount(VxTable, { props: { columns, rows }, slots: { 'cell-len': '<b>{{ params.value }}s</b>' } })
    expect(w.find('tbody b').text()).toBe('10s')
  })
})

describe('VxPopover', () => {
  it('opens from the trigger and closes on Escape and outside clicks', async () => {
    const w = mount(VxPopover, {
      attachTo: document.body,
      slots: {
        trigger: '<template #trigger="{ toggle }"><button class="t" @click="toggle">open</button></template>',
        default: '<p class="inside">menu</p>',
      },
    })
    expect(w.find('.inside').exists()).toBe(false)
    await w.get('.t').trigger('click')
    await nextTick()
    expect(w.find('.inside').exists()).toBe(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(w.find('.inside').exists()).toBe(false)
    await w.get('.t').trigger('click')
    await nextTick()
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await nextTick()
    expect(w.find('.inside').exists()).toBe(false)
    w.unmount()
  })
})

describe('useToast', () => {
  it('keeps at most three toasts', () => {
    const t = useToast()
    for (let i = 0; i < 5; i++) t.show(`m${i}`, { duration: 60_000 })
    expect(t.toasts.value.map((x) => x.message)).toEqual(['m2', 'm3', 'm4'])
    t.toasts.value.forEach((x) => t.dismiss(x.id))
    expect(t.toasts.value).toHaveLength(0)
  })
})

describe('VxTooltip', () => {
  afterEach(() => vi.restoreAllMocks())

  // happy-dom lays nothing out, so the bubble's box is faked: `left`/`right`/`top` in a 390px-wide screen.
  async function hover(box: { left: number; right: number; top: number }) {
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(390)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ ...box, bottom: box.top + 24 } as DOMRect)
    const w = mount(VxTooltip, { props: { text: 'Hint' }, slots: { default: '<button>x</button>' } })
    await w.get('.vx-tooltip').trigger('pointerenter')
    await nextTick()
    return w.get('.vx-tooltip-bubble')
  }

  it('stays centred when it fits', async () => {
    const b = await hover({ left: 100, right: 200, top: 300 })
    expect(b.attributes('style') ?? '').not.toContain('translate')
    expect(b.classes()).not.toContain('is-below')
  })

  it('slides back on screen past the left or right edge', async () => {
    expect((await hover({ left: -40, right: 120, top: 300 })).attributes('style')).toContain('translate: 48px 0')
    expect((await hover({ left: 300, right: 420, top: 300 })).attributes('style')).toContain('translate: -38px 0')
  })

  it('goes below when there is no room above', async () => {
    expect((await hover({ left: 100, right: 200, top: -10 })).classes()).toContain('is-below')
  })
})

describe('VxUptimeBar', () => {
  const ticks = [
    { status: 'ok' as const, label: '14:30 · up' },
    { status: 'down' as const, label: '14:31 · down' },
    { status: 'ok' as const, label: '14:32 · up' },
  ]

  it('pads to a fixed number of ticks and sums up what is known', () => {
    const w = mount(VxUptimeBar, { props: { ticks, slots: 5, label: 'dtp' } })
    expect(w.findAll('.vx-uptime-tick')).toHaveLength(5)
    expect(w.findAll('.vx-uptime-tick.is-pad')).toHaveLength(2)
    expect(w.get('.vx-uptime').attributes('aria-label')).toBe('dtp: 2 of 3 up')
    expect(w.find('button').exists()).toBe(false)
  })

  it('shows the hovered tick label', async () => {
    const w = mount(VxUptimeBar, { props: { ticks } })
    await w.findAll('.vx-uptime-tick')[1]!.trigger('pointerenter')
    expect(w.get('.vx-tooltip-bubble').text()).toBe('14:31 · down')
  })

  it('selects a tick on click, again to clear, and moves with the arrow keys', async () => {
    const w = mount(VxUptimeBar, { props: { ticks, selectable: true, 'onUpdate:selected': (v: number | null) => w.setProps({ selected: v }) } })
    const buttons = () => w.findAll('button')
    // Only one tab stop: the newest tick until one is chosen.
    expect(buttons().map((b) => b.attributes('tabindex'))).toEqual(['-1', '-1', '0'])
    await buttons()[1]!.trigger('click')
    expect(w.props('selected')).toBe(1)
    expect(buttons()[1]!.attributes('aria-pressed')).toBe('true')
    await buttons()[1]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(w.props('selected')).toBe(0)
    await buttons()[0]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(w.props('selected')).toBe(0)
    await buttons()[0]!.trigger('keydown', { key: 'End' })
    expect(w.props('selected')).toBe(2)
    await buttons()[2]!.trigger('click')
    expect(w.props('selected')).toBe(null)
  })
})
