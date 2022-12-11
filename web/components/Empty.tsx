import {Container, Grow, ListItemText} from "@mui/material";
import {Feedback} from "@mui/icons-material";
import Button from "@mui/material/Button";

export interface IVariant {
    title: string,
    description: string,
    icon: React.ReactNode,
    actions: Array<{ title: string, onClick: () => any }>
}

export interface IVariants {
    [x: string]: IVariant
}

const Variants: IVariants = {
    'no-chats-minimal': {
        title: 'Chats you create will appear here',
        icon: <Feedback/>,
        description: 'You currently have no chats. Create a new chat and it will appear here',
        actions: [],
    }
}
export const Empty = ({variant}: { variant: IVariant }) => {
    return <Grow in={true}><div
        style={{marginTop: '25%', width: "100%"}}>
        <Container maxWidth={"md"}
                   style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
            <div style={{textAlign: "center", justifyContent: "center", display: 'flex', flexDirection: 'column'}}>
                <div style={{alignSelf: 'center', justifySelf: 'center'}}><variant.icon fontSize={"large"}/></div>
                <br/>
                <ListItemText primary={variant.title}
                              secondary={variant.description}/>
                <br/>
                <div>{variant.actions.map(({title, onClick}) => <Button onClick={onClick}>{title}</Button>)}</div>
            </div>
        </Container>
    </div></Grow>
}