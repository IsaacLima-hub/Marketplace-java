// ==========================
// CONFIG MOCK
// ==========================
const USE_MOCK = false;

const MOCK_DATA = {
    usuarios: [
        {id: 1, nome: "João Silva", email: "joao@test.com", senha: "123456"},
        {id: 2, nome: "Maria Santos", email: "maria@test.com", senha: "123456"}
    ],
    veiculos: [
        {id: 1, marca: "Toyota", modelo: "Corolla", ano: 2022, preco: 85000, imagem: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&fit=crop", disponivel: true},
        {id: 2, marca: "Volkswagen", modelo: "Golf GTI", ano: 2023, preco: 120000, imagem: "https://images.unsplash.com/photo-1603796847052-87e989de8152?w=400&fit=crop", disponivel: true},
        {id: 3, marca: "Honda", modelo: "Civic", ano: 2021, preco: 78000, imagem: "https://images.unsplash.com/photo-1545156521-1dcc20795e5e?w=400&fit=crop", disponivel: false}
    ],
    anuncios: []
};

async function fetchWithMock(url) {
    if (!USE_MOCK) return fetch(url);

    console.log("[MOCK]", url);
    return fetchMock(url);
}

async function fetchMock(url) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (url.includes("usuarios")) {
                resolve({ ok: true, json: () => Promise.resolve(MOCK_DATA.usuarios) });
                return;
            }

            if (url.includes("veiculos")) {
                resolve({ ok: true, json: () => Promise.resolve(MOCK_DATA.veiculos) });
                return;
            }

            if (url.includes("anuncios")) {
                resolve({ ok: true, json: () => Promise.resolve(MOCK_DATA.anuncios) });
                return;
            }

            resolve({ ok: false });
        }, 500);
    });
}

// ==========================
// NAVBAR / AUTH
// ==========================
function atualizarNavbar() {
    const reservadosNav = document.getElementById("reservadosNav");
    const usuario = localStorage.getItem("usuarioLogado");
    const userNav = document.getElementById("userNav");
    const logoutNav = document.getElementById("logoutNav");
    const btnCriar = document.getElementById("btnCriar");
    const userNome = document.getElementById("userNome");
    const perfilNav = document.getElementById("perfilNav");
    const adminNav = document.getElementById("adminNav");


    if (usuario) {
        const u = JSON.parse(usuario);

        if (userNav) userNav.style.display = "block";
        if (logoutNav) logoutNav.style.display = "block";
        if (btnCriar) btnCriar.style.display = "block";
        if (userNome) userNome.textContent = u.nome;
        if (perfilNav) perfilNav.style.display = "block";
        if (reservadosNav) reservadosNav.style.display = "block";
        if (adminNav && u.admin === true) {
            adminNav.style.display = "block";
        }

    } else {
        if (userNav) userNav.style.display = "none";
        if (logoutNav) logoutNav.style.display = "none";
        if (btnCriar) btnCriar.style.display = "none";
        if (perfilNav) perfilNav.style.display = "none";
        if (reservadosNav) reservadosNav.style.display = "none";
        if (adminNav) adminNav.style.display = "none";
    }
}

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

function verificarLogin() {
    const usuario = localStorage.getItem("usuarioLogado");

    if (!usuario &&
        !window.location.pathname.includes("login.html") &&
        !window.location.pathname.includes("register.html") &&
        !window.location.pathname.includes("index.html")) {

        alert("Você precisa estar logado!");
        window.location.href = "login.html";
    }
}

function mostrarUsuarioLogado() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const input = document.getElementById("usuarioLogadoNome");

    if (usuario && input) {
        input.value = usuario.nome;
    }
}

