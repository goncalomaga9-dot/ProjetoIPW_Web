document.addEventListener("DOMContentLoaded", function() {
    const btnTopo = document.getElementById("btn-topo");

    function verificarScroll() {
        // Se rolar mais de 300px para baixo, mostra o botão
        if (window.scrollY > 300) {
            btnTopo.style.display = "flex"; // Mostra e alinha a seta
        } else {
            btnTopo.style.display = "none"; // Esconde
        }
    }

    // Verifica scroll ao rolar a página
    window.addEventListener("scroll", verificarScroll);

    // Verifica também ao carregar (caso a página já inicie rolada)
    verificarScroll();

    // Ação de clique para subir suavemente
    btnTopo.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});




// CODIGO DA PAGINA CONTACTOS ** NAO MEXER**
document.addEventListener('DOMContentLoaded', function() {
    
    const contactForm = document.querySelector('.form-contacto');
    const statusDiv = document.getElementById('status-mensagem'); 

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const btn = contactForm.querySelector('button');
            const btnTextoOriginal = btn.innerText;
            btn.innerText = 'A enviar...';
            btn.disabled = true;

            const templateParams = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                mensagem: document.getElementById('mensagem').value
            };

            emailjs.send('service_4irqceo', 'template_zp5xw2o', templateParams)
                .then(function() {
                  
                    statusDiv.innerText = "Mensagem enviada com sucesso! Responderemos em breve.";
                    statusDiv.className = "sucesso"; 
                    
                    contactForm.reset(); 
                    btn.innerText = btnTextoOriginal;
                    btn.disabled = false;

                 
                    setTimeout(() => {
                        statusDiv.className = "";
                        statusDiv.innerText = ""; 
                    }, 5000);

                }, function(error) {
             
                    statusDiv.innerText = "Ocorreu um erro ao enviar. Tente novamente.";
                    statusDiv.className = "erro"; 
                    
                    console.error('Erro:', error);
                    btn.innerText = btnTextoOriginal;
                    btn.disabled = false;
                });
        });
    }
});














document.addEventListener("DOMContentLoaded", function() {
    // Chama a função para carregar as receitas assim que a página abre
    carregarReceitas();
});

