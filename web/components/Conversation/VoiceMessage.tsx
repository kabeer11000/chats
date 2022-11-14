// @ts-ignore
import dynamic from "next/dynamic";
import {memo} from "react";
// @ts-ignore
const MuiAudioPlayer = dynamic(() => import("mui-audio-player-plus"), {
    ssr: false // TODO
})
export const VoiceMessage = ({url, paper,noMargin, width}) => {
    return (
        <div>
            <MuiAudioPlayer showTimestamps={false} preload={"none"} display="timeline" containerWidth={width ?? "20rem"} inline={!noMargin} paperize={false} src={url}/>
        </div>
    );
};
export default memo(VoiceMessage)