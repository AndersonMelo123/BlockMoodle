import React, { Component } from 'react';
import { Button, Card, Grid, Form, Icon, Confirm, Statistic, Image } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';
import Session from '../utils/session';

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
        return props;
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
            },]
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

    contador(){
        var user=0, cursos=0, notas=0, atividades=0;
        for (let i = 0; i < this.props.docs.length; i++) {
            if (this.props.docs[i].tipo == 0){
                user+=1;
            } else if (this.props.docs[i].tipo == 1){
                cursos+=1;
            } else if (this.props.docs[i].tipo == 2){
                notas+=1;
            } else if (this.props.docs[i].tipo == 3){
                atividades+=1;
            }
        }
        var c = JSON.stringify({'user': user, 'curso': cursos, 'notas': notas, 'atividades': atividades});
        var obj = JSON.parse(c);
        return obj;
    }

    render() {
        return (
            <Layout {...this.props}>
                <h3 style={{color: '#f88114'}}>Relatórios registrados em Blockchain</h3>
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
                <div className='contador'>
                    <Statistic.Group size='mini'>
                    <Statistic >
                        <Statistic.Value><Image src='https://github.com/AndersonMelo123/BlockMoodle/blob/master/assets/favicon.png?raw=true' inline circular /> {this.props.docs.length}</Statistic.Value>
                        <Statistic.Label>nº total de <br/> relatórios</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{this.contador().user}</Statistic.Value>
                        <Statistic.Label>relat. de <br/> usuários</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{this.contador().curso}</Statistic.Value>
                        <Statistic.Label>relat. de <br/> cursos</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{this.contador().notas}</Statistic.Value>
                        <Statistic.Label>relat. de <br/> notas</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{this.contador().atividades}</Statistic.Value>
                        <Statistic.Label>relat. de <br/> atividades</Statistic.Label>
                    </Statistic>
                    </Statistic.Group>
                </div>
            </Layout>
        );
    }
}