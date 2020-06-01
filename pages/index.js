import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {

    state = {
        length: '',
        docs: []
    }

    /*async componentDidMount() {
        const length = await factory.methods.getLength().call();

        this.setState({length});

        try {
            let docs = [];
            for (let i = 0; i < length; i++) {
            
                const file = await factory.methods.getDoc(i).call();
                
                //console.log('ddddddddddd', JSON.stringify(file));

                docs.push(JSON.stringify(file));

                //console.log('=========================================', docs);

                this.setState({ docs });
            }
  
        } catch (error) {
            console.log('mmmmmmm', error);
        }
    }*/

    static async getInitialProps() {

        const length = await factory.methods.getLength().call();

        let docs = [];
        for (let i = 0; i < length; i++) {
            
            const file = await factory.methods.docs(i).call();
                
            docs.push(file);
        }
  
        return { docs };
    }

    renderCampaigns() {

        console.log('Aqui', this.props.docs[0]);

        const items = this.props.docs.map(address => {

            var d = new Date(address.timestamp *1000);
			var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
			var data = d.getDate() +'/'+ months[d.getMonth()] +'/'+ d.getFullYear()+' às '+ d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
            return {
              header: address.description,
              description: address.doc,
              meta: data,
              fluid: true
            };
        });

        return <Card.Group items={items} />;
    
    }
    

    render() {
        return (

        <Layout>
            <div>
                <h3>Relatórios</h3>
                
                <Link route="/relatorios/new">
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

export default CampaignIndex;