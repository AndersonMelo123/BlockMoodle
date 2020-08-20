import React, { Component } from 'react';
import { Button, Card, Image,  Grid, Menu, Segment } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';
import Session from '../utils/session';
import Link from 'next/link';

export default class Rltatividades extends Component {

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

        const length = await factory.methods.getLength().call();

        for (let i = 0; i < length; i++) {
            
            const file = await factory.methods.docs(i).call();
          
            if(file.tipo == 3){
                props.docs.push(file);
            }
        }
        return props;
    }

    constructor(props) {
        super(props)
        this.state = {
            address: '',
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
      
    renderCampaigns() {

        const items = this.props.docs.map(address => {
            var d = new Date(address.timestamp *1000);
			var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
			var data = d.getDate() +'/'+ months[d.getMonth()] +'/'+ d.getFullYear()+' às '+ d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
            return {
              header: address.description,
              description: address.doc,
              meta: data,
              fluid: false
            };
        });
        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout {...this.props}>
                <div>
                    <h3 style={{color: '#f88114'}}>Relatórios de Atividades</h3>
                    <hr/>
                    <Link prefetch href="/relatorios/atividades">
                        <a>
                            <Button
                                floated="right"
                                content="Gerar Relatório"
                                icon="add"
                                color='orange'
                            />
                        </a>
                    </Link>
                    {this.renderCampaigns()}
                </div>                                    
            </Layout>
        );
    }
}