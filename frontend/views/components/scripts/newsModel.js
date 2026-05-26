const container = document.getElementById("newsModelContainer")

function fullNotice(news) {
    return `
      <div class="notice">
        <a href="/noticias" class="btn-back">
            <i class="ph ph-arrow-left"></i> Voltar
        </a>

        <h2 class="title">${news.titulo}</h2>

        <span class="date"><strong>Editor: </strong>${news.nome_usuario} - <strong>Publicado em: </strong>${new Date(news.data_publicacao).toLocaleDateString('pt-BR')}</span>

        <div class="head">
          <p>${news.subtitulo}</p>

          <img src="${news.img_noticia}" alt="${news.titulo}" class="img" loading="lazy"/>
        </div>

        <div class="txt-notice">
            <p>${news.conteudo}</p>

            <p>Mais informações em: <a href="${news.fonte}" target="_blank">${news.fonte}</a></p>
        </div>
      </div>
    `
}

function renderNotice(notice) {
    const container = document.getElementById("newsModelContainer")

    if (!container) {
        console.error("Container da notícia não encontrado!")
        return
    }

    const html = fullNotice(notice)

    container.innerHTML = html
}

async function carregarNoticia() {
    try {
        const id =
            window.location.pathname
                .split("/")
                .pop()

        if (!id) {
            throw new Error("ID da notícia não encontrado")
        }

        const response = await fetch(`https://gamewired-api.duckdns.org/news/${id}`)

        if (!response.ok) {
            throw new Error("Notícia não encontrada")
        }

        const result = await response.json()

        const notice = result.data

        document.title = `GameWired | ${notice.titulo}`

        document
            .querySelector('meta[name="description"]')
            ?.setAttribute('content', notice.subtitulo)

        renderNotice(notice)
    } catch (error) {
        console.error(error)
    }
}

carregarNoticia()