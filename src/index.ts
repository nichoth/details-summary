import { WebComponent } from '@substrate-system/web-component'

// for document.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'details-summary':DetailsSummary
    }
}

export class DetailsSummary extends WebComponent.create('details-summary') {
    static reflectedBooleanAttributes = ['default-open', 'disabled']
    static reflectedStringAttributes = ['duration']

    private _details:HTMLDetailsElement|null = null
    private _summary:HTMLElement|null = null
    private _content:HTMLElement|null = null
    private _animation:Animation|null = null
    private _isClosing:boolean = false
    private _isExpanding:boolean = false

    render () {
        this._details = this.querySelector('details')
        this._summary = this.querySelector('summary')
        this._content = this.querySelector('.details-content')

        if (this.hasAttribute('default-open') && window.innerWidth > 990) {
            if (this._details) this._details.open = true
        }

        this.classList.toggle('open', !!this._details?.open)

        if (this._summary) {
            //
            // The icon is the only thing we add to the summary, and it is
            // hidden from the a11y tree. A summary's accessible name is
            // computed from its contents, so anything visible to assistive
            // tech here would be appended to the author's own label.
            // Expanded/collapsed is already exposed as state by <summary>.
            //
            const icon = document.createElement('span')
            icon.setAttribute('aria-hidden', 'true')
            icon.className = 'details-summary-icon'

            this._summary.appendChild(icon)

            this._summary.addEventListener('click', (e) => this.onClick(e))
        }

        this._applyDisabledState()
    }

    /**
     * Reflect the `disabled` attribute onto the summary so the control is
     * inert: removed from the tab order and announced as disabled.
     */
    private _applyDisabledState () {
        if (!this._summary) return
        if (this.hasAttribute('disabled')) {
            this._summary.setAttribute('aria-disabled', 'true')
            this._summary.setAttribute('tabindex', '-1')
        } else {
            this._summary.removeAttribute('aria-disabled')
            this._summary.removeAttribute('tabindex')
        }
    }

    /**
     * React to `disabled` being toggled at runtime.
     */
    handleChange_disabled (_oldValue:string|null, _newValue:string|null) {
        this._applyDisabledState()
    }

    /**
     * Runs when the value of an attribute is changed
     *
     * @param  {string} name     The attribute name
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attribute value
     */
    async attributeChangedCallback (name:string, oldValue:string, newValue:string) {
        await super.attributeChangedCallback(name, oldValue, newValue)
    }

    onClick (ev:MouseEvent) {
        ev.preventDefault()
        if (this.hasAttribute('disabled')) return
        if (!this._details) return

        if (this._isClosing || !this._details.open) {
            this._open()
        } else if (this._isExpanding || this._details.open) {
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
        this.classList.toggle('open', open)
        this._details.classList.remove('is-closing')
        this._animation = null
        this._isClosing = false
        this._isExpanding = false
        this._details.style.height = ''
        this._emit(open ? 'open' : 'close')
    }

    private _emit (type:'open'|'close') {
        const detail = { details: this._details }
        this.dispatch(type, { bubbles: true, detail })
        this.emit(type, { bubbles: true, detail })
    }
}

DetailsSummary.define()
