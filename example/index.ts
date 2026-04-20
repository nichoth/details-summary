import '../src/index.css'
import '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
    localStorage.setItem('DEBUG', 'details-summary')
} else {
    localStorage.removeItem('DEBUG')
}
