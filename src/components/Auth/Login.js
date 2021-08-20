import React from 'react'
import firebase from '../../firebase'
import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

class Login extends React.Component{

    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid(this.state)){
            this.setState({errors: [], loading: true})
            firebase.auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser)
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    });
                })
        
        }
    }

    isFormValid = ({email, password}) => email && password;

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

 

    handleInputError = (errors,inputName) => {
        errors.some(error => 
            error.message.toLowerCase().includes('email')
            ) 
                ? 'error' 
                : ''
    }

    render (){

        const { email, password, errors,loading} = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h1" textAlign="center">
                        <Icon name="code branch" color="orange" />
                        Login to DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                          

                            <Form.Input 
                                fluid 
                                name="email" 
                                icon="mail" 
                                iconPosition="left"
                                placeholder="Email Address" 
                                onChange={this.handleChange} 
                                type="email" 
                                value={email}
                                className={this.handleInputError(errors, 'email')}
                                />

                            <Form.Input 
                                fluid 
                                name="password" 
                                icon="lock" 
                                iconPosition="left"
                                placeholder="Password" 
                                onChange={this.handleChange}
                                type="password" 
                                value={password}
                                className={this.handleInputError(errors, 'password')}
                                />


                            <Button className={loading ? 'loading' : ''}
                                color="orange" 
                                fluid 
                                size="large"
                                >Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(this.state.errors)}
                        </Message>
                    )}
                    <Message>Don't have an account? <Link to='/register'>Register</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login