import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import '../src/index.js'

test('example test', async t => {
    document.body.innerHTML += `
        <details-summary class="test">
        </details-summary>
    `

    const el = await waitFor('details-summary')

    t.ok(el, 'should find an element')
})
