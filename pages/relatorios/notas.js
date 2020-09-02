import React, { Component } from 'react';
import Router from 'next/router';
import { Form, Button, Input, Icon, Message, Grid, Segment, Confirm, Image} from 'semantic-ui-react';
import Layout from '../../components/layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import Session from '../../utils/session';
const fetch = require('node-fetch');

export default class NotasNew extends Component {

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
            error: '',
            processMessage: '',
            process: '',
            disabled: false,
            hash: '',
            notas: '',
            retorno: '',
            open: false,
            tipo: 2,
            email: ''
        }
    }

    async componentDidMount() {
        this.getProfile()
    }

    async getAluno(){
        let dado = {
            email: this.state.email
        }

        await fetch('/auth/profile_aluno', {
            method: 'POST',
            body: JSON.stringify(dado),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            return this.setState({notas: res.chave})
        })
    }

    async getProfile() {
        fetch('/auth/profile_notas')
        .then(res => res.json())
        .then(res => {
            return this.setState({hash: res.chave})
        })
    }

    getFileNotas(){
        fetch("/api/files/get_notas", {
            method: 'GET'
        })
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "filename_notas_aluno.pdf";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //afterwards we remove the element again         
        });
    }

    getFile() {
        fetch("/api/files/getall_notas", {
            method: 'GET'
        })
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "filename_notas.pdf";
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

    onBuscaAluno = async event => {

        if(this.state.email == ''){
            this.setState({ retorno: 'Informe um email válido para localizarmos o aluno.'});
            this.setState({ open: true })
        } else {
            //event.preventDefault();
            this.setState({ disabled: true, error: '', process: 'Seu relatório está sendo enviado a Blockchain'});
            
            await this.getAluno();

            console.log('hash: ', this.state.hash);
            console.log('hash notas: ', this.state.notas);

            /*try {
                const accounts = await web3.eth.getAccounts();
                await factory.methods.createReport(this.state.email, this.state.notas, this.state.tipo).send({ from: accounts[0] });
                this.getFileNotas();
                window.location.reload(false);
            } catch (err) {
                this.setState({ error: err.message });
                window.location.reload(false);
            }*/
        
            this.setState({ disabled: false, process: '' });
        }
    };

    handleConfirm = () => {
        this.setState({ open: false });
    }
 
    render() {
        return (
            <Layout {...this.props}>
                <h3 style={{color: '#f88114'}}>Relatório de Notas</h3>
                <hr/>

                <Grid columns={2}>
                
                    <Grid.Row>
                        <Grid.Column>
                        <div style={{borderStyle: 'groove', borderRadius: 16, height: 320}}>
                                <div style={{margin:'10px'}}>
                                    <h5><b>Gerar histórico do aluno</b></h5>
                                    <Form onSubmit={this.onBuscaAluno} error={!!this.state.error} success={!!this.state.process}>
                                        <label>Email</label>
                                        <Form.Field>
                                            <div className="ui icon input">
                                                <Input
                                                    icon='edit outline'
                                                    placeholder="Email..."
                                                    value={this.state.email}
                                                    disabled={this.state.disabled}
                                                    onChange={event => this.setState({ email: event.target.value })}
                                                />    
                                            </div>
                                        </Form.Field>
                                        
                                        <Button disabled={this.state.disabled} color='orange'>
                                            <Icon name='file alternate outline' />Gerar
                                        </Button>

                                        <Message error header="Oops!" content={this.state.error} />
                                        <Message icon success>
                                            <Icon name='cog' loading />
                                            <Message.Content>
                                            <Message.Header>Aguarde</Message.Header>
                                                {this.state.process}
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
                                    <Segment raised>
                                        <b>Dica: </b>
                                        Informe o email do aluno para a realização da consulta. Ao clicar em "Gerar" será gerado um arquico PDF com os dados, 
                                        mas para isso será necessário a realização do pagento de uma taxa em Ether para que seja possível a inserção do relatório na Blockchain.
                                    </Segment>
                                </div>
                            </div>
                        </Grid.Column>

                        <Grid.Column>
                            <div style={{borderStyle: 'groove', borderRadius: 16}}>
                                <div style={{margin:'10px'}}>
                                    <h5>Gerar relatório geral de notas</h5>
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
                                            <Icon name='file code outline' />Gerar
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

                                    <Segment raised>
                                        <Image src='https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/Capturar.PNG?raw=true' size='tiny' floated='left' style={{height:'96px', width: '46px'}}/>
                                        <b>Dica: </b>
                                        Informe uma descrição que seja a útil para identificar o seu relatório posteriormente.
                                        Ao clicar em "Gerar" o sistema irá criar um arquico PDF com o relatório solicitado, mas para isso será necessário
                                        a realização do pagento de uma taxa em Ether para que seja possível a inserção do relatório na Blockchain.
                                    </Segment>
                                    </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        ); 
    }
}