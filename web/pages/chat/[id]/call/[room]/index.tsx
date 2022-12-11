import dynamic from "next/dynamic";

const Call = dynamic(() => import('@/components/Call'), {
    ssr: false
});
export default function CallScreen() {
    return (<Call/>)
}