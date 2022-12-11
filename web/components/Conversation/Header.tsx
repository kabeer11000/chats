import {Fragment, useContext} from "react";
import {DrawerContext} from "root-contexts";
import {useRouter} from "next/router";
import {CallContext, RootContext} from "./Context";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "firebase-config";
import dynamic from "next/dynamic";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import useNetwork from "../../hooks/useNetwork";


const AppBar = dynamic(() => import("@mui/material/AppBar"));
const Badge = dynamic(() => import("@mui/material/Badge"));
const Toolbar = dynamic(() => import("@mui/material/Toolbar"));
const IconButton = dynamic(() => import("@mui/material/IconButton"));
const Avatar = dynamic(() => import("@mui/material/Avatar"));
const ListItemText = dynamic(() => import("@mui/material/ListItemText"));
const Typography = dynamic(() => import("@mui/material/Typography"));
const TimeAgo = dynamic(() => import("timeago-react").then(({Default}) => Default));
const CircularProgress = dynamic(() => import("@mui/material/CircularProgress"));
const ArrowBack = dynamic(() => import("@mui/icons-material/ArrowBack"));
const Info = dynamic(() => import("@mui/icons-material/Info"));
const Call = dynamic(() => import("@mui/icons-material/Call"));
const Head = dynamic(() => import("next/head"));
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
        <Avatar {...smallProps} imgProps={{referrerPolicy: "no-referrer"}}
                src={member.photoURL} label={email.slice(0, 2)}/>
    ) : (<Avatar {...smallProps} label={email.slice(0, 2)}/>);
}
export default function Header({scrollContainerRef}) {
    // @ts-ignore
    const {isDesktop} = useContext(DrawerContext);
    const router = useRouter();
    const {members, chat} = useContext(RootContext);
    const {Create} = useContext(CallContext);
    const [user] = useAuthState(auth);
    const isOnline = useNetwork();
    // @ts-ignore
    const filtered = chat.loading ? [] : chat.data?.users.filter((u) => u !== user.email);
    // @ts-ignore
    const filteredMembers = ((members.loading) || !members.data) ? [] : members.data?.filter($u => $u.email !== user.email);

    const trigger = useScrollTrigger({
        threshold: 0,
        target: scrollContainerRef?.current ? scrollContainerRef.current : window ? window : undefined,
    });
    return (user) && (
        <Fragment>
            <Head>
                <title>
                    {/* @ts-ignore */}
                    {chat.data?.name ?? chat.data?.users.filter((u) => u !== user.email).join(",")} - Chats
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
                        {(chat.loading || members.loading) ? <CircularProgress color={"secondary"}/> : (
                            <Fragment>
                                <div>
                                    {filtered?.length ? (
                                        filtered.length > 1 ? <Badge
                                            overlap="circular"
                                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                            badgeContent={<MemberAvatar email={filtered[1]} small={true}
                                                                        member={filteredMembers.find(({email}) => email === filtered[1])}/>}
                                        >
                                            <MemberAvatar email={filtered[0]} small={false}
                                                          member={filteredMembers.find(({email}) => email === filtered[0])}/>
                                        </Badge> : <MemberAvatar email={filtered[0]} small={false}
                                                                 member={filteredMembers.find(({email}) => email === filtered[0])}/>
                                    ) : null}
                                </div>
                            </Fragment>
                        )}
                    </div>

                    <ListItemText style={{width: '100%',}}
                                  primary={(
                                      <Typography
                                          // @ts-ignore
                                          color={"palette.text.primary"} style={{
                                          whiteSpace: "nowrap",
                                          width: '100%',
                                          textOverflow: "ellipsis",
                                          overflow: "hidden"
                                      }}>
                                          {chat.data?.name ?? filtered?.join(", ") ?? "Unavailable"}
                                      </Typography>
                                  )}
                                  secondary={(
                                      <Typography variant={"subtitle2"} style={{color: "grey"}}>
                                          {/* @ts-ignore */}
                                          {chat.data?.lastSent?.toDate() ? (
                                              // @ts-ignore
                                              <TimeAgo datetime={chat.data?.lastSent?.toDate()}/>
                                          ) : ('Unavailable')}
                                      </Typography>
                                  )}
                    />

                    <div style={{flex: 1, flexGrow: "1 1 auto"}}/>
                    {!(!filteredMembers?.length || chat.loading || !chat.data || !isOnline) && <IconButton color="inherit"
                                                                                              onClick={Create}>
                        <Call/>
                    </IconButton>}
                    {!isDesktop &&
                        <IconButton color="inherit" onClick={() => router.push(`/chat/${router.query.id}/options`)}>
                            <Info/>
                        </IconButton>}
                </Toolbar>
            </AppBar>
        </Fragment>
    )
}