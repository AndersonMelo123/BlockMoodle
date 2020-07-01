import web3 from './web3';
import Moodle from './build/Moodle.json';

const instance = new web3.eth.Contract(
  JSON.parse(Moodle.interface),
  '0x5b54a608E11399578972f2525702CfAdA6b5aD9F'
);

export default instance;

//antigo : 0x4CF586D8C39955c4b08a573dd3d758961BaB306c