async function carregarReceitas() {
    try {
        // 1. Vai buscar os dados ao ficheiro JSON
        const resposta = await fetch('receitas.json');
        const receitas = await resposta.json();

        // 2. Para cada receita da lista...
        receitas.forEach(receita => {
            
            // Cria o cartão HTML
            const cartaoHTML = `
                <article class="receita-card">
                    <img src="${receita.imagem}" alt="${receita.titulo}">
                    <div class="conteudo-card">
                        <h3>${receita.titulo}</h3>
                        <p>${receita.descricao}</p>
                        <a href="${receita.link}" class="botao">Ver Receita</a>
                    </div>
                </article>
            `;

            // 3. Descobre onde colocar o cartão baseada na categoria
            let contentor;

            if (receita.categoria === 'doces') {
                contentor = document.getElementById('container-doces');
            } else if (receita.categoria === 'pratos') {
                contentor = document.getElementById('container-pratos');
            } else if (receita.categoria === 'sopas') {
                contentor = document.getElementById('container-sopas');
            } else if (receita.categoria === 'bebidas') {
                contentor = document.getElementById('container-bebidas');
            }

            // 4. Se encontrou o contentor, adiciona o cartão lá dentro
            if (contentor) {
                contentor.innerHTML += cartaoHTML;
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar as receitas:", erro);
    }
}








// Seleciona o botão e a lista
const hamburger = document.getElementById('hamburger');
const menuList = document.getElementById('menu-list');

// Quando clicar no hamburguer...
hamburger.addEventListener('click', () => {
    // ...adiciona ou remove a classe "active" na lista
    menuList.classList.toggle('active');
});
















document.addEventListener("DOMContentLoaded", function() {
    // 1. Se estivermos na página principal (onde existe a lista de categorias)
    if (document.querySelector('.lista-receitas') || document.querySelector('.cards-receitas')) {
        carregarReceitas();
    }
    
    // 2. Se estivermos especificamente na página de favoritos
    if (document.getElementById('container-favoritos')) {
        carregarFavoritos();
    }
});

// ======================================================
// FUNÇÃO: Carregar Todas as Receitas (Página Principal)
// ======================================================
async function carregarReceitas() {
    try {
        const resposta = await fetch('receitas.json');
        const receitas = await resposta.json();
        
        // LIMPEZA: Apaga tudo o que estiver nas caixas antes de começar para não duplicar
        const caixas = document.querySelectorAll('.cards-receitas');
        caixas.forEach(caixa => {
            caixa.innerHTML = ""; 
        });

        // Ler os favoritos que já estão guardados no navegador
        let favoritosGuardados = JSON.parse(localStorage.getItem('meusFavoritos')) || [];

        receitas.forEach(receita => {
            
            // Verifica se esta receita já é favorita para pintar o coração
            const ehFavorito = favoritosGuardados.includes(receita.id) ? 'ativo' : '';

            // Cria o HTML do cartão
            const cartaoHTML = `
                <article class="receita-card">
                    <button class="btn-favorito ${ehFavorito}" onclick="toggleFavorito(${receita.id}, this)">
                        ❤
                    </button>
                    <img src="${receita.imagem}" alt="${receita.titulo}">
                    <div class="conteudo-card">
                        <h3>${receita.titulo}</h3>
                        <p>${receita.descricao}</p>
                        <a href="${receita.link}" class="botao">Ver Receita</a>
                    </div>
                </article>
            `;

            // Descobre em que caixa colocar baseada na categoria
            let contentor = null;
            if (receita.categoria === 'doces') contentor = document.getElementById('container-doces');
            else if (receita.categoria === 'pratos') contentor = document.getElementById('container-pratos');
            else if (receita.categoria === 'sopas') contentor = document.getElementById('container-sopas');
            else if (receita.categoria === 'bebidas') contentor = document.getElementById('container-bebidas');

            // Se encontrou a caixa correta no HTML, adiciona o cartão
            if (contentor) {
                contentor.innerHTML += cartaoHTML;
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar receitas:", erro);
    }
}

// ======================================================
// FUNÇÃO: Carregar Apenas Favoritos (Página Favoritos)
// ======================================================
async function carregarFavoritos() {
    const container = document.getElementById('container-favoritos');
    if (!container) return; // Segurança caso o elemento não exista

    try {
        const resposta = await fetch('receitas.json');
        const todasReceitas = await resposta.json();
        
        let favoritos = JSON.parse(localStorage.getItem('meusFavoritos')) || [];
        
        // Filtra apenas as receitas que têm o ID na lista de favoritos
        const receitasParaMostrar = todasReceitas.filter(receita => favoritos.includes(receita.id));

        // Limpa o contentor antes de adicionar
        container.innerHTML = "";

        // Se não houver favoritos, mostra mensagem
        if (receitasParaMostrar.length === 0) {
            container.innerHTML = "<p style='text-align:center; width:100%; grid-column: 1/-1;'>Ainda não tens favoritos guardados.</p>";
            return;
        }

        receitasParaMostrar.forEach(receita => {
            const cartaoHTML = `
                <article class="receita-card">
                     <button class="btn-favorito ativo" onclick="toggleFavorito(${receita.id}, this)">
                        ❤
                    </button>
                    <img src="${receita.imagem}" alt="${receita.titulo}">
                    <div class="conteudo-card">
                        <h3>${receita.titulo}</h3>
                        <p>${receita.descricao}</p>
                        <a href="${receita.link}" class="botao">Ver Receita</a>
                    </div>
                </article>
            `;
            container.innerHTML += cartaoHTML;
        });
    } catch (erro) {
        console.error("Erro ao carregar favoritos:", erro);
    }
}

// ======================================================
// FUNÇÃO: Adicionar/Remover Favorito (LocalStorage)
// ======================================================
function toggleFavorito(id, elementoBotao) {
    let favoritos = JSON.parse(localStorage.getItem('meusFavoritos')) || [];
    const index = favoritos.indexOf(id);

    if (index > -1) {
        // Se já existe, remove
        favoritos.splice(index, 1);
        elementoBotao.classList.remove('ativo');
        
        // Se estivermos na página de favoritos, recarrega a lista para remover visualmente o item na hora
        if(document.getElementById('container-favoritos')) {
            carregarFavoritos(); 
        }

    } else {
        // Se não existe, adiciona
        favoritos.push(id);
        elementoBotao.classList.add('ativo');
    }

    localStorage.setItem('meusFavoritos', JSON.stringify(favoritos));
}