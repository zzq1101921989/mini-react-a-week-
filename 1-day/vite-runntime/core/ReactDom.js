import React from './React.js'

export default {
    createRoot: (container) => {
        return {
            render (vdom) {
                React.render(vdom, container)
            }
        }
    }
}