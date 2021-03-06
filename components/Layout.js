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
  Grid,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem} from 'reactstrap'
import Package from '../package'
import Styles from '../css/index.scss'

export default class extends React.Component {

  static propTypes() {
    return {
      children: React.PropTypes.object.isRequired,
      fluid: React.PropTypes.boolean
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    if (this.props.session && this.props.session.loggedin && this.props.session.tipo != "User") {
      return (
        <React.Fragment>
  
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
            <link rel="shortcut icon" href="https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/favicon.png?raw=true" type="image/x-icon"></link>
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
                <NavLink href="https://github.com/AndersonMelo123/BlockMoodle">GitHub</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Arquivos
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                  <NavLink href="/rlt_user">Usuários</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                  <NavLink href="/rlt_cursos">Cursos</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                  <NavLink href="/rlt_notas">Notas</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                  <NavLink href="/rlt_atividades">Atividades</NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Gerar Relatórios
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
              <NavItem>
                <NavLink href="/sobre">Sobre</NavLink>
              </NavItem>
            </Nav>
  
            <SignOutButton {...this.props} />
  
          </Navbar>
  
          <MainBody fluid={this.props.fluid}>
            
            {this.props.children}
            
          </MainBody>
  
        </React.Fragment>
      )
    } else if (this.props.session && this.props.session.loggedin && this.props.session.tipo == "User") {
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
            <Link prefetch href="/aluno/validar">
              <NavbarBrand href="/aluno/validar">
                <img top width="130px" src="https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/logo.png?raw=true" alt="Girl in a jacket"/>
              </NavbarBrand>
            </Link>

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
            <Link href="">
              {this.props.session.email}
            </Link>
            
            <Link href="/auth/signout">
              <Button style={{marginLeft:'10px'}} outline color="primary"><span className="icon ion-md-log-out mr-1"></span>Sair</Button>
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