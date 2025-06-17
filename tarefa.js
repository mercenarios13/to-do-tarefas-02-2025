async function carregarUsuarios() {
    const resp = await fetch('http://localhost:3000/usuarios');
    const usuarios = await resp.json();
    const select = document.getElementById('usuarioId');
    select.innerHTML = '<option value="">Selecione</option>';
    usuarios.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = u.nome + ' (' + u.email + ')';
        select.appendChild(opt);
    });
}
carregarUsuarios();

document.getElementById('formTarefa').onsubmit = async function(e) {
    e.preventDefault();
    const usuarioId = document.getElementById('usuarioId').value;
    const descricao = document.getElementById('descricao').value.trim();
    const setor = document.getElementById('setor').value.trim();
    const prioridade = document.getElementById('prioridade').value;
    if (!usuarioId || !descricao || !setor || !prioridade) {
        document.getElementById('mensagem').innerText = 'Preencha todos os campos.';
        return;
    }
    const resp = await fetch('http://localhost:3000/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, descricao, setor, prioridade })
    });
    const data = await resp.json();
    if (resp.ok) {
        document.getElementById('mensagem').innerText = 'Cadastro concluído com sucesso.';
        document.getElementById('formTarefa').reset();
    } else {
        document.getElementById('mensagem').innerText = data.erro || 'Erro ao cadastrar.';
    }
};
