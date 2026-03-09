fetch('dados/produtos.json')
.then(resposta => resposta.json())
.then(produtos => {

    let area = document.getElementById("produtos");

    area.innerHTML = "";

    produtos.forEach(produto => {

        let item = document.createElement("div");

        let imagem = "imagens/produtos/" + produto.codigo + ".jpg";

        item.innerHTML = `
        <div class="produto">
            <img src="${imagem}" width="150" 
                 onerror="this.src='imagens/sem-imagem.jpg'">
            <h3>${produto.descricao}</h3>  <!-- ✅ CORRIGIDO: descricao -->
            <p>Código: ${produto.codigo}</p>
            <p>Preço: R$ ${produto.preco}</p>
            <p>Coleção: ${produto.colecao}</p>  <!-- Opcional -->
            <p>Categoria: ${produto.categoria}</p>  <!-- Opcional -->
        </div>
        <hr>
        `;

        area.appendChild(item);

    });

})
.catch(erro => {
    console.error('Erro ao carregar produtos:', erro);
    document.getElementById("produtos").innerHTML = 
        '<p style="color:red">Erro ao carregar produtos. Verifique o console.</p>';
});