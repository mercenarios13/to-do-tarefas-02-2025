async function carregarTarefas() {
    const resp = await fetch('http://localhost:3000/tarefas');
    const tarefas = await resp.json();
    const usuariosResp = await fetch('http://localhost:3000/usuarios');
    const usuarios = await usuariosResp.json();
    const getUsuario = id => usuarios.find(u => u.id == id)?.nome || 'Desconhecido';

    const statusList = ['a fazer', 'fazendo', 'pronto'];
    let html = '<div style="display:flex;gap:2%">';
    statusList.forEach(status => {
        html += `<div class="status-col"><h2>${status.toUpperCase()}</h2>`;
        tarefas.filter(t => t.status === status).forEach(t => {
            html += `<div class="card">
                <b>${t.descricao}</b><br>
                Setor: ${t.setor}<br>
                Prioridade: ${t.prioridade}<br>
                Usuário: ${getUsuario(t.usuarioId)}<br>
                <select onchange="alterarStatus(${t.id}, this.value)">
                    <option value="a fazer" ${t.status==='a fazer'?'selected':''}>A Fazer</option>
                    <option value="fazendo" ${t.status==='fazendo'?'selected':''}>Fazendo</option>
                    <option value="pronto" ${t.status==='pronto'?'selected':''}>Pronto</option>
                </select>
                <button onclick="editarTarefa(${t.id})">Editar</button>
                <button onclick="excluirTarefa(${t.id})">Excluir</button>
            </div>`;
        });
        html += '</div>';
    });
    html += '</div>';
    document.getElementById('tarefas-container').innerHTML = html;
}
carregarTarefas();

window.alterarStatus = async function(id, status) {
    await fetch(`http://localhost:3000/tarefas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    carregarTarefas();
};

window.excluirTarefa = async function(id) {
    if (confirm('Deseja realmente excluir a tarefa?')) {
        await fetch(`http://localhost:3000/tarefas/${id}`, { method: 'DELETE' });
        carregarTarefas();
    }
};

window.editarTarefa = function(id) {
    alert('Para simplificação, edite a tarefa cadastrando novamente com as informações desejadas e exclua a antiga.');
    // Para implementação completa, seria necessário um formulário de edição.
};
