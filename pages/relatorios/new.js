import React, { Component } from 'react';
import Router from 'next/router';
import { Form, Button, Input, Icon, Message, Grid, Modal, Header} from 'semantic-ui-react';
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

        console.log('docs: ', props.docs[0].doc);
        console.log('len: ', props.len);

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
            nameFile: '',
            hashFile: [],
            deuCerto: '',
            modalOpen: false
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

    validar = async () => {

        const formData = new FormData();
        formData.append('nameFile', this.state.nameFile);

        await fetch("/api/files/validar", {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(json => this.state.hashFile.push(json.data.hash))
        .catch(err => console.error(err));

        console.log('this.state.hashFile', this.state.hashFile[0]);
        console.log('this.props.len', this.props.len);

        for (let i = 0; i < this.props.len; i++) {
            //console.log('num '+i+' :', this.props.docs[i].doc);
            if (this.props.docs[i].doc == this.state.hashFile[0]) {
                console.log('deu certo');
                this.setState({deuCerto: 'Validado!'});

                console.log('deuCerto -----', this.state.deuCerto);
            } else {
                console.log('deu errado');
            }
        }

        this.setState({ modalOpen: true })
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

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

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
                        <Form error={!!this.state.errorMessage}>
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

                    
                    
                            <Modal
                                trigger={<Button onClick={this.validar} primary><Icon name='check square outline'/>Validar</Button>}
                                open={this.state.modalOpen}
                                onClose={this.handleClose}
                                size='tiny'
                                centered={false}>
                                <Header icon='file alternate outline' content='Válido' />
                                <Modal.Content>
                                <h3>O arquivo é válido e se encontra na Blockchain</h3>
                                </Modal.Content>
                                <Modal.Actions>
                                <Button color='green' onClick={this.handleClose} inverted>
                                    <Icon name='checkmark' /> Ok
                                </Button>
                                </Modal.Actions>
                            </Modal>
                        
                        </Form> 

                        <Message success content = {this.state.deuCerto}/>
                    </Grid.Column>
                </Grid.Row>
                </Grid>
            
            </Layout>
        ); 
    }
}

