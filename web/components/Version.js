import {useEffect, useState} from "react";

const SwVersion = () => {
    const [s, S] = useState({raw: "Loading..."});
    useEffect(() => {
        fetch("/internal-sw-version-info").then(r => r.text()).then((d) => S({raw: d, parsed: JSON.parse(d)})).catch(() => S({raw: "Error Loading"}));
    }, []);
    return <span><strong>{s.parsed && s.parsed?.cache?.version}</strong><br/><pre style={{marginLeft: "1rem", whiteSpace: "pre-wrap"}}>{JSON.stringify(JSON.parse(s.raw), null, 10)}</pre></span>
}
export const Version = () => {
    const [s, S] = useState({raw: "Loading..."});
    useEffect(() => {
        fetch("/internal-sw-version-info").then(r => r.text()).then((d) => S({raw: d, v: JSON.parse(d).cache.version})).catch(() => S({raw: "Error Loading"}));
    }, []);
    return (s.v ? s.v : s.raw)
}