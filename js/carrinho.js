// js/carrinho.js - Lógica completa do carrinho invisível

class Carrinho {
    constructor() {
        this.itens = JSON.parse(localStorage.getItem('carrinho')) || [];
        this.atualizarContador();
    }

    // Adicionar item ao carrinho
    adicionar(produto) {
        const existente = this.itens.find(item => item.codigo === produto.codigo);
        
        if (existente) {
            existente.quantidade += 1;
        } else {
            this.itens.push({
                codigo: produto.codigo,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                quantidade: 1
            });
        }
        
        this.salvar();
        this.atualizarContador();
        this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
    }

    // Remover item do carrinho
    remover(codigo) {
        this.itens = this.itens.filter(item => item.codigo !== codigo);
        this.salvar();
        this.atualizarContador();
        if (window.location.pathname.includes('carrinho.html')) {
            window.carregarCarrinho?.(); // Atualiza a página se estiver no carrinho
        }
    }

    // Atualizar quantidade
    atualizarQuantidade(codigo, quantidade) {
        const item = this.itens.find(item => item.codigo === codigo);
        if (item) {
            item.quantidade = quantidade;
            if (item.quantidade <= 0) {
                this.remover(codigo);
            } else {
                this.salvar();
                if (window.location.pathname.includes('carrinho.html')) {
                    window.carregarCarrinho?.();
                }
            }
        }
    }

    // Calcular total
    get total() {
        return this.itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    }

    // Limpar carrinho
    limpar() {
        this.itens = [];
        this.salvar();
        this.atualizarContador();
    }

    // Salvar no localStorage
    salvar() {
        localStorage.setItem('carrinho', JSON.stringify(this.itens));
    }

    // Atualizar contador no ícone do carrinho
    atualizarContador() {
        const contador = document.getElementById('carrinho-contador');
        if (contador) {
            const totalItens = this.itens.reduce((acc, item) => acc + item.quantidade, 0);
            contador.textContent = totalItens;
            contador.style.display = totalItens > 0 ? 'flex' : 'none';
        }
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem) {
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-carrinho';
        notificacao.textContent = mensagem;
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notificacao);
        setTimeout(() => notificacao.remove(), 3000);
    }

    // Gerar mensagem do WhatsApp com todos os itens (INCLUINDO CÓDIGO DO PRODUTO)
    gerarMensagemWhatsApp() {
        let mensagem = "🛒 *PEDIDO WMLOPES*\n\n";
        this.itens.forEach(item => {
            // 🔥 ADICIONADO: código do produto entre colchetes
            mensagem += `• ${item.nome} [${item.codigo}] (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
        });
        mensagem += `\n💰 *TOTAL: R$ ${this.total.toFixed(2)}*`;
        return encodeURIComponent(mensagem);
    }
}

// Instância global do carrinho
window.carrinho = new Carrinho();

// CSS da animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);