// ==========================
// HOME - LISTAR ANÚNCIOS
// ==========================
async function carregarAnuncios() {
    const resposta = await fetchWithMock("http://localhost:8080/anuncios");
    const anuncios = await resposta.json();

    const lista = document.getElementById("listaAnuncios");
    if (!lista) return;

    lista.innerHTML = "";

    anuncios.forEach((a, index) => {

        if (!a.veiculo || !a.usuario) {
            console.log("Anúncio ignorado por dados incompletos:", a);
            return;
        }

        const card = document.createElement("div");
        card.className = "col-lg-4 col-md-6 fade-in-up";
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="card h-100 shadow-hover">
                <img src="${a.veiculo.imagem ?? 'https://via.placeholder.com/400x220?text=Sem+Imagem'}" 
                     class="card-img-top" alt="${a.veiculo.marca} ${a.veiculo.modelo}">

                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${a.veiculo.marca} ${a.veiculo.modelo}</h5>
                    <p class="text-muted mb-2">Ano: ${a.veiculo.ano}</p>
                    <h6 class="text-success-custom mb-3">R$ ${Number(a.veiculo.preco).toLocaleString('pt-BR')}</h6>
                    <p class="flex-grow-1">${a.descricao ?? "Veículo em ótimo estado!"}</p>

                    <p><strong>Status:</strong> ${
            a.veiculo.disponivel === false
                ? '<span style="color:red;font-weight:bold;"> Reservado</span>'
                : '<span style="color:green;font-weight:bold;"> Disponível</span>'
        }</p>
<div class="d-grid gap-2 mt-auto">

    <button class="btn btn-primary" onclick="verDetalhes(${a.id})">
        Ver Detalhes
    </button>

   ${
            (() => {
                const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

                if (
                    usuario &&
                    (
                        usuario.id === a.usuario.id ||
                        usuario.admin === true
                    )
                ) {
                    return `
                <button class="btn btn-warning" onclick="editarAnuncio(${a.id})">
                    Editar
                </button>

                <button class="btn btn-outline-danger" onclick="deletar(${a.id})">
                    Excluir
                </button>
            `;
                }

                return '';
            })()
        }
</div>
                </div>
            </div>
        `;

        lista.appendChild(card);
    });
}

// ==========================
// NAVEGAÇÃO
// ==========================
function irParaCriar() {
    window.location.href = "criar.html";
}

function verDetalhes(id) {
    window.location.href = `detalhes.html?id=${id}`;
}

function editarAnuncio(id) {
    window.location.href = `editar.html?id=${id}`;
}

// ==========================
// DELETAR
// ==========================
async function deletar(id) {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;

    await fetch(`http://localhost:8080/anuncios/${id}`, {
        method: "DELETE"
    });

    alert("Anúncio excluído com sucesso!");
    carregarAnuncios();
}
function filtrarAnuncios() {
    const termo = document.getElementById("searchInput").value.toLowerCase();

    const cards = document.querySelectorAll("#listaAnuncios .col-lg-4");

    cards.forEach(card => {
        const texto = card.innerText.toLowerCase();

        if (texto.includes(termo)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
// ==========================
// CRIAR ANÚNCIO
// ==========================
async function criarAnuncio(event) {
    event.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
        return;
    }

    const marca = document.getElementById("marca").value;
    const modelo = document.getElementById("modelo").value;
    const ano = document.getElementById("ano").value;
    const preco = document.getElementById("preco").value;
    const descricao = document.getElementById("descricao").value;

    const arquivoImagem = document.getElementById("imagem").files[0];

    let imagemBase64 = "";

    if (arquivoImagem) {
        imagemBase64 = await converterImagemBase64(arquivoImagem);
    }

    const veiculo = {
        marca: marca,
        modelo: modelo,
        ano: ano,
        preco: preco,
        imagem: imagemBase64,
        descricao: descricao
    };

    // SALVA VEÍCULO
    const respostaVeiculo = await fetch("http://localhost:8080/veiculos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(veiculo)
    });

    const veiculoSalvo = await respostaVeiculo.json();

    // SALVA ANÚNCIO
    const anuncio = {
        descricao: descricao,
        usuario: { id: usuario.id },
        veiculo: { id: veiculoSalvo.id }
    };

    await fetch("http://localhost:8080/anuncios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(anuncio)
    });

    alert("Anúncio criado com sucesso!");
    window.location.href = "index.html";
}
// ==========================
// DETALHES DO ANÚNCIO
// ==========================
async function carregarDetalhes() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const resposta = await fetch(`http://localhost:8080/anuncios/${id}`);
    const a = await resposta.json();

    const conteudo = document.getElementById("detalhesConteudo");
    const info = document.getElementById("infoRapida");
    const img = document.getElementById("veiculoImg");

    if (!conteudo || !a.veiculo) return;

    img.src = a.veiculo.imagem && a.veiculo.imagem !== "null"
        ? a.veiculo.imagem
        : "https://via.placeholder.com/800x400?text=Sem+Imagem";

    conteudo.innerHTML = `
        <h2 class="fw-bold mb-3">${a.veiculo.marca} ${a.veiculo.modelo}</h2>
        <h3 class="text-success mb-4">R$ ${Number(a.veiculo.preco).toLocaleString('pt-BR')}</h3>

        <p><strong>Ano:</strong> ${a.veiculo.ano}</p>
        <p><strong>Descrição:</strong> ${a.descricao ?? "Sem descrição"}</p>
        <p><strong>Vendedor:</strong> ${a.usuario.nome}</p>
        <a class="btn btn-success mt-3" target="_blank"
href="https://wa.me/55${a.usuario.telefone}?text=Olá,%20tenho%20interesse%20no%20veículo%20${a.veiculo.marca}%20${a.veiculo.modelo}">
Chamar no WhatsApp
</a>
    `;

    info.innerHTML = `
        <h5 class="mb-3">${a.veiculo.marca}</h5>
        <p><strong>Modelo:</strong> ${a.veiculo.modelo}</p>
        <p><strong>Status:</strong> ${
        a.veiculo.disponivel === false ? "Reservado" : "Disponível"
    }</p>

        ${
        a.veiculo.disponivel === false
            ? `<button class="btn btn-secondary w-100 mt-3" disabled>Veículo Reservado</button>`
            : `<button class="btn btn-success w-100 mt-3" onclick="pagarEntrada(${a.veiculo.id})">
    Pagar 10% e Reservar
</button>`
    }
    `;
}

