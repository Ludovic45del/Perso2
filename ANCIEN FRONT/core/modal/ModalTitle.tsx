import Box from '@mui/material/Box';
import Title from '../Title/Title.tsx';
import IconComponent from '../icon/IconComponent.tsx';


interface TitleProps {
    title: string;
    close: (reason?: ( 'saveButton'|'cancelButton' | 'quitButton')) => void;
    iconId?: string;
}

export default function ModalTitle(props: TitleProps) {
    return <Box style={{display: 'flex'}}>
        <Title title={props.title} variant="h4"/>
        <IconComponent
            id={props.iconId}
            clickHandler={(e) => {
                e.stopPropagation();
                props.close();
            }}
            iconName={'Close'}
            sx={{cursor: 'pointer', marginLeft: 'auto'}}
            titleAccess={`${props.title}-icon`}/>
    </Box>;
}