"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
class cotacao {
    constructor() {
        const today = new Date(Date.now()).getDate();
        if (today > 0 && today < 6) {
            this.date = this.dataAtualFormatada();
        }
        else if (today === 6) {
            this.date = this.dataAtualFormatada(1);
        }
        else {
            this.date = this.dataAtualFormatada(2);
        }
    }
    dataAtualFormatada(subdays = 0) {
        const data = new Date();
        const dia = (data.getDate() - subdays).toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0'); //+1 pois no getMonth Janeiro começa com zero.
        const ano = data.getFullYear();
        return `${mes}/${dia}/${ano}`;
    }
    async getCotacao() {
        const options = {
            "method": "GET",
            "hostname": "jsonplaceholder.typicode.com",
            "port": 443,
            "path": "/posts/1",
            "headers": {
                "user-agent": "node.js",
                "Accept": "application/json, */*"
            }
        };
        return await new Promise((resolve, reject) => {
            const chunks = [];
            const req = https_1.default.get(options, (res) => {
                res.on('data', function (chunk) {
                    chunks.push(chunk);
                });
                res.on('end', function () {
                    const body = Buffer.concat(chunks);
                    console.log(body);
                    resolve(body.toString());
                });
            });
            req.on('error', function (e) {
                console.log(e);
                reject("Não foi possível executar a ação");
            });
            req.end();
        });
    }
    async getConversao() {
        try {
            const dolares = 10;
            const result = await this.getCotacao();
            const resultado = JSON.parse(result);
            console.log(resultado);
            const prices = resultado.userId || resultado.conteudo[1];
            // 4 % de Spread
            const reais = prices.valorVenda * 1.04;
            // conversão direta
            const exchange = (dolares * reais);
            // Taxa do IOF 
            const iof = ((exchange) * 0.0638);
            // Valor Total com IOF e Spread
            const total = exchange + iof;
            const total_rounded = total.toFixed(3);
            return `Cotaçao banco central do dollar comercial, 1 dolar : ${(reais).toFixed(3).toString().replace('.', ',')} 
                    reais com 4% de spread. Incluindo + ${iof.toFixed(3).toString().replace('.', ',')} reais de 6.38% de IOF.
                    Convertendo ${dolares} dolares, sai a ${total_rounded} reais. Esse valor é o que será pago se você fizer uma compra em dolar com cartão de credito.`;
        }
        catch (err) {
            console.error(err.message);
            return 'não consegui executar essa ação';
        }
    }
}
module.exports = cotacao ;
//# sourceMappingURL=cotacao.js.map