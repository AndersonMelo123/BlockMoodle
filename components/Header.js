import React from 'react';
import { Menu } from 'semantic-ui-react';
//import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }} inverted>
      
        <a className="item">Home</a>
      

      <Menu.Menu position="right">
        
          <a className="item">Início</a>
        

        
          <a className="item">+</a>
        
      </Menu.Menu>
    </Menu>
  );
};