import web3 from './web3';
import Moodle from './build/Moodle.json';

const instance = new web3.eth.Contract(
  JSON.parse(Moodle.interface),
  '0x6C5E23448cd79d5f4762Bbf4435d79baB9438674'
);

export default instance;

//antigo : 0x4CF586D8C39955c4b08a573dd3d758961BaB306c

