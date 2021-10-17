import React, {Fragment} from 'react';
import Avatar from 'react-avatar';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {CalendarToday, LocationOn} from '@material-ui/icons';

const styles = (theme) => ({
    ...theme.others
});

export default withStyles(styles)(({name, gender, address, birthDate, userType, classes}) => (
    <Paper className={classes.paper}>
        <div className={classes.profile}>
            <div className="image-wrapper">
                <Avatar maxInitials={1}
                        round={true}
                        name={name === undefined ? ' ' : name}/>
            </div>
            <hr/>
            <div className="profile-details">
                <hr/>
                {name && <Typography variant={'body2'}>{name}</Typography>}
                <hr/>
                {gender && <Typography variant={'body2'}>{gender}</Typography>}
                <hr/>
                {address && (
                    <Fragment>
                        <LocationOn color={'primary'}/> <span>{address}</span>
                        <hr/>
                    </Fragment>
                )}
                <CalendarToday color={'primary'}/>{' '}
                <span>Birthdate: {birthDate}</span>
                <hr/>
                {userType && <Typography variant={'body2'}>{userType}</Typography>}
            </div>
        </div>
    </Paper>
));