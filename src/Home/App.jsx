import axios from "axios"
import { useEffect, useState } from "react"
import "./App.css"
import { BsFillCheckCircleFill } from "react-icons/bs"
import { AiFillGithub } from "react-icons/ai"

function App() {
  const [cep, setCep] = useState(0)
  const [dataRegion, setDataRegion] = useState([])
  
  function handleChange(event) {
    setCep(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    fetchData()

    event.target.value = "Coloque seu CEP aqui"
  }

  useEffect(() => {
    fetchData()
    setDataRegion([])
  }, [])

  async function fetchData() {
    if (cep === 0) {
      return
    }

    if (cep.includes("-")) {
      cep.replace("-", "")
    }

    try {
      const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      const data = res.data

      if (data.erro) {
        setDataRegion([
          {
            error: "Este CEP não foi encontrado no banco de dados",
          },
        ])
        return
      }

      setDataRegion([
        {
          burgh: data.bairro,
          city: data.localidade,
          address: data.logradouro,
          state: data.uf,
          ddd: data.ddd,
          cep: data.cep,
        },
      ])
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setDataRegion([
          {
            error: "Excedeu o limite de caracteres.",
          },
        ])
      } else {
        setDataRegion([
          {
            error: "Houve um problema ao tentar buscar o seu CEP, tente novamente",
          },
        ])
      }
    }
  }

  return (
    <div id="container">
      <header>
        <h1>BuscandoCEP</h1>
      </header>

      <main>
        <section className="searchcep">
          <h2>Busque seu CEP</h2>
          <p>Busque seu CEP facilmente e muito rápido!</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              onChange={(e) => handleChange(e)}
              placeholder="Seu CEP aqui!"
              maxLength={9}
            />

            <button className="submit" type="submit">
              <BsFillCheckCircleFill size={40} color="rgba(0, 0, 0, 0.6)" />
            </button>
          </form>
        </section>

        <section className="data-region">
          {dataRegion.length > 0 && !dataRegion[0].error ? (
            dataRegion.map((region) => (
              <ul id="region" key={region.cep}>
                <li>
                  <strong>Rua:</strong> {region.address || "Não foi encontrada"}
                </li>
                <li>
                  <strong>Cidade:</strong> {region.city || "Não foi encontrada"}
                </li>
                <li>
                  <strong>DDD:</strong> {region.ddd || "Não foi encontrado"}
                </li>
                <li>
                  <strong>Estado:</strong>{" "}
                  {region.state || "Não foi encontrado"}
                </li>
                <li>
                  <strong>CEP:</strong> {region.cep || "Não foi encontrado"}
                </li>
              </ul>
            ))
          ) : (
            <div className="errorCEP">
              {dataRegion.length > 0 ? dataRegion[0].error : ""}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>
          este projeto foi feito com afins de práticar, by: yukz (josefrocha)
        </p>
        <a href="https://github.com/josefrocha" target="_blank">
          <AiFillGithub size={25} />
        </a>
      </footer>
    </div>
  )
}

export default App
