import React, { Component } from 'react';
import Router from 'next/router';
import { Form, Button, Input, Icon, Message, Grid, Segment, Confirm, Image} from 'semantic-ui-react';
import Layout from '../../components/layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import Session from '../../utils/session';
const fetch = require('node-fetch');

export default class RelatorioNew extends Component {

    static async getInitialProps({req, res}) {
        let props = {
            session: '',
            docs: [],
            len: 0,
        }
        if (req && req.session) {
            props.session = req.session
        } else {
            props.session = await Session.getSession()
        }
        console.log('DDDDDDD',props.session);
        if (!props.session || !props.session.loggedin || props.session.tipo == "User") {
            if (req) {
                res.redirect('/login')
            } else {
                Router.push('/login')
            }
        }

        const length = await factory.methods.getLength().call();
        props.len = length;

        for (let i = 0; i < length; i++) {
            const file = await factory.methods.docs(i).call();
            props.docs.push(file);
        }

        return props
    }

    constructor(props) {
        super(props)
        this.state = {
            descricao: '',
            errorMessage: '',
            processMessage: '',
            disabled: false,
            hash: '',
            retorno: '',
            open: false,
            tipo: 1
        }
    }

    async componentDidMount() {
        this.getProfile()
    }

    async getProfile() {
        fetch('/auth/profile_cursos')
        .then(res => res.json())
        .then(res => {
            console.log(res.chave);
            return this.setState({hash: res.chave})
        })
    }

    getFile() {
        fetch("/api/files/getall_cursos", {
            method: 'GET'
        })
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "filename_curso.pdf";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //afterwards we remove the element again         
        });
    };

    onSubmit = async event => {

        if(this.state.descricao == ''){
            this.setState({retorno: 'Informe uma descrição que ajudará a identificar o relatório posteriormente.'});
            this.setState({ open: true })
        } else {
            event.preventDefault();
            this.setState({ disabled: true, errorMessage: '', processMessage: 'Seu relatório está sendo enviado a Blockchain'});

            try {
                const accounts = await web3.eth.getAccounts();
                await factory.methods.createReport(this.state.descricao, this.state.hash, this.state.tipo).send({ from: accounts[0] });
                this.getFile();
                window.location.reload(false);
            } catch (err) {
                this.setState({ errorMessage: err.message });
                window.location.reload(false);
            }
        
            this.setState({ disabled: false, processMessage: '' });
        }
    };

    handleConfirm = () => {
        this.setState({ open: false });
    }

    render() {
        return (
            <Layout {...this.props}>
                <h3 style={{color: '#f88114'}}>Relatório de Cursos</h3>
                <hr/>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <h5>Gerar Relatório</h5>
                            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} success={!!this.state.processMessage}>
                                <label>Descrição</label>
                                <Form.Field>
                                    <div className="ui icon input">
                                        <Input
                                            icon='edit outline'
                                            placeholder="Descrição..."
                                            value={this.state.descricao}
                                            disabled={this.state.disabled}
                                            onChange={event => this.setState({ descricao: event.target.value })}
                                        />    
                                    </div>
                                </Form.Field>
                                
                                <Button disabled={this.state.disabled} color='orange'>
                                    <Icon name='file alternate outline' />Gerar
                                </Button>

                                <Message error header="Oops!" content={this.state.errorMessage} />
                                <Message icon success>
                                    <Icon name='cog' loading />
                                    <Message.Content>
                                    <Message.Header>Aguarde</Message.Header>
                                        {this.state.processMessage}
                                    </Message.Content>
                                </Message>
                                <Confirm
                                    open={this.state.open}
                                    header='Atenção'
                                    content={this.state.retorno}
                                    onConfirm={this.handleConfirm}
                                    size='tiny'
                                />
                            </Form>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment raised>
                                <Image src='https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/Capturar.PNG?raw=true' size='tiny' floated='left' style={{height:'96px', width: '46px'}}/>
                                <b>Dica: </b>
                                Informe uma descrição que seja a útil para identificar o seu relatório posteriormente.
                                Ao clicar em "Gerar" o sistema irá criar um arquico PDF com o relatório solicitado, mas para isso será necessário
                                a realização do pagento de uma taxa em Ether para que seja possível a inserção do relatório na Blockchain.
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        ); 
    }
}