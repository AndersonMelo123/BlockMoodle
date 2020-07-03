import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { 
  Container,
  Navbar, 
  NavbarBrand, 
  Nav, 
  NavItem, 
  Button,
  CardImg,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem} from 'reactstrap'
import Package from '../package'
import Styles from '../css/index.scss'

export default class extends React.Component {

  static propTypes() {
    return {
      // session: React.PropTypes.object.isRequired,
      children: React.PropTypes.object.isRequired,
      fluid: React.PropTypes.boolean
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
    }
  }


  //const toggle = () => setIsOpen(!isOpen);

  render() {
    if (this.props.session && this.props.session.loggedin) {
      return (
        <React.Fragment>
  
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
            <link rel="shortcut icon" href="favicon.png" type="image/x-icon"></link>
            <title>{this.props.title || 'BlockMoodle'}</title>
            <style dangerouslySetInnerHTML={{__html: Styles}}/>
          </Head>
  
          <Navbar light className="navbar navbar-expand-md pt-3 pb-3">
            <Link prefetch href="/">
              <NavbarBrand href="/">
                <img top width="130px" src="https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/logo.png?raw=true" alt="Girl in a jacket"/>
                
              </NavbarBrand>
            </Link>
  
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/sobre">Sobre</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/AndersonMelo123/BlockMoodle">GitHub</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Relatórios
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                  <NavLink href="/relatorios/user">Usuários</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                  <NavLink href="/relatorios/cursos">Cursos</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                  <NavLink href="/relatorios/notas">Notas</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                  <NavLink href="/relatorios/atividades">Atividades</NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
  
            <SignOutButton {...this.props} />
  
          </Navbar>
  
      
          
          <MainBody fluid={this.props.fluid}>
            
            {this.props.children}
            
  
          </MainBody>
  
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
            <link rel="shortcut icon" href="favicon.png" type="image/x-icon"></link>
            <title>{this.props.title || 'BlockMoodle'}</title>
            <style dangerouslySetInnerHTML={{__html: Styles}}/>
          </Head>
  
          <Navbar light className="navbar navbar-expand-md pt-3 pb-3">
            <Link prefetch href="/">
              <NavbarBrand href="/">
                <img top width="130px" src="https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/logo.png?raw=true" alt="Girl in a jacket"/>
              </NavbarBrand>
            </Link>
          </Navbar>
  
          <MainBody fluid={this.props.fluid}>
            
            {this.props.children}
          
          </MainBody>

          <Container fluid={this.props.fluid} className='footer'>
            <hr/>
            <p className="text-muted small" style={{textAlign: "center"}}>
              <Link href="https://github.com/AndersonMelo123/BlockMoodle"><a className="text-muted font-weight-bold"><span className="icon ion-logo-github"/> {Package.name} {Package.version}</a></Link>
              <span> criado por </span>
              <Link href="http://lattes.cnpq.br/4825772150496499"><a className="text-muted font-weight-bold">Anderson Melo</a></Link>
              <span className="ml-2">&copy; {new Date().getYear() + 1900}.</span>
            </p>
          </Container>
  
        </React.Fragment>
        
      )
    }
  }
}

export class MainBody extends React.Component {
  render() {
    return (
      <Container fluid={this.props.fluid} style={{marginTop: '1em'}}>
        {this.props.children}
      </Container>
    )
  }
}

export class SignOutButton extends React.Component {

  render() {
    if (this.props.session && this.props.session.loggedin) {
      return (
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link href="/auth/signout">
              <Button outline color="primary"><span className="icon ion-md-log-out mr-1"></span>Sair</Button>
            </Link>
          </NavItem>
        </Nav>
      )
    } else {
      return (
        <h5></h5>
        
      )
    }
  }
}