class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  validarDados(){
    for(let i in this) {
      if(this[i] == undefined || this[i] == "" || this[i] == null) {
        return false
      }
    }
    return true
  }
}

let bd = {
  getNextId() {
    let nextId = localStorage.getItem("id")
    return parseInt(nextId) + 1
  },

  gravar(d) {
    let id = localStorage.getItem('id')
 
    if(id === null) {
      id = 1
    } else {
      id = this.getNextId()
    }
 
    localStorage.setItem(id, JSON.stringify(d))
 
    localStorage.setItem('id', id)
  },

  recuperarTodosRegistros() {
    let despesas = Array()

    let id = localStorage.getItem("id")

    for(let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i))

      if(despesa === null) {
        continue
      }

      despesa.id = i
      despesas.push(despesa)
    }

    return despesas
  },

  pesquisar(despesa) {
    let despesasFiltradas = Array()

    despesasFiltradas = this.recuperarTodosRegistros()

    if(despesa.ano != "") {
      despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
    }

    if(despesa.mes != "") {
      despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
    }

    if(despesa.dia != "") {
      despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
    }

    if(despesa.tipo != "") {
      despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
    }

    if(despesa.descricao != "") {
      despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
    }

    return despesasFiltradas
  },

  remover(id) {
    localStorage.removeItem(id)
  }
}

function cadastrarDispesa() {
  let ano = document.getElementById("ano")
  let mes = document.getElementById("mes")
  let dia = document.getElementById("dia")
  let tipo = document.getElementById("tipo")
  let descricao = document.getElementById("descricao")
  let valor = document.getElementById("valor")

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  ) 

  if(despesa.validarDados()) {
    bd.gravar(despesa)

    modalWrap = document.createElement("div")
    modalWrap.innerHTML = `
      <div class="modal fade" id="sucessoGravacao" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header text-success">
              <h5 class="modal-title" id="exampleModalLabel">Registro inserido com sucesso</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Despesa foi cadastrada com sucesso!
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" data-bs-dismiss="modal">Voltar</button>
            </div>
          </div>
        </div>
      </div>
      `

    document.body.append(modalWrap);
    let modal = new bootstrap.Modal(modalWrap.querySelector(".modal"))
    modal.show()

    ano.value = ""
    mes.value = ""
    dia.value = ""
    tipo.value = ""
    descricao.value = ""
    valor.value = ""
    
  } else {
      modalWrap1 = document.createElement("div")
      modalWrap1.innerHTML = `
        <div class="modal fade" id="erroGravacao" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header text-danger">
                <h5 class="modal-title" id="exampleModalLabel">Erro na gravação</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Existem campos obrigatórios que não foram preenchidos
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Voltar e corrigir</button>
              </div>
            </div>
          </div>
        </div>
      `

      document.body.append(modalWrap1);
      let modal1 = new bootstrap.Modal(modalWrap1.querySelector(".modal"))
      modal1.show()
  }
}

function carregaListaDespensas(despesas = Array(), filtro = false) {
  if(despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros()
  }

  let listaDespesas = document.getElementById("listaDespesas")
  listaDespesas.innerHTML = ""

  despesas.forEach((d) => {
    let linha = listaDespesas.insertRow()

    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

    switch(d.tipo) {
      case "1": d.tipo = "Alimentação"
        break
      case "2": d.tipo = "Educação"
        break
      case "3": d.tipo = "Lazer"
        break
      case "4": d.tipo = "Saúde"
        break
      case "5": d.tipo = "Transporte"
        break

    }

    linha.insertCell(1).innerHTML = d.tipo
    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = d.valor

    let btn = document.createElement("button")
    btn.className = "btn btn-danger"
    btn.innerHTML = "<i class='fas fa-times'></i>"
    btn.id = `idDespesa${d.id}`
    btn.onclick = function() {
      let id = this.id.replace("idDespesa", "")

      bd.remover(id)

      pesquisaDespesa()
    }

    linha.insertCell(4).appendChild(btn)
  })
}

function pesquisaDespesa() {
  let ano = document.getElementById("ano").value
  let mes = document.getElementById("mes").value
  let dia = document.getElementById("dia").value
  let tipo = document.getElementById("tipo").value
  let descricao = document.getElementById("descricao").value
  let valor = document.getElementById("valor").value

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

  let despesas = bd.pesquisar(despesa)

  this.carregaListaDespensas(despesas, true)
}