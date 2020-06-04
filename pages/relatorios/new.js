import React, { Component } from 'react';
import Router from 'next/router';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import Session from '../../utils/session';
//import { Router } from '../../routes';

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
            hash: ''
        }
    }

    async componentDidMount() {
        this.getProfile()
    }

    getProfile() {
        fetch('/auth/profile')
        .then(res => res.json())
        .then(res => {
          return this.setState({hash: res.chave})
        })
      }

    onSubmit = async event => {
        event.preventDefault();
    
        this.setState({ loading: true, errorMessage: '' });
    
        try {
            const accounts = await web3.eth.getAccounts();
            
            console.log('accounts', accounts);

            await factory.methods.createReport(this.state.descricao, this.state.hash).send({
              from: accounts[0]
            });
    
            Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
    
        this.setState({ loading: false });
    };

    render() {
        
        return (
            <Layout {...this.props}>
                <h3>Gerar Relatório</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Descrição</label>
                        
                        <div className="ui icon input">
                            <input 
                                style={{width: '50px'}}
                                type="text"
                                placeholder="Descrição..."
                                value={this.state.descricao}
                                onChange={event =>
                                    this.setState({ descricao: event.target.value })}
                            />
                            <i aria-hidden="true" className="search icon"></i>
                        </div>
                    </Form.Field>
                    
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Gerar</Button>
                </Form>
            </Layout>
        ); 
    }
}

