import web3 from './web3';
import Moodle from './build/Moodle.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(Moodle.interface), address);
};