async function reservarVeiculo(id) {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
        return;
    }

    await fetch(
        `http://localhost:8080/veiculos/reservar/${id}/${usuario.id}`,
        {
            method: "PUT"
        }
    );

    alert("Veículo reservado com sucesso!");
    carregarDetalhes();
    carregarAnuncios();
}

// ==========================
// CARREGAR DADOS NA TELA EDITAR
// ==========================
async function carregarEditar() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const resposta = await fetch(`http://localhost:8080/anuncios/${id}`);
    const a = await resposta.json();

    if (!a.veiculo) return;

    document.getElementById("anuncioId").value = a.id;
    document.getElementById("marca").value = a.veiculo.marca;
    document.getElementById("modelo").value = a.veiculo.modelo;
    document.getElementById("ano").value = a.veiculo.ano;
    document.getElementById("preco").value = a.veiculo.preco;
    document.getElementById("descricao").value = a.descricao;

    const preview = document.getElementById("preview");

    if (a.veiculo.imagem) {
        preview.src = a.veiculo.imagem;
        preview.style.display = "block";
    }
}

// ==========================
// SALVAR EDIÇÃO
// ==========================
async function salvarEdicao(event) {
    event.preventDefault();

    const id = document.getElementById("anuncioId").value;

    const marca = document.getElementById("marca").value;
    const modelo = document.getElementById("modelo").value;
    const ano = document.getElementById("ano").value;
    const preco = document.getElementById("preco").value;
    const arquivoImagem =
        document.getElementById("imagem").files[0];
    const descricao = document.getElementById("descricao").value;

    const respostaAnuncio = await fetch(`http://localhost:8080/anuncios/${id}`);
    const anuncioAtual = await respostaAnuncio.json();

    const idVeiculo = anuncioAtual.veiculo.id;

    let imagemAtual = anuncioAtual.veiculo.imagem;

    if (arquivoImagem) {
        imagemAtual = await converterImagemBase64(arquivoImagem);
    }

    // atualiza veículo
    await fetch(`http://localhost:8080/veiculos/${idVeiculo}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: idVeiculo,
            marca,
            modelo,
            ano,
            preco,
            imagem: imagemAtual,
            disponivel: anuncioAtual.veiculo.disponivel
        })
    });

    // atualiza anúncio
    await fetch(`http://localhost:8080/anuncios/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            descricao,
            veiculo: { id: idVeiculo }
        })
    });

    alert("Anúncio atualizado com sucesso!");
    window.location.href = "index.html";
}// ==========================
// LOGIN
// ==========================
async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch("http://localhost:8080/usuarios");
        const usuarios = await resposta.json();

        const usuario = usuarios.find(u => u.email === email && u.senha === senha);

        if (!usuario) {
            alert("Email ou senha inválidos!");
            return;
        }

        // Salva o usuário completo, incluindo CPF
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        alert("Login realizado com sucesso!");
        window.location.href = "index.html";
    } catch (e) {
        alert("Erro no servidor.");
    }
}

