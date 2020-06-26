import React, { Component } from 'react';
import Router from 'next/router';
import { Form, Button, Input, Icon, Message, Grid} from 'semantic-ui-react';
import Layout from '../../components/layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import Session from '../../utils/session';


const fetch = require('node-fetch');


export default class RelatorioNew extends Component {

    static async getInitialProps({req, res}) {
        let props = {
            session: ''
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
        return props
    }

    constructor(props) {
        super(props)
        this.state = {
            descricao: '',
            errorMessage: '',
            loading: false,
            hash: '',
            selectedFile: [],
            nameFile: ''
        }
    }

    async componentDidMount() {
        this.getProfile()
    }

    async getProfile() {
        fetch('/auth/profile')
        .then(res => res.json())
        .then(res => {
          return this.setState({hash: res.chave})
        })
    }

    getFile() {
        fetch("/api/files/getall", {
            method: 'GET'
        })
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "filename.pdf";
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

            await factory.methods.createReport(this.state.descricao, this.state.hash).send({
              from: accounts[0]
            });
    
            //Router.push('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
    
        this.setState({ loading: false });

        this.getFile();
    };

    fileSelectedHandler = event => {
        console.log('event.target.files[0]', event.target.files[0])

        this.state.selectedFile.push(event.target.files[0]);

        //console.log('selectedFile', this.state.selectedFile[0]);
    }

    validar = () => {

        const formData = new FormData();
        formData.append('nameFile', this.state.nameFile);

        fetch("/api/files/validar", {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error(err));
    }

    onUpload = () => {
        
        const formData = new FormData()
        //formData.append('myFile', this.state.selectedFile, this.state.selectedFile.name);
        formData.append('myFile', this.state.selectedFile[0]);

        console.log('selectedFile >==>', this.state.selectedFile[0]);
        console.log('formData', formData);

        fetch('/api/files/upload', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(json => this.setState({nameFile: json.data.name}))
        .catch(err => console.error(err));

        //this.validar();
        
    }

    render() {
    
        return (
            <Layout {...this.props}>
                <h3>Relatórios de Usuários</h3>
                <hr/>
                <Grid columns={2} divided>
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
                        <h5>Validar Relatório</h5>
                        <Form onSubmit={this.onUpload} error={!!this.state.errorMessage}>
                            <label>Enviar um arquivo</label>
                            <Form.Group>
                                <Form.Input
                                    type="file"
                                    id="uploadfile" 
                                    name="uploadfile"
                                    onChange={this.fileSelectedHandler}
                                    width={12}
                                />

                                <Button floated="right" onClick={this.onUpload} primary>
                                    <Icon name='cloud upload' />
                                    Upload
                                </Button>
                                
                            </Form.Group>

                            


                            <Button onClick={this.validar} primary>
                                <Icon name='check square outline' />
                                Validar
                            </Button>
                        </Form> 
                    </Grid.Column>
                </Grid.Row>
                </Grid>
            
            </Layout>
        ); 
    }
}

