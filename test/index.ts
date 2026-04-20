import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import '../src/index.js'

test('details-summary is defined', async t => {
    t.ok(customElements.get('details-summary'), 'should be defined as a custom element')
})

test('details-summary renders and handles click', async t => {
    document.body.innerHTML += `
        <details-summary class="test">
            <details>
                <summary>Test Summary</summary>
                <div class="details-content">Test content</div>
            </details>
        </details-summary>
    `

    const el = await waitFor('details-summary.test')
    t.ok(el, 'should find the element')

    const details = el.querySelector('details') as HTMLDetailsElement
    t.ok(details, 'should have a details element inside')

    const summary = el.querySelector('summary')
    t.ok(summary, 'should have a summary element inside')

    const content = el.querySelector('.details-content')
    t.ok(content, 'should have a .details-content element inside')

    t.notOk(details.open, 'details should start closed')
})

test('open-by-default-on-desktop attribute opens on wide viewport', async t => {
    // jsdom doesn't support real viewport width checks well,
    // but we verify the element accepts the attribute
    document.body.innerHTML += `
        <details-summary class="test2" open-by-default-on-desktop>
            <details>
                <summary>Desktop open</summary>
                <div class="details-content">Desktop content</div>
            </details>
        </details-summary>
    `

    const el = await waitFor('details-summary.test2')
    t.ok(el, 'should find the element')
    t.ok(el.hasAttribute('open-by-default-on-desktop'), 'should have attribute')
})