// ==========================
// CADASTRO
// ==========================
async function cadastrar(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;
    const cpf = document.getElementById("cpf").value;

    // Remove caracteres especiais
    const cpfLimpo = cpf.replace(/\D/g, "");
    const telefoneLimpo = telefone.replace(/\D/g, "");

    // Valida CPF
    if (cpfLimpo.length !== 11) {
        alert("CPF inválido!");
        return;
    }

    // Valida telefone
    if (telefoneLimpo.length !== 11) {
        alert("Telefone inválido!");
        return;
    }

    // Valida senha
    if (senha.length < 6) {
        alert("Senha deve ter no mínimo 6 caracteres.");
        return;
    }

    try {

        // Busca usuários existentes
        const respostaUsuarios =
            await fetch("http://localhost:8080/usuarios");

        const usuarios =
            await respostaUsuarios.json();

        // Verifica e-mail
        const emailExiste = usuarios.some(
            u => u.email &&
                u.email.toLowerCase() === email.toLowerCase()
        );

        if (emailExiste) {
            alert("Este e-mail já está cadastrado.");
            return;
        }

        // Verifica CPF
        const cpfExiste = usuarios.some(
            u => u.cpf &&
                u.cpf.replace(/\D/g, "") === cpfLimpo
        );

        if (cpfExiste) {
            alert("Este CPF já está cadastrado.");
            return;
        }

        // Verifica telefone
        const telefoneExiste = usuarios.some(
            u => u.telefone &&
                u.telefone.replace(/\D/g, "") === telefoneLimpo
        );

        if (telefoneExiste) {
            alert("Este telefone já está cadastrado.");
            return;
        }

        // Cadastra usuário
        await fetch("http://localhost:8080/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                email,
                telefone,
                cpf,
                senha
            })
        });

        alert("Conta criada com sucesso!");
        window.location.href = "login.html";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar usuário.");
    }
}

// ==========================
// WINDOW LOAD
// ==========================
window.onload = function () {
    atualizarNavbar();

    verificarLogin();

    if (document.getElementById("listaAnuncios")) {
        carregarAnuncios();
    }

    if (window.location.pathname.includes("detalhes.html")) {
        carregarDetalhes();
    }

    if (window.location.pathname.includes("editar.html")) {
        carregarEditar();
    }
    if (window.location.pathname.includes("reservados.html")) {
        carregarReservados();
    }
    if (window.location.pathname.includes("perfil.html")) {
        carregarPerfil();
    }
    if (window.location.pathname.includes("admin.html")) {
        carregarUsuariosAdmin();
    }
};
function previewImagem() {
    const arquivo = document.getElementById("imagem").files[0];
    const preview = document.getElementById("preview");

    if (arquivo) {
        const leitor = new FileReader();

        leitor.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        }

        leitor.readAsDataURL(arquivo);
    }
}

