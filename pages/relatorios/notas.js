import React, { Component } from 'react';
import Router from 'next/router';
import { Form, Button, Input, Icon, Message, Grid, Modal, Header, Segment} from 'semantic-ui-react';
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
        if (!props.session || !props.session.loggedin) {
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

        //console.log('docs: ', props.docs[0].doc);
        console.log('len: ', props.len);

        return props
    }

    constructor(props) {
        super(props)
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.state = {
            descricao: '',
            errorMessage: '',
            loading: false,
            hash: '',
            selectedFile: [],
            nameFile: '',
            hashFile: [],
            retorno: '',
            modalOpen: false,
            validacao: 0,
            tipo: 2
        }
    }

    async componentDidMount() {
        this.getProfile()
    }

    async getProfile() {
        fetch('/auth/profile_notas')
        .then(res => res.json())
        .then(res => {
          return this.setState({hash: res.chave})
        })
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

    onDownload = async event => {
        this.getFile();
    };

    onSubmit = async event => {

        //await this.getProfile();

        event.preventDefault();
    
        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            
            console.log('accounts', accounts);

            await factory.methods.createReport(this.state.descricao, this.state.hash, this.state.tipo).send({
              from: accounts[0]
            });
    
            //Router.push('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
    
        this.setState({ loading: false });

        this.getFile();
    };


    handleOpen = () => this.setState({ modalOpen: true })

    forceUpdateHandler(){
        this.forceUpdate();
    };

    handleClose = () => {
        //this.setState({ selectedFile: [] });
        
        this.setState({ modalOpen: false });
        this.forceUpdateHandler();
    }

    render() {
    
        return (
            <Layout {...this.props}>
                <h3>Relatório de Notas</h3>
                <hr/>
                <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        <h5>Gerar Relatório</h5>
                        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                        <label>Descrição</label>
                            <Form.Field>
                                <div className="ui icon input">
                                    <Input
                                        icon='edit outline'
                                        placeholder="Descrição..."
                                        value={this.state.descricao}
                                        onChange={event =>
                                            this.setState({ descricao: event.target.value })}
                                    />    
                                </div>
                            </Form.Field>
                            <Message error header="Oops!" content={this.state.errorMessage} />
                            <Button loading={this.state.loading} primary>
                                <Icon name='file code outline' />
                                Gerar
                            </Button>
                        </Form>
                    </Grid.Column>
                
                    <Grid.Column>
                        <Segment raised>
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