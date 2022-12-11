import dynamic from 'next/dynamic'
import React from 'react'
const NonSSR = props => (
    <React.Fragment>{props.children}</React.Fragment>
)
export default dynamic(() => Promise.resolve(NonSSR), {
    ssr: false
})