function converterImagemBase64(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();

        leitor.onload = () => resolve(leitor.result);
        leitor.onerror = error => reject(error);

        leitor.readAsDataURL(arquivo);
    });
}
async function carregarReservados() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
        return;
    }

    const resposta = await fetch("http://localhost:8080/veiculos");
    const veiculos = await resposta.json();

    const lista = document.getElementById("listaReservados");
    if (!lista) return;

    lista.innerHTML = "";

    const reservados = veiculos.filter(v =>
        v.reservadoPor &&
        v.reservadoPor.id === usuario.id
    );

    if (reservados.length === 0) {
        lista.innerHTML =
            '<p class="text-muted">Você ainda não reservou nenhum veículo.</p>';
        return;
    }

    reservados.forEach(v => {
        const card = document.createElement("div");
        card.className = "col-md-4";

        card.innerHTML = `
            <div class="card h-100 shadow">
                <img src="${v.imagem}" class="card-img-top" alt="${v.marca}">
                <div class="card-body">
                    <h5 class="card-title">${v.marca} ${v.modelo}</h5>
                    <p>Ano: ${v.ano}</p>
                    <h6 class="text-success">
                        R$ ${Number(v.preco).toLocaleString('pt-BR')}
                    </h6>
                    <span class="badge bg-danger">Reservado</span>
                </div>
            </div>
        `;

        lista.appendChild(card);
    });
}
// ==========================
// PERFIL
// ==========================
function carregarPerfil() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    console.log("Usuário carregado:", usuario);

    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("perfilNome").textContent =
        usuario.nome || "Não informado";

    document.getElementById("perfilEmail").textContent =
        usuario.email || "Não informado";

    document.getElementById("perfilTelefone").textContent =
        usuario.telefone || "Não informado";

    document.getElementById("perfilCpf").textContent =
        usuario.cpf || "Não informado";
}
// ==========================
// PAINEL ADMIN
// ==========================
async function carregarUsuariosAdmin() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    // Verifica se está logado
    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return;
    }

    // Verifica se é administrador
    if (usuario.admin !== true) {
        alert("Acesso permitido apenas para administradores.");
        window.location.href = "index.html";
        return;
    }

    // Busca todos os usuários
    const resposta = await fetch("http://localhost:8080/usuarios");
    const usuarios = await resposta.json();

    const lista = document.getElementById("listaUsuarios");
    if (!lista) return;

    lista.innerHTML = "";

    usuarios.forEach(u => {
        const card = document.createElement("div");
        card.className = "card mb-3 shadow-sm";

        card.innerHTML = `
            <div class="card-body">
                <h5>${u.nome}</h5>
                <p class="mb-1"><strong>Email:</strong> ${u.email}</p>
                <p class="mb-1"><strong>CPF:</strong> ${u.cpf || "Não informado"}</p>
                <p class="mb-1"><strong>Telefone:</strong> ${u.telefone || "Não informado"}</p>
                <p class="mb-3">
                    <strong>Administrador:</strong>
                    ${u.admin ? "✅ Sim" : "❌ Não"}
                </p>

                ${
            !u.admin
                ? `
                        <button class="btn btn-success btn-sm"
                                onclick="promoverAdmin(${u.id})">
                            Tornar Admin
                        </button>
                        `
                : ""
        }

                ${
            u.id !== usuario.id
                ? `
                        <button class="btn btn-danger btn-sm ms-2"
                                onclick="excluirUsuario(${u.id})">
                            Excluir Usuário
                        </button>
                        `
                : ""
        }
            </div>
        `;

        lista.appendChild(card);
    });
}// Promover usuário para administrador
async function promoverAdmin(id) {
    if (!confirm("Deseja tornar este usuário um administrador?")) {
        return;
    }

    const resposta = await fetch(
        `http://localhost:8080/usuarios/${id}/tornar-admin`,
        {
            method: "PUT"
        }
    );

    const mensagem = await resposta.text();

    if (resposta.ok) {
        alert(mensagem);
        carregarUsuariosAdmin();
    } else {
        alert("Erro ao promover usuário.");
    }
}

// Excluir usuário
async function excluirUsuario(id) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) {
        return;
    }

    const resposta = await fetch(
        `http://localhost:8080/usuarios/${id}`,
        {
            method: "DELETE"
        }
    );

    const mensagem = await resposta.text();

    if (resposta.ok) {
        alert(mensagem);
        carregarUsuariosAdmin();
    } else {
        alert("Erro ao excluir usuário.");
    }
}async function pagarEntrada(veiculoId) {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:8080/pagamentos/entrada/${veiculoId}`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            alert("Erro ao gerar pagamento.");
            return;
        }

        const dados = await response.json();

        // Redireciona para o Checkout Pro do Mercado Pago
        window.open(dados.url, "_blank");

        localStorage.setItem(
            "ultimoVeiculo",
            veiculoId
        );
    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor.");
    }
}// ==========================
// PROCESSAR RESERVA APÓS PAGAMENTO
// ==========================
async function processarReservaAposPagamento() {

    const params =
        new URLSearchParams(window.location.search);

    let veiculoId =
        params.get("veiculoId");

    if (!veiculoId) {
        veiculoId =
            localStorage.getItem("ultimoVeiculo");
    }

    const usuario =
        JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario || !veiculoId) {

        alert(
            "Dados inválidos para processar a reserva."
        );

        window.location.href = "index.html";
        return;
    }

    try {

        await fetch(
            `http://localhost:8080/veiculos/reservar/${veiculoId}/${usuario.id}`,
            {
                method: "PUT"
            }
        );

        alert("Veículo reservado com sucesso!");

        window.location.href = "reservados.html";

    } catch (error) {

        console.error(error);

        alert("Erro ao processar a reserva.");

        window.location.href = "index.html";
    }
}// ==========================
// MÁSCARAS CPF E TELEFONE
// ==========================

window.addEventListener("load", () => {

    const cpfInput =
        document.getElementById("cpf");

    const telefoneInput =
        document.getElementById("telefone");

    if (cpfInput) {

        IMask(cpfInput, {

            mask: "000.000.000-00"

        });
    }

    if (telefoneInput) {

        IMask(telefoneInput, {

            mask: "(00) 00000-0000"

        });
    }
});