import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import VxButton from '../src/components/controls/VxButton.vue'
import VxPagination from '../src/components/controls/VxPagination.vue'
import VxStepper from '../src/components/controls/VxStepper.vue'
import VxTable from '../src/components/data/VxTable.vue'
import VxPopover from '../src/components/overlays/VxPopover.vue'
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
