import React, { Component } from 'react';
import { Button, Card, Image, Item,  Grid, Menu, Segment, Container, Divider } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';
import Package from '../package';
import Session from '../utils/session';
import Link from 'next/link';
import Styles from '../css/index.scss';

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
      
        if (!props.session || !props.session.loggedin || props.session.tipo == "User") {
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
                    <h4 style={{textAlign: 'center', color: '#f88114'}}><b>Projeto de pesquisa - Mestrado em Informática Aplicada</b></h4>
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

                    <Divider />
                    <h4 style={{textAlign: 'center', color: '#f88114'}}><b>Dados dos Pesquisadores</b></h4>
                    <Item.Group>
                        <Item>
                        <Item.Image size='tiny' src='https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/Anderson.png?raw=true' />

                        <Item.Content>
                            <Item.Header as='a'>Anderson Melo</Item.Header>
                            <Item.Meta>Mestrando em Informática Aplicada</Item.Meta>
                            <Item.Description></Item.Description>
                            <Item.Extra><b>Possui graduação em Ciência da Computação - Universidade Federal Rural de Pernambuco - 
                                Unidade Acadêmica de Garanhuns (2018), mestrado acadêmico em andamento na área de sistemas distribuídos
                                 baseados em Blockchain - Universidade Federal Rural de Pernambuco. Tem experiência na área de Ciência da Computação,
                                  com ênfase em sistemas distribuídos, programação orientada a objeto, desenvolvimento para a web e para dispositivos 
                                  móveis e gerenciamento de bancos de dados. Desenvolveu pesquisas de iniciação cientifica sobre o uso de tecnologias
                                   na educação de jovens e adultos e utilização de ferramentas tecnológicas em sala de aula. Possui formação técnica na
                                    área de administração, com ênfase em Recursos Humanos.</b>
                            </Item.Extra>
                        </Item.Content>
                        </Item>

                        <Item>
                        <Item.Image size='tiny' src='https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/Fernando.png?raw=true' />

                        <Item.Content>
                            <Item.Header as='a'>Prof. Fernando Aires</Item.Header>
                            <Item.Meta>Orientador</Item.Meta>
                            <Item.Description></Item.Description>
                            <Item.Extra><b>Possui graduação em Engenharia da Computação pela Universidade de Pernambuco (POLI/UPE 2004), 
                                mestrado em Ciências da Computação pela Universidade Federal de Pernambuco (CIn/UFPE 2007) e doutorado em Ciência da Computação
                                 na Universidade Federal de Pernambuco (CIn/UFPE 2012), onde parte do doutoramento foi realizado no laboratório HP Labs 
                                 Palo Alto (Estados Unidos). Possui também pós-doutorado na Universidade de Coimbra, Portugal. Atualmente, 
                                 é professor adjunto da Universidade Federal Rural de Pernambuco. Tem experiência na área de Ciência da Computação, 
                                 com ênfase na parte de sistemas distribuídos, computação orientada a serviço (SOC), computação em nuvem, 
                                 computação móvel, Internet das Coisas (IoT), avaliação de desempenho e segurança da informação.</b>
                            </Item.Extra>
                        </Item.Content>
                        </Item>
                    </Item.Group>
                    
                    </Container>
                    <Container fluid={this.props.fluid}>
                        <hr/>
                        <p className="text-muted small" style={{textAlign: "center"}}>
                        <Link href="https://github.com/AndersonMelo123/BlockMoodle"><a className="text-muted font-weight-bold"><span className="icon ion-logo-github"/> {Package.name} {Package.version}</a></Link>
                        <span> criado por </span>
                        <Link href="http://lattes.cnpq.br/4825772150496499"><a className="text-muted font-weight-bold">Anderson Melo</a></Link>
                        <span className="ml-2">&copy; {new Date().getYear() + 1900}.</span>
                        </p>
                    </Container>            
            </Layout>

        );
    }
}