import React, {forwardRef} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import NavigationBar from './navigation-bar';
import Profile from './profile';

import ErrorPage from './commons/errorhandling/error-page';
import axios from 'axios';
import {HOST} from './commons/hosts';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themee from './commons/styles/theme';
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles';
import Login from './pages/login';
import {UserType} from './commons/UserType';
import Patients from './pages/patients';
import Caregivers from './pages/caregivers';
import Medications from './pages/medications';
import MedicationPlans from './pages/medication-plans';
import PatientHome from './pages/home/patient';
import Anomalies from './pages/home/anomalies';
import Baseline from './pages/home/baseline';
import CaregiverHome, {disconnect} from './pages/home/caregiver';
import AddBox from '@material-ui/icons/AddBox';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Edit from '@material-ui/icons/Edit';
import SaveAlt from '@material-ui/icons/SaveAlt';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import Search from '@material-ui/icons/Search';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Remove from '@material-ui/icons/Remove';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Grid from '@material-ui/core/Grid';
import {positions, Provider} from 'react-alert';
import AlertMUITemplate from 'react-alert-template-mui';

const theme = createMuiTheme(themee);

const options = {
    position: positions.MIDDLE
};

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} color={'primary'}
                                            ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} color={'primary'}
                                             ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} color={'primary'}
                                             ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} color={'primary'}
                                                      ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} color={'primary'}
                                                          ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} color={'primary'}
                                           ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} color={'primary'}
                                                ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} color={'primary'}
                                                   ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} color={'primary'}
                                                     ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} color={'primary'}
                                                   ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} color={'primary'}
                                                       ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} color={'primary'}
                                                          ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} color={'primary'}
                                                   ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} color={'primary'}
                                               ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} color={'primary'}
                                                         ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} color={'primary'}
                                                        ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} color={'primary'}
                                                       ref={ref}/>)
};

const genders = ['Male', 'Female'];

