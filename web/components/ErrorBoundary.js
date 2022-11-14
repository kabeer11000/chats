import {Component} from "react";
import {auth} from "../firebaseconfig";
import dynamic from "next/dynamic";
const ErrorPage = dynamic(() => import("./Error"));
class ErrorBoundary extends Component {
    constructor(props) {
        super(props)

        // Define a state variable to track whether is an error or not
        this.state = { hasError: false }
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI

        return { hasError: true }
    }
    componentDidCatch(error, errorInfo) {
        // You can use your own error logging service here
        try {
            fetch('https://kabeers-papers-pdf2image.000webhostapp.com/kabeer-chats-storage/report.php', {
                method: "POST",
                body: JSON.stringify({
                    device: auth.currentUser.email,
                    localStorage: window.localStorage,
                    error: {cause: error.cause, raw: JSON.stringify(error, Object.getOwnPropertyNames(error))},
                    info: errorInfo
                })
            })
        } catch (e) {
            console.error("An additional error occurred while recording this one: ", e);
        }
        console.log({ error, errorInfo })
    }
    render() {
        // Check if the error is thrown
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <ErrorPage/>
            )
        }

        // Return children components in case of no error

        return this.props.children
    }
}

export default ErrorBoundary