/**
 * catalogo.js - Gerencia a exibição do catálogo de produtos
 * Versão com galeria de múltiplas imagens e botão WhatsApp
 */

console.log("🚀 Iniciando carregamento do catálogo...");

// Função para trocar a imagem principal ao clicar na miniatura
window.trocarImagem = function(miniatura, codigo) {
    try {
        let galeria = miniatura.closest('.galeria');
        if (!galeria) {
            console.error("❌ Elemento .galeria não encontrado");
            return;
        }
        
        let imagemPrincipal = galeria.querySelector('.imagem-principal');
        if (!imagemPrincipal) {
            console.error("❌ Imagem principal não encontrada");
            return;
        }
        
        imagemPrincipal.src = miniatura.src;
        console.log(`✅ Imagem principal atualizada para: ${miniatura.src}`);
    } catch (error) {
        console.error("❌ Erro ao trocar imagem:", error);
    }
};

// Função para gerar link do WhatsApp
function gerarLinkWhatsApp(produto) {
    let numero = "5511999999999"; // SEU NÚMERO AQUI!
    let mensagem = `Olá! Tenho interesse no *${produto.descricao}* (código *${produto.codigo}*) - R$ *${produto.preco}*`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

// Carregar produtos do JSON
fetch('dados/produtos.json')
.then(resposta => {
    console.log("📥 Resposta recebida com status:", resposta.status);
    if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }
    return resposta.json();
})
.then(dados => {
    console.log("📦 Dados carregados:", dados);
    
    let area = document.getElementById("produtos");
    if (!area) {
        throw new Error("Elemento 'produtos' não encontrado no HTML!");
    }
    
    area.innerHTML = "";

    if (!dados.produtos || dados.produtos.length === 0) {
        area.innerHTML = "<p style='text-align:center;'>Nenhum produto cadastrado ainda.</p>";
        return;
    }

    console.log(`📋 Total de produtos: ${dados.produtos.length}`);

    dados.produtos.forEach((produto, index) => {
        let codigo = produto.codigo;
        
        console.log(`🆔 Produto ${index + 1}: ${codigo} - ${produto.descricao}`);
        
        // Criar container do produto
        let divProduto = document.createElement("div");
        divProduto.className = "produto-container";
        
        // Link do WhatsApp para este produto
        let linkWhatsApp = gerarLinkWhatsApp(produto);
        
        // Construir HTML das imagens
        let htmlImagens = `
            <div class="galeria">
                <img src="imagens/produtos/${codigo}.jpg" 
                     class="imagem-principal" 
                     alt="${produto.descricao}"
                     onerror="this.onerror=null; this.src='imagens/sem-imagem.jpg'; console.log('⚠️ Imagem principal não encontrada: ${codigo}.jpg');">
                <div class="miniaturas">
        `;
        
        // Tentar carregar até 3 imagens secundárias
        for(let i = 1; i <= 3; i++) {
            let imgSrc = `imagens/produtos/${codigo}-${i}.jpg`;
            htmlImagens += `
                <img src="${imgSrc}" 
                     class="miniatura" 
                     alt="${produto.descricao} - imagem ${i}"
                     onerror="this.style.display='none'; console.log('⚠️ Imagem secundária não encontrada: ${codigo}-${i}.jpg');"
                     onclick="trocarImagem(this, '${codigo}')">
            `;
        }
        
        htmlImagens += `
                </div>
            </div>
            <div class="info">
                <h3>${produto.descricao || "Sem descrição"}</h3>
                <p><strong>Código:</strong> ${codigo}</p>
                <p><strong>Preço:</strong> R$ ${produto.preco || "0,00"}</p>
                <p><strong>Coleção:</strong> ${produto.colecao || "Geral"}</p>
                <p><strong>Categoria:</strong> ${produto.categoria || "Acessórios"}</p>
                <a href="${linkWhatsApp}" target="_blank" class="btn-whatsapp-produto">
                    <i class="fab fa-whatsapp"></i> Comprar via WhatsApp
                </a>
            </div>
        `;
        
        divProduto.innerHTML = htmlImagens;
        area.appendChild(divProduto);
    });
    
    console.log("✅ Catálogo carregado com sucesso!");
})
.catch(erro => {
    console.error("❌ Erro ao carregar catálogo:", erro);
    console.error("❌ Mensagem:", erro.message);
    console.error("❌ Stack:", erro.stack);
    
    let area = document.getElementById("produtos");
    if (area) {
        area.innerHTML = `
            <div style="color:red; text-align:center; padding:20px;">
                <h3>❌ Erro ao carregar produtos</h3>
                <p>${erro.message}</p>
                <p>Verifique o console (F12) para mais detalhes.</p>
            </div>
        `;
    }
});