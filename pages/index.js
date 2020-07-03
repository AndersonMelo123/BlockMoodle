import React, { Component } from 'react';
import { Button, Card, Image,  Grid, Menu, Segment, Form, Input, Icon, Message, Modal, Header } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';
import Session from '../utils/session';
import Link from 'next/link';

export default class CampaignIndex extends Component {

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
            retorno: '',
            modalOpen: false,
            errorMessage: '',
            modalOpen: false,
            selectedFile: [],
            nameFile: '',
            hashFile: [],
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        })
      }

    cardGrupo() {
        const items = [
            {
                header: 'Relatórios de Usuários',
                description: 'Gerar relatórios de todos os usuários cadastrados no Moodle',
                meta: '_______________',
                href: '/rlt_user'
            },
            {
                header: 'Relatórios de Cursos',
                description: 'Gerar relatórios de todos os cursos cadastrados no Moodle',
                meta: '_______________',
                href: '/rlt_cursos'
            },
            {
                header: 'Relatórios de Notas',
                description: 'Gerar relatórios das notas dos alunos cadastrados no Moodle',
                meta: '_______________',
                href: '/rlt_notas'
            },
            {
                header: 'Relatórios de Atividades',
                description: 'Crie relatórios de todos os cursos cadastrados no Moodle',
                meta: '_______________',
                href: '/rlt_atividades'
            },
          ]
          
        return <Card.Group items={items} />
    }

    fileSelectedHandler = event => {
        this.state.selectedFile.push(event.target.files[0]);
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

        for (let i = 0; i < this.props.len; i++) {
            if (this.props.docs[i].doc == this.state.hashFile[0]) {
                this.setState({validacao: 1});
            } else {
                console.log('deu errado');
            }
        }

        if (this.state.validacao == 1){
            this.setState({retorno: 'O arquivo é válido e se encontra registrado na Blockchain!'});
        }else {
            this.setState({retorno: 'O arquivo não está registrado na Blockchain!'});
        }

        this.setState({ modalOpen: true })
    }

    onUpload = async () => {
        
        if (this.state.selectedFile.length == 0) {
            this.setState({retorno: 'Insira um arquivo para ser validado!'});
            this.setState({ modalOpen: true });
        } else{
            const formData = new FormData()
            formData.append('myFile', this.state.selectedFile[0]);

            await fetch('/api/files/upload', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(json => this.setState({nameFile: json.data.name}))
            .catch(err => console.error(err));

            this.validar();
        }
    }

    handleOpen = () => this.setState({ modalOpen: true })

    forceUpdateHandler(){
        this.forceUpdate();
    };

    handleClose = () => {        
        this.setState({ modalOpen: false });
        this.forceUpdateHandler();
    }

    render() {

        return (
            <Layout {...this.props}>

                <h3>Relatórios registrados em Blockchain</h3>

                <hr/>
                <Grid columns={2} divided>
                    <Grid.Row>
                        <Grid.Column width={9}>

                            {this.cardGrupo()}
                        
                        </Grid.Column>

                        <Grid.Column width={7}>
                            <h5><b>Validar Relatório</b></h5>
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

                                    <Modal
                                        trigger={<Button onClick={this.onUpload} primary><Icon name='check square outline'/>Validar</Button>}
                                        open={this.state.modalOpen}
                                        onClose={this.handleClose}
                                        size='tiny'
                                        centered={false}>
                                        <Header icon='file alternate outline' content='Arquivo' />
                                        <Modal.Content>
                                        <h3>{this.state.retorno}</h3>
                                        </Modal.Content>
                                        <Modal.Actions>
                                        <Button color='green' onClick={this.handleClose} inverted>
                                            <Icon name='checkmark' /> Ok
                                        </Button>
                                        </Modal.Actions>
                                    </Modal>
                                </Form.Group>
                            </Form> 
                        </Grid.Column>
                    </Grid.Row>
                </Grid>  
            </Layout>
        );
    }
}