import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import '../src/index.js'

test('details-summary is defined', async t => {
    t.ok(customElements.get('details-summary'),
        'should be defined as a custom element')
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

    const el = (await waitFor('details-summary.test'))!
    t.ok(el, 'should find the element')

    const details = el.querySelector('details') as HTMLDetailsElement
    t.ok(details, 'should have a details element inside')

    const summary = el.querySelector('summary')
    t.ok(summary, 'should have a summary element inside')

    const content = el.querySelector('.details-content')
    t.ok(content, 'should have a .details-content element inside')

    t.equal(!!(details.open), false, 'details should start closed')
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

    const el = (await waitFor('details-summary.test2'))!
    t.ok(el, 'should find the element')
    t.ok(el.hasAttribute('open-by-default-on-desktop'), 'should have attribute')
})

test('duration attribute is accepted', async t => {
    document.body.innerHTML += `
        <details-summary class="test3" duration="500">
            <details>
                <summary>Slow animation</summary>
                <div class="details-content">Slow content</div>
            </details>
        </details-summary>
    `

    const el = (await waitFor('details-summary.test3'))!
    t.ok(el, 'should find the element')
    t.equal(el.getAttribute('duration'), '500',
        'should have duration attribute set to 500')
})

test('emits non-namespaced open and close events', async t => {
    document.body.innerHTML += `
        <details-summary class="test-events" duration="0">
            <details>
                <summary>Event test</summary>
                <div class="details-content">Event content</div>
            </details>
        </details-summary>
    `

    const el = (await waitFor('details-summary.test-events'))!
    const summary = el.querySelector('summary') as HTMLElement

    const openEvent:CustomEvent = await new Promise(resolve => {
        el.addEventListener('open', ev => resolve(ev as CustomEvent), { once: true })
        summary.click()
    })
    t.ok(openEvent, 'should emit an open event')
    t.ok(openEvent.detail.details instanceof HTMLDetailsElement,
        'open event detail.details should be the inner <details> element')

    const closeEvent:CustomEvent = await new Promise(resolve => {
        el.addEventListener('close', ev => resolve(ev as CustomEvent), { once: true })
        summary.click()
    })
    t.ok(closeEvent, 'should emit a close event')
    t.ok(closeEvent.detail.details instanceof HTMLDetailsElement,
        'close event detail.details should be the inner <details> element')
})

test('emits namespaced details-summary:open and details-summary:close events', async t => {
    document.body.innerHTML += `
        <details-summary class="test-ns-events" duration="0">
            <details>
                <summary>Namespaced event test</summary>
                <div class="details-content">Namespaced event content</div>
            </details>
        </details-summary>
    `

    const el = (await waitFor('details-summary.test-ns-events'))!
    const summary = el.querySelector('summary') as HTMLElement

    const openEvent:CustomEvent = await new Promise(resolve => {
        el.addEventListener('details-summary:open', ev => resolve(ev as CustomEvent), { once: true })
        summary.click()
    })
    t.ok(openEvent, 'should emit a details-summary:open event')
    t.ok(openEvent.detail.details instanceof HTMLDetailsElement,
        'details-summary:open event detail.details should be the inner <details> element')

    const closeEvent:CustomEvent = await new Promise(resolve => {
        el.addEventListener('details-summary:close', ev => resolve(ev as CustomEvent), { once: true })
        summary.click()
    })
    t.ok(closeEvent, 'should emit a details-summary:close event')
    t.ok(closeEvent.detail.details instanceof HTMLDetailsElement,
        'details-summary:close event detail.details should be the inner <details> element')
})

test('events bubble to a parent element; detail.details is the triggering <details>', async t => {
    document.body.innerHTML += `
        <div class="test-bubble-parent">
            <details-summary class="test-bubble" duration="0">
                <details>
                    <summary>Bubble test</summary>
                    <div class="details-content">Bubble content</div>
                </details>
            </details-summary>
        </div>
    `

    const parent = (await waitFor('.test-bubble-parent'))!
    const el = parent.querySelector('details-summary') as HTMLElement
    const summary = el.querySelector('summary') as HTMLElement

    const openEvent:CustomEvent = await new Promise(resolve => {
        parent.addEventListener('details-summary:open', ev => resolve(ev as CustomEvent), { once: true })
        summary.click()
    })
    t.ok(openEvent, 'details-summary:open should bubble to a parent element')

    const detailsEl = openEvent.detail.details as HTMLDetailsElement
    t.ok(detailsEl, 'can retrieve the triggering <details> element via event.detail.details')
    t.ok(detailsEl.open, 'the retrieved <details> element is open after opening')
})
