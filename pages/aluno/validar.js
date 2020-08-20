import React, { Component } from 'react';
import { Button, Card, Grid, Form, Icon, Confirm, Statistic, Segment, Image } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Layout from '../../components/layout';
import Session from '../../utils/session';
import Router from 'next/router';

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
        console.log('DDDDDDD',props.session);
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

        return props
    }

    constructor(props) {
        super(props)
        this.state = {
            retorno: '',
            open: false,
            errorMessage: '',
            selectedFile: [],
            nameFile: '',
            hashFile: [],
            validacao: 0,
            valor: [],
            descricao: '',
            dataCriacao: '',
            dono: '',
            hash: '',
            tipo: '',
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        })
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
                this.state.valor.push(this.props.docs[i]);
            } else {
                console.log('deu errado');
            }
        }

        if (this.state.validacao == 1){
            this.setState({
                retorno: 'O arquivo é válido e se encontra registrado na Blockchain',
                descricao: this.state.valor[0].description,
                dataCriacao: this.state.valor[0].timestamp,
                hash: this.state.valor[0].doc,
                dono: this.state.valor[0].sender,
                tipo: this.state.valor[0].tipo});
        }else {
            this.setState({retorno: 'O arquivo não está registrado na Blockchain'});
        }

        this.setState({ open: true })
    }

    onUpload = async () => {
        
        if (this.state.selectedFile.length == 0) {
            this.setState({retorno: 'Insira um arquivo para ser validado'});
            this.setState({ open: true });
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

    handleConfirm = () => {
        this.setState({ open: false });
        window.location.reload(false);
    }

    mostrar() {    
        if(this.state.hash == ''){
            return "Nenhum arquivo encontrado"
        } else{

            var d = new Date(this.state.dataCriacao *1000);
		    var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
            var data = d.getDate() +'/'+ months[d.getMonth()] +'/'+ d.getFullYear()+' às '+ d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();

            var tipo = "";
            if (this.state.tipo == 0){
                tipo = "Relatório de Usuários";
            } else if (this.state.tipo == 1){
                tipo = "Relatório de Cursos";
            } else if(this.state.tipo == 2){
                tipo = "Relatório de Notas";
            } else{
                tipo = "Relatório de Atividades";
            };

            return <p style={{marginLeft: "20px", marginTop: "10px"}}>
                <b>Descrição: </b> {this.state.descricao} <br/>
                <b>Data do registro: </b> {data} <br/>
                <b>Registrado por: </b> {this.state.dono} <br/>
                <b>Hash do Arquivo: </b> {this.state.hash} <br/>
                <b>Tipo de relatório: </b> {tipo} <br/>
            </p>
        }
    }

    render() {
        return (
            <Layout {...this.props}>
                <h3 style={{color: '#f88114'}}>Relatórios registrados em Blockchain</h3>
                <hr/>
                <Grid columns={2} divided>
                    <Grid.Row>
                        <Grid.Column width={9}>
                        <h4>Olá {this.props.session.nome}</h4>
                        <Segment raised>
                            <Image src='https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/Capturar.PNG?raw=true' size='tiny' floated='left' style={{height:'96px', width: '46px'}}/>
                            <b>Dica: </b>
                            Nesta página é possível realizar a validação de um relatório que se encontra registrado na Blockchain.
                            Para isso realize o upload de um arquivo no formato PDF, no campo ao lado. Caso o seu arquivo se encontre
                            registrado no BlockMoodle uma mensagem de sucesso será exibida.
                        </Segment>
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
                                    <Button inverted onClick={this.onUpload} color='green'>
                                        <Icon name='check square outline'/>Validar
                                    </Button>  
                                    <Confirm
                                        open={this.state.open}
                                        header={this.state.retorno}
                                        content={this.mostrar()}
                                        onConfirm={this.handleConfirm}
                                    />
                                </Form.Group>
                            </Form> 
                        </Grid.Column>
                    </Grid.Row>
                </Grid> 
            </Layout>
        );
    }
}