axios.defaults.baseURL = HOST.backend_api;

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        const userTypeLocal = localStorage.getItem('userType');
        const tokenLocal = localStorage.getItem('token');
        const usernameLocal = localStorage.getItem('username');
        const nameLocal = localStorage.getItem('name');
        const birthDateLocal = localStorage.getItem('birthDate');
        const genderLocal = localStorage.getItem('gender');
        const addressLocal = localStorage.getItem('address');
        let authenticated = false, token = '', userType = '', username = '', name = '', birthDate = '', gender = '',
            address = '';

        if (userTypeLocal) {
            token = tokenLocal;
            userType = userTypeLocal;
            authenticated = true;
            username = usernameLocal;
            name = nameLocal;
            birthDate = birthDateLocal;
            gender = genderLocal;
            address = addressLocal;
        }

        this.state = {
            authenticated: authenticated,
            token: token,
            username: username,
            userType: userType,
            name,
            birthDate,
            gender,
            address,
            errorStatus: 0,
            error: null
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogin(userData, history) {
        axios.post('/login', userData)
            .then(res => {
                localStorage.setItem('userType', res.data.userType);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('username', res.data.username);
                localStorage.setItem('name', res.data.name);
                localStorage.setItem('birthDate', res.data.birthDate);
                localStorage.setItem('gender', res.data.gender);
                localStorage.setItem('address', res.data.address);
                this.setState({
                    authenticated: true,
                    token: res.data.token,
                    username: res.data.username,
                    userType: res.data.userType,
                    name: res.data.name,
                    birthDate: res.data.birthDate,
                    gender: res.data.gender,
                    address: res.data.address
                });
                history.push('/');
            })
            .catch(err => {
                this.setState(({
                    errorStatus: err.response.status,
                    error: err.response.data
                }));
            });
    }

    handleLogout() {
        localStorage.removeItem('userType');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('birthDate');
        localStorage.removeItem('gender');
        localStorage.removeItem('address');
        this.setState({
            authenticated: false,
            token: '',
            username: '',
            userType: '',
            name: '',
            birthDate: '',
            gender: '',
            address: ''
        });
        disconnect();
        window.location.href = '/login';
    }

    render() {
        return (
            <Provider template={AlertMUITemplate} {...options}>
                <MuiThemeProvider theme={theme}>
                    <Router>
                        <NavigationBar authenticated={this.state.authenticated}
                                       userType={this.state.userType}
                                       logoutUser={this.handleLogout}/>
                        <Grid container
                              spacing={0}>
                            <Grid item
                                  sm={9}
                                  xs={12}>
                                <div className={'container'}>
                                    <Switch>
                                        <Route exact
                                               path="/login"
                                               render={(props) => (
                                                   this.state.authenticated === false ?
                                                       <div style={{marginLeft: '35%'}}>
                                                           <Login {...props} loginUser={this.handleLogin}
                                                                  errorStatus={this.state.errorStatus}
                                                                  error={this.state.error}/></div> :
                                                       <Redirect to={'/'}/>
                                               )}/>
                                        <Route exact
                                               path="/patients"
                                               render={(props) => (
                                                   this.state.authenticated === true ?
                                                       (this.state.userType === UserType.DOCTOR ?
                                                           <Patients {...props} genders={genders}
                                                                     tableIcons={tableIcons}/>
                                                           : <Redirect to={'/'}/>)
                                                       : <Redirect to={'/login'}/>
                                               )}/>
                                        <Route exact
                                               path="/caregivers"
                                               render={(props) => (
                                                   this.state.authenticated === true ?
                                                       (this.state.userType === UserType.DOCTOR ?
                                                           <Caregivers {...props} genders={genders}
                                                                       tableIcons={tableIcons}/>
                                                           : <Redirect to={'/'}/>)
                                                       : <Redirect to={'/login'}/>
                                               )}/>
                                        <Route exact
                                               path="/medications"
                                               render={(props) => (
                                                   this.state.authenticated === true ?
                                                       (this.state.userType === UserType.DOCTOR ?
                                                           <Medications {...props} tableIcons={tableIcons}/>
                                                           : <Redirect to={'/'}/>)
                                                       : <Redirect to={'/login'}/>
                                               )}/>
                                        <Route exact
                                               path="/medication-plans"
                                               render={(props) => (
                                                   this.state.authenticated === true ?
                                                       (this.state.userType === UserType.DOCTOR ?
                                                           <MedicationPlans {...props} tableIcons={tableIcons}/>
                                                           : <Redirect to={'/'}/>)
                                                       : <Redirect to={'/login'}/>
                                               )}/>
                                        <Route exact
                                               path="/patient"
                                               render={(props) => (
                                                   this.state.authenticated === true ?
                                                       (this.state.userType === UserType.PATIENT ?
                                                           <PatientHome {...props} tableIcons={tableIcons}/>
                                                           : <Redirect to={'/'}/>)
                                                       : <Redirect to={'/login'}/>
                                               )}/>
                                        <Route exact
                                               path="/caregiver"
                                               render={(props) => (
                                                   this.state.authenticated === true ?
                                                       (this.state.userType === UserType.CAREGIVER ?
                                                           <CaregiverHome {...props} tableIcons={tableIcons}/>
                                                           : <Redirect to={'/'}/>)
                                                       : <Redirect to={'/login'}/>
                                               )}/>
                                        <Route exact
                                               path="/"
                                               render={() => (this.state.authenticated === false ?
                                                   <Redirect to={'/login'}/> :
                                                   (this.state.userType === UserType.PATIENT ?
                                                       <Redirect to={'/patient'}/> : (this.state.userType === UserType.CAREGIVER ?
                                                           <Redirect to={'/caregiver'}/> :
                                                           <Redirect to={'/patients'}/>)))}/>
                                        <Route exact
                                               path="/anomalies"
                                               render={(props) => (
                                                   this.state.authenticated === true ?
                                                       (this.state.userType === UserType.DOCTOR || this.state.userType === UserType.CAREGIVER ?
                                                           <Anomalies {...props} />
                                                           : <Redirect to={'/'}/>)
                                                       : <Redirect to={'/login'}/>
                                               )}/>
                                        <Route exact
                                               path="/baseline"
                                               render={(props) => (
                                                           <Baseline {...props} />
                                               )}/>


                                        <Route render={() => <ErrorPage/>}/>
                                    </Switch>
                                </div>
                            </Grid>
                            {this.state.authenticated && <Grid item
                                                               sm={3}
                                                               xs={6}>
                                <Profile name={this.state.name}
                                         gender={this.state.gender}
                                         address={this.state.address}
                                         birthDate={this.state.birthDate}
                                         userType={this.state.userType}/>
                            </Grid>}
                        </Grid>
                    </Router>
                </MuiThemeProvider>
            </Provider>
        );
    };
}

export default App;