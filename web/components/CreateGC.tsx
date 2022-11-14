import * as React from 'react';
import Box from '@mui/material/Box';
import {useTheme} from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import {DrawerContext} from "../Contexts";
import {Dialog, DialogContent} from "@mui/material";
import {UsersSearch} from "./Users";

const steps = [
    {
        label: 'Select campaign settings',
        component: <UsersSearch/>,
    },
    {
        label: 'Create an ad group',
        component: <UsersSearch/>,
    }
];

export default function TextMobileStepper() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = steps.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const {isDesktop, createGCDialog} = React.useContext(DrawerContext);
    return (
        <Dialog fullScreen={!isDesktop} open={createGCDialog.open}>
            <DialogContent>
                <Box sx={{flexGrow: 1, display: "flex", height: "100%", flexDirection: "column"}}>
                    <Paper
                        square
                        elevation={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            // height: 50,
                            // pl: 2,
                            // bgcolor: 'background.default',
                        }}
                    >
                        <Typography variant={"body1"}>{steps[activeStep].label}</Typography>
                    </Paper>
                    <Box sx={{ width: '100%'}}>
                        {steps[activeStep].component}
                    </Box>
                    <div style={{flex: 1, flexGrow: "1 1 auto"}}/>
                    <MobileStepper
                        variant="text"
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                            >
                                Next
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowLeft/>
                                ) : (
                                    <KeyboardArrowRight/>
                                )}
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowRight/>
                                ) : (
                                    <KeyboardArrowLeft/>
                                )}
                                Back
                            </Button>
                        }
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
}
