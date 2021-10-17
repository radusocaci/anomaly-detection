import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import AppIcon from '../images/icon.png';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import APIResponseErrorMessage from '../commons/errorhandling/api-response-error-message';

const styles = (theme) => ({
    ...theme.others
});

class Login extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            username: '',
            password: '',
            error: null,
            errorStatus: 0
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        nextProps.errorStatus && this.setState({errorStatus: nextProps.errorStatus});
        nextProps.error && this.setState({error: nextProps.error});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            username: this.state.username,
            password: this.state.password
        };
        this.setState({
            error: null,
            errorStatus: 0
        });
        this.props.loginUser(userData, this.props.history);
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const {classes} = this.props;
        return (
            <Grid container
                  className={classes.form}>
                <Grid item
                      sm/>
                <Grid item
                      sm>
                    <img src={AppIcon}
                         alt={'Medical System'}
                         className={classes.image}/>
                    <Typography variant={'h2'}
                                className={classes.pageTitle}>Login</Typography>
                    <form noValidate
                          onSubmit={this.handleSubmit}>
                        <TextField id={'username'}
                                   name={'username'}
                                   type={'username'}
                                   label={'username'}
                                   className={classes.textField}
                                   value={this.state.username}
                                   onChange={this.handleChange}
                                   fullWidth/>
                        <TextField id={'password'}
                                   name={'password'}
                                   type={'password'}
                                   label={'password'}
                                   className={classes.textField}
                                   value={this.state.password}
                                   onChange={this.handleChange}
                                   fullWidth/>
                        <Button type={'submit'}
                                variant={'contained'}
                                color={'primary'}
                                className={classes.button}>
                            Login
                        </Button>
                        <br/>
                    </form>
                    <br/>
                    {
                        this.state.errorStatus > 0 &&
                        <APIResponseErrorMessage errorStatus={this.state.errorStatus}
                                                 error={this.state.error}/>
                    }
                </Grid>
                <Grid item
                      sm/>
            </Grid>
        );
    }
}

export default withStyles(styles)(Login);

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    error: PropTypes.object,
    errorStatus: PropTypes.number,
    history: PropTypes.any,
    loginUser: PropTypes.func.isRequired
};