const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/Moodle.json');

const provider = new HDWalletProvider(
    'early permit lab door favorite decorate winter black novel drastic sphere bus',
    'https://rinkeby.infura.io/v3/639d5751cb5b484da643e8de299b68b6'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  //const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
  //  .deploy({ data: compiledFactory.bytecode })
  //  .send({ gas: '1000000', from: accounts[0] });

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: '0x' + compiledFactory.bytecode }) // add bytecode
    .send({ from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();