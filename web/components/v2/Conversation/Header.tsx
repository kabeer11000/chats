import {Fragment, useContext, useEffect} from "react";
import {DrawerContext} from "root-contexts";
import {useRouter} from "next/router";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "firebase-config";
import dynamic from "next/dynamic";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Link from "next/link";
import {useConversationState} from "@/zustand/v2/Conversation";
import firebase from "firebase";
import {IUser} from "../../../types/Conversation";
import Timestamp = firebase.firestore.Timestamp;


const AppBar = dynamic(() => import("@mui/material/AppBar"));
const Badge = dynamic(() => import("@mui/material/Badge"));
const Toolbar = dynamic(() => import("@mui/material/Toolbar"));
const IconButton = dynamic(() => import("@mui/material/IconButton"));
const Avatar = dynamic(() => import("@mui/material/Avatar"));
const ListItemText = dynamic(() => import("@mui/material/ListItemText"));
const Typography = dynamic(() => import("@mui/material/Typography"));
const CircularProgress = dynamic(() => import("@mui/material/CircularProgress"));
const ArrowBack = dynamic(() => import("@mui/icons-material/ArrowBack"));
const Info = dynamic(() => import("@mui/icons-material/Info"));
// const Call = dynamic(() => import("@mui/icons-material/Call"));
const Head = dynamic(() => import("next/head"));
const TimeAgo = dynamic(() => import("timeago-react"));

const MemberAvatar = ({member, small, email}) => {
    const smallProps = {
        style: {
            ...(small ? {
                width: 22,
                height: 22,
                border: `2px solid white`,
            } : {})
        }
    };
    return member ? (
        <Link href={`/profile/${member.id}`}>
            <Avatar {...smallProps} imgProps={{referrerPolicy: "no-referrer"}}
                    src={member.photoURL} label={email.slice(0, 2)}/>
        </Link>
    ) : (<Avatar {...smallProps} label={email.slice(0, 2)}/>);
}
const LastActive = () => {
    const lastSent = useConversationState(state => state.state?.lastSent)

    return <Typography variant={"subtitle2"} style={{color: "grey"}}>
        {/* @ts-ignore */}
        {lastSent ? (
            <TimeAgo
                datetime={(lastSent instanceof Timestamp ? lastSent.toDate() : new Date(lastSent.seconds * 1000))}/>
        ) : ('Unavailable')}
    </Typography>
}
const isNullOrUndefined = (variable1: any, variable2: any): boolean => variable1 == null || variable2 == null;
const UsersCompareFunction = (oldUsers: Array<IUser> | undefined, newUsers: Array<IUser> | undefined) => {
    return ((oldUsers === undefined) && (Array.isArray(newUsers))) ? true : (Array.isArray(oldUsers) && Array.isArray(newUsers)) ? (oldUsers.map(u => u.email).sort().toString() === newUsers.map(u => u.email).sort().toString()) : false
}
//(oldU, newU) => (isNullOrUndefined(oldU, newU) ? false : oldU.sort().join() !== newU.sort().join())
export default function Header({scrollContainerRef}) {
    const {isDesktop} = useContext(DrawerContext);
    const router = useRouter();
    const [user] = useAuthState(auth);
    /** Only update state when it was loading previously and now it's not **/
    const chatLoading = useConversationState(state => state.loading, (O, N) => !(O === true && N === false));
    const users = (useConversationState(state => Array.isArray(state.state?.users) ? state.state.users : [], (oldU, newU) => ((oldU === undefined) && (Array.isArray(newU))) ? true : (Array.isArray(oldU) && Array.isArray(newU)) ? oldU.sort().toString() === newU.sort().toString() : false))?.filter(u => u !== user.email);
    const name = useConversationState(state => state.state?.name, (O, N) => ((O === undefined) && (typeof N === "string")));
    // const chatData = useConversationState(state => ({users: state.state.users, name: state.state.name}), shallow)
    // const chat = useConversationState(state => ({loading: state.loading, data: state.state}));
    const membersData = useConversationState(state => state.members, UsersCompareFunction) ?? [];
    const membersLoading = useConversationState(state => state.loading, (O, N) => !(O === true && N === false));
    // const {Create} = useContext(CallContext);
    // const isOnline = useNetwork();
    // const {isDev} = useContext(ActiveContext);
    const trigger = useScrollTrigger({
        threshold: 0,
        disableHysteresis: true,
        target: scrollContainerRef?.current ? scrollContainerRef.current : window ? window : undefined,
    });
    // const filtered = chatLoading ? [] : users?.filter((u) => u !== user.email);
    // const filteredMembers = chatLoading ? [] : membersData?.filter((u) => u.email !== user.email);
    useEffect(() => {
        console.count("updated header")
    });
    // useEffect(() => {
    //     console.count("updated header - props")
    // }, [name, chatLoading, users, membersLoading, user, membersData]);
    return (user) && (
        <Fragment>
            <Head>
                <title>
                    {name ?? users?.filter((u) => u !== user.email).join(",")} - Chats
                </title>
            </Head>
            <AppBar color={trigger ? 'primary' : 'default'} position="sticky" elevation={trigger ? 2 : 0}
                    style={{width: '100%', top: 0}}>
                <Toolbar>
                    <IconButton color="inherit" onClick={() => router.push("/")} style={{
                        marginRight: "1rem", display: isDesktop ? "none" : "block", // color: "white"
                    }}>
                        <ArrowBack/>
                    </IconButton>
                    <div style={{marginRight: "1rem"}}>
                        {(chatLoading || membersLoading) ? <CircularProgress color={"secondary"}/> : (
                            <Fragment>
                                <div>
                                    {users?.length ? (
                                        users.length > 1 ? <Badge
                                            overlap="circular"
                                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                            badgeContent={<MemberAvatar email={users[1]} small={true}
                                                                        member={membersData.find(({email}) => email === users[1])}/>}>
                                            <MemberAvatar email={users[0]} small={false}
                                                          member={membersData.find(({email}) => email === users[0])}/>
                                        </Badge> : <MemberAvatar email={users[0]} small={false}
                                                                 member={membersData.find(({email}) => email === users[0])}/>
                                    ) : null}
                                </div>
                            </Fragment>
                        )}
                    </div>
                    <ListItemText style={{width: '100%',}}
                                  primary={(
                                      <Typography
                                          color={"palette.text.primary"} style={{
                                          whiteSpace: "nowrap",
                                          width: '100%',
                                          textOverflow: "ellipsis",
                                          overflow: "hidden"
                                      }}>
                                          {name ?? users?.join(", ") ?? "Unavailable"}
                                      </Typography>
                                  )}
                                  secondary={(<LastActive/>)}
                    />

                    <div style={{flex: 1, flexGrow: "1 1 auto"}}/>
                    {/*{isDev && !(!filteredMembers?.length || chatLoading || !chatData || !isOnline) &&*/}
                    {/*    <IconButton color="inherit"*/}
                    {/*                onClick={Create}>*/}
                    {/*        <Call/>*/}
                    {/*    </IconButton>}*/}
                    {!isDesktop &&
                        <IconButton color="inherit" onClick={() => router.push(`/chat/${router.query.id}/options`)}>
                            <Info/>
                        </IconButton>
                    }
                </Toolbar>
            </AppBar>
        </Fragment>
    )
}