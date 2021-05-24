import cotacao from './cotacao';

(async()=>{
    console.log(await new cotacao().getConversao());
})();