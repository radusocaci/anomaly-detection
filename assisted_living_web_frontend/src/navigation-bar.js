import React, {Fragment} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AppIcon from './images/icon.png';
import withStyles from '@material-ui/core/styles/withStyles';
import {UserType} from './commons/UserType';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import PersonIcon from '@material-ui/icons/Person';
import HealingIcon from '@material-ui/icons/Healing';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import AssessmentIcon from '@material-ui/icons/Assessment';

const styles = () => ({
    rightToolbar: {
        marginLeft: 'auto',
    },
    homeButton: {
        marginLeft: '200'
    },
    icon: {
        marginRight: '10px'
    }
});

export default withStyles(styles)(({
                                       authenticated,
                                       userType,
                                       classes,
                                       logoutUser
                                   }) => (
    <AppBar position={'static'}>
        <Toolbar>
            <Link to={'/'}>
                <img src={AppIcon}
                     alt={'Home Page'}
                     width={'50'}
                     height={'35'}/>
            </Link>
            {authenticated ? (
                <Fragment>
                    {userType === UserType.DOCTOR && (
                        <Fragment>
                            <Button color="inherit"
                                    component={Link}
                                    className={classes.rightToolbar}
                                    to="/patients">
                                <PersonIcon className={classes.icon}/>
                                Patients</Button>
                            <Button color="inherit"
                                    component={Link}
                                    to="/caregivers">
                                <LocalHospitalIcon className={classes.icon}/>
                                Caregivers</Button>
                            <Button color="inherit"
                                    component={Link}
                                    to="/medications">
                                <HealingIcon className={classes.icon}/>
                                Medications</Button>
                            <Button color="inherit"
                                    component={Link}
                                    to="/medication-plans">
                                <AssignmentIcon className={classes.icon}/>
                                Medication Plans</Button>
                        </Fragment>
                    )}
                    {(userType === UserType.DOCTOR || userType === UserType.CAREGIVER) && (
                        <Fragment>
                            <Button color="inherit"
                                    className={`${userType === UserType.CAREGIVER ? classes.rightToolbar : ''}`}
                                    component={Link}
                                    to="/anomalies">
                                <AddAlertIcon className={classes.icon}/>
                                Anomalies</Button>
                        </Fragment>
                    )}
                    {(userType === UserType.DOCTOR) && (
                        <Fragment>
                            <Button color="inherit"
                                    className={`${userType === UserType.CAREGIVER ? classes.rightToolbar : ''}`}
                                    component={Link}
                                    to="/baseline">
                                <AssessmentIcon className={classes.icon}/>
                                Baseline</Button>
                        </Fragment>
                    )}
                    <Button color="inherit"
                            className={classes.rightToolbar}
                            onClick={logoutUser}>
                        <ExitToAppIcon className={classes.icon}/>
                        Logout</Button>
                </Fragment>
            ) : (
                <Fragment>
                    <Button color="inherit"
                            component={Link}
                            className={classes.rightToolbar}
                            to="/login">
                        <LockOpenIcon className={classes.icon}/>
                        Login</Button>
                </Fragment>
            )}
        </Toolbar>
    </AppBar>
));