document.getElementById('formUsuario').onsubmit = async function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!nome || !email || !email.includes('@')) {
        document.getElementById('mensagem').innerText = 'Preencha todos os campos corretamente.';
        return;
    }
    const resp = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email })
    });
    const data = await resp.json();
    if (resp.ok) {
        document.getElementById('mensagem').innerText = 'Cadastro concluído com sucesso.';
        document.getElementById('formUsuario').reset();
    } else {
        document.getElementById('mensagem').innerText = data.erro || 'Erro ao cadastrar.';
    }
};
