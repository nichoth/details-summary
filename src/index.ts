import { WebComponent } from '@substrate-system/web-component'
import Debug from '@substrate-system/debug'
import '@substrate-system/a11y/visually-hidden'
const debug = Debug('details-summary')

// for document.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'details-summary':DetailsSummary
    }
}

export class DetailsSummary extends WebComponent.create('details-summary') {
    static reflectedBooleanAttributes = ['default-open']
    static reflectedStringAttributes = ['duration']

    private _details:HTMLDetailsElement|null = null
    private _summary:HTMLElement|null = null
    private _content:HTMLElement|null = null
    private _toggleLabel:HTMLElement|null = null
    private _animation:Animation|null = null
    private _isClosing:boolean = false
    private _isExpanding:boolean = false

    render () {
        debug('connected')

        this._details = this.querySelector('details')
        this._summary = this.querySelector('summary')
        this._content = this.querySelector('.details-content')

        if (this.hasAttribute('default-open') && window.innerWidth > 990) {
            if (this._details) this._details.open = true
        }

        if (this._summary) {
            const icon = document.createElement('span')
            icon.setAttribute('aria-hidden', 'true')
            icon.className = 'details-summary-icon'

            const label = document.createElement('span')
            label.className = 'visually-hidden'
            label.textContent = this._details?.open ? 'collapse' : 'expand'
            this._toggleLabel = label

            this._summary.appendChild(icon)
            this._summary.appendChild(label)

            this._summary.addEventListener('click', (e) => this.onClick(e))
        }
    }

    disconnectedCallback () {
        debug('disconnected')
    }

    /**
     * Runs when the value of an attribute is changed
     *
     * @param  {string} name     The attribute name
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attribute value
     */
    async attributeChangedCallback (name:string, oldValue:string, newValue:string) {
        debug('an attribute changed', name, oldValue, newValue)
        await super.attributeChangedCallback(name, oldValue, newValue)
    }

    onClick (ev:MouseEvent) {
        ev.preventDefault()
        if (!this._details) return

        if (this._isClosing || !this._details.open) {
            if (this._toggleLabel) this._toggleLabel.textContent = 'collapse'
            this._open()
        } else if (this._isExpanding || this._details.open) {
            if (this._toggleLabel) this._toggleLabel.textContent = 'expand'
            this._shrink()
        }
    }

    private _animationDuration ():number {
        const attr = this.getAttribute('duration')
        if (attr !== null) {
            const parsed = Number(attr)
            if (!isNaN(parsed) && parsed >= 0) return parsed
        }
        return 300
    }

    private _shrink () {
        if (!this._details || !this._summary) return
        this._isClosing = true
        this._details.classList.add('is-closing')
        const startHeight = `${this._details.offsetHeight}px`
        const endHeight = `${this._summary.offsetHeight}px`

        if (this._animation) this._animation.cancel()

        this._animation = this._details.animate(
            { height: [startHeight, endHeight] },
            { duration: this._animationDuration(), easing: 'ease-out' }
        )

        this._animation.onfinish = () => this._onAnimationFinish(false)
        this._animation.oncancel = () => { this._isClosing = false }
    }

    private _open () {
        if (!this._details) return
        this._details.style.height = `${this._details.offsetHeight}px`
        this._details.open = true
        window.requestAnimationFrame(() => this._expand())
    }

    private _expand () {
        if (!this._details || !this._summary || !this._content) return
        this._isExpanding = true
        const startHeight = `${this._details.offsetHeight}px`
        const endHeight = `${this._summary.offsetHeight + this._content.offsetHeight}px`

        if (this._animation) this._animation.cancel()

        this._animation = this._details.animate(
            { height: [startHeight, endHeight] },
            { duration: this._animationDuration(), easing: 'ease-out' }
        )

        this._animation.onfinish = () => this._onAnimationFinish(true)
        this._animation.oncancel = () => { this._isExpanding = false }
    }

    private _onAnimationFinish (open:boolean) {
        if (!this._details) return
        this._details.open = open
        this._details.classList.remove('is-closing')
        this._animation = null
        this._isClosing = false
        this._isExpanding = false
        this._details.style.height = ''
        this._emit(open ? 'open' : 'close')
    }

    private _emit (type:'open'|'close') {
        const detail = { details: this._details }
        this.dispatchEvent(new CustomEvent(type, {
            bubbles: true,
            composed: true,
            detail
        }))
        this.dispatchEvent(new CustomEvent(`details-summary:${type}`, {
            bubbles: true,
            composed: true,
            detail
        }))
    }
}

DetailsSummary.define()
