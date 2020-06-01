
import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running.
  console.log('com metamask');

  window.ethereum.enable();
  
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask
  console.log('sem metamask');
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/639d5751cb5b484da643e8de299b68b6'
  );
  web3 = new Web3(provider);
}

export default web3;