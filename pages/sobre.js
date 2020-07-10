import React, { Component } from 'react';
import { Button, Card, Image, Item,  Grid, Menu, Segment, Container, Divider } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';
import Session from '../utils/session';
import Link from 'next/link';

export default class CampaignIndex extends Component {

    static async getInitialProps({req, res}) {

        let props = {
            session: '',
            docs: [],
        }
          
        if (req && req.session) {
            props.session = req.session
        } else {
            props.session = await Session.getSession()
        }
      
        if (!props.session || !props.session.loggedin) {
            if (req) {
                res.redirect('/login')
            } else {
              Router.push('/login')
            }
        }

        return props;
    }

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            address: '',
            message: null,
            messageStyle: null,
            length: '',
            docs: [],
            
        }
        //this.handleChange = this.handleChange.bind(this)
        //this.setProfile = this.setProfile.bind(this)
    }

    render() {

        return (
            <Layout {...this.props}>
                <Image centered="true" src="https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/logo.png?raw=true" size='medium' />
                <Container textAlign='justified'>
                    <br/>
                    <h4 style={{textAlign: 'center'}}><b>Projeto de pesquisa - Mestrado em Informática Aplicada</b></h4>
                    <Divider />
                    <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                        ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
                        magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
                        ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
                        quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                        arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
                        Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
                        dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend
                        tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac,
                        enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
                        Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean
                        imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper
                        ultricies nisi.
                    </p>
                    <Item.Group>
                        <Item>
                        <Item.Image size='tiny' src='https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/Anderson.png?raw=true' />

                        <Item.Content>
                            <Item.Header as='a'>Anderson Melo</Item.Header>
                            <Item.Meta>Mestrando em Informática Aplicada</Item.Meta>
                            <Item.Description>
                            <Image src='/images/wireframe/short-paragraph.png' />
                            </Item.Description>
                            <Item.Extra>Additional Details</Item.Extra>
                        </Item.Content>
                        </Item>

                        <Item>
                        <Item.Image size='tiny' src='https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/Fernando.png?raw=true' />

                        <Item.Content>
                            <Item.Header as='a'>Prof. Fernando Aires</Item.Header>
                            <Item.Meta>Orientador</Item.Meta>
                            <Item.Description>
                            <Image src='/images/wireframe/short-paragraph.png' />
                            </Item.Description>
                            <Item.Extra>Additional Details</Item.Extra>
                        </Item.Content>
                        </Item>
                    </Item.Group>
                    
                    </Container>
                                     
            </Layout>

        );
    }
}