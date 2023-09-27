import {createContext} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "firebase-config";
import firebase from "firebase/app"

export const UserContext = createContext<[null | undefined | firebase.User, boolean]>([null, false]);
export const UserProvider = ({children}) => {
    const [user, userLoading] = useAuthState(auth);
    return (<UserContext.Provider value={[user, userLoading]} children={children}/>)
}