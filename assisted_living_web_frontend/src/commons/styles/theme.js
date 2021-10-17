export default {
    palette: {
        primary: {
            light: '#33c9dc',
            main: '#00bcd4',
            dark: '#008394',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ff6333',
            main: '#ff3d00',
            dark: '#b22a00',
            contrastText: '#fff'
        }
    },
    others: {
        form: {
            textAlign: 'center'
        },
        image: {
            margin: '20px auto 20px auto'
        },
        pageTitle: {
            fontSize: '50px',
            margin: '10px auto 10px auto'
        },
        textField: {
            margin: '10px auto 10px auto'
        },
        inputLabel: {
            textAlign: 'center',
            marginTop: 10
        },
        button: {
            marginTop: 20,
            position: 'relative'
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
        paper: {
            width: '65%',
            marginTop: '105px',
            marginLeft: '25%',
            padding: 20
        },
        profile: {
            '& .image-wrapper': {
                textAlign: 'center',
                position: 'relative',
                '& button': {
                    position: 'absolute',
                    top: '80%',
                    left: '70%'
                }
            },
            '& .profile-image': {
                width: 200,
                height: 200,
                objectFit: 'cover',
                maxWidth: '100%',
                borderRadius: '50%'
            },
            '& .profile-details': {
                textAlign: 'center',
                '& span, svg': {
                    verticalAlign: 'middle'
                },
                '& a': {
                    color: '#00bcd4'
                }
            },
            '& hr': {
                border: 'none',
                margin: '0 0 10px 0'
            },
            '& svg.button': {
                '&:hover': {
                    cursor: 'pointer'
                }
            }
        }
    }
};