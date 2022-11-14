import {db} from "firebase-config";
import {useRouter} from "next/router";
import {useEffect} from "react";
export default function Call() {
    const {id, room} = useRouter().query;
    useEffect(() => {

    }, []);
    return (
        <div>Ka</div>
    );
};
