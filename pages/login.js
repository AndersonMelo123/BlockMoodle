import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { Row, Col, Card, CardHeader, CardBody, Form, Container, CardImg, FormGroup, Label, Input, Button, UncontrolledCarousel } from 'reactstrap';
import Layout from '../components/layout'
import Session from '../utils/session'
import Package from '../package'
import Styles from '../css/index.scss'

export default class extends React.Component {
  
  static async getInitialProps({req, res}) {

    let props = {
      session: ''
    }
    
    if (req && req.session) {
      props.session = req.session
    } else {
      props.session = await Session.getSession()
    }

    if (props.session && props.session.loggedin) {
      if (req) {
        res.redirect('/')
      } else {
        Router.push('/')
      }
    }
    
    return props
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      message: null
    }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value.trim()
    })
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value.trim()
    })
  }
  
  handleLogin(event) {
    event.preventDefault()

    this.setState({
      message: null
    })

    if (!this.state.email || !this.state.password) {
      this.setState({
        message: 'Informe Email e senha!'
      })

      return
    }

    let data = {
      email: this.state.email,
      password: this.state.password
    }

    fetch('auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(response => {
      console.log('response', response);
      if (response.loggedin) {
        Router.push(`/`)
      } else if (response.message) {
        this.setState({
          message: response.message
        })
      } else {
        this.setState({
          message: 'Unknown Error!'
        })
      }
    })
    .catch(error => {
      console.error('Error:', error)
      this.setState({
        message: 'Request Failed!'
      })
    })
  }

  show() {
    const items = [
        {
          src: 'https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/banner01.png?raw=true',
          altText: 'Slide 1',
          key: '1'
        },
        {
          src: 'https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/banner02.png?raw=true',
          altText: 'Slide 2',
          key: '2'
        },
        {
          src: 'https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/banner03.png?raw=true',
          altText: 'Slide 3',
          key: '3'
        }
      ];
      
      return <UncontrolledCarousel items={items}/>;
  }
  
  render() {
    
    const alert = (this.state.message === null) ? <div/> : <div className={`alert alert-danger`} role="alert">{this.state.message}</div>

    if (this.props.session.loggedin) {
      return (
        <Layout {...this.props}>
          <p className="lead text-center mt-5 mb-5">
            <Link href="/"><a>Manage your profile</a></Link>
          </p>
        </Layout>
      )
    } else {
      return (
        <Layout {...this.props}>
          <Container>
          
              <Row xs="2">
                <Col>
                  {this.show()}
                </Col>
              
                <Col md={{ size: 4, offset: 0 }}>
                  <Card>
                      <CardImg top width="140" src="https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/logo.png?raw=true" alt="Girl in a jacket"/>
                      
                      <CardBody>
                      <Form onSubmit={this.handleLogin}>
                          <FormGroup>
                          <Label for="userEmail">Email</Label>
                          <Input type="email" name="email" id="userEmail" placeholder="examplo@gmail.com" value={this.state.email} onChange={this.handleEmailChange} />
                          </FormGroup>
                          <FormGroup>
                          <Label for="userPassword">Senha</Label>
                          <Input type="password" name="password" id="userPassword" placeholder="" value={this.state.password} onChange={this.handlePasswordChange} />
                          </FormGroup>
                          <Button outline color="success" type="submit" style={{align: 'right'}}>Login</Button>
                      </Form>
                      </CardBody>
                      <hr/>
                      <p style={{textAlign: 'center', marginBottom: '10px'}}>
                        Se não tiver uma conta: <Link href="/signup"><a>cadastrar</a></Link>
                      </p>
                  </Card>
                  <br />
                  {alert}
                  
                </Col>
              </Row>
          
          </Container>
          <Container fluid={this.props.fluid} className='footer'>
            <hr/>
            <p className="text-muted small" style={{textAlign: "center"}}>
              <Link href="https://github.com/AndersonMelo123/BlockMoodle"><a className="text-muted font-weight-bold"><span className="icon ion-logo-github"/> {Package.name} {Package.version}</a></Link>
              <span> criado por </span>
              <Link href="http://lattes.cnpq.br/4825772150496499"><a className="text-muted font-weight-bold">Anderson Melo</a></Link>
              <span className="ml-2">&copy; {new Date().getYear() + 1900}.</span>
            </p>
          </Container>
        </Layout>
      )
    }
  }
}