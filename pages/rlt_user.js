import React, { Component } from 'react';
import { Button, Card, Image,  Grid, Menu, Segment } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';
import Session from '../utils/session';
import Link from 'next/link';

export default class CampaignIndex extends Component {

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
      
        if (!props.session || !props.session.loggedin) {
            if (req) {
                res.redirect('/login')
            } else {
              Router.push('/login')
            }
        }

        const length = await factory.methods.getLength().call();

        for (let i = 0; i < length; i++) {
            
            const file = await factory.methods.docs(i).call();
            
            console.log('docs: ', file.tipo);
            if(file.tipo == 0){
                props.docs.push(file);
            }
        }

        console.log(props.docs);
  
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
            
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        })
      }
      
    renderCampaigns() {

        //console.log('Aqui', this.props.docs[0]);

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
                    <h3>Relatórios de Usuários</h3>
                    <hr/>
                                
                    <Link prefetch href="/relatorios/user">
                        <a>
                            <Button
                                floated="right"
                                content="Gerar Relatório"
                                icon="add"
                                primary
                            />
                        </a>
                    </Link>
                    {this.renderCampaigns()}
                </div>
                                     
            </Layout>
        );
    }
}
