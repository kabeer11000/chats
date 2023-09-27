export function connect(WrappedComponent, select){
    return function(props){
        const selectors = select();
        return <WrappedComponent {...selectors} {...props}/>
    }
}
