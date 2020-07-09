const selectUf = document.querySelector('#uf');
const selectCity = document.querySelector('#city');

const cepField = document.querySelector('#cep');

const neighborhoodField = document.querySelector('#neighborhood');
const addressField = document.querySelector('#address');

window.onload = async () => setUFs();

selectUf.onchange = async () => {
  const uf = selectUf.value;
  updateCities(uf);
};

cepField.onchange = async () => {
  const cep = cepField.value;
  if (cep.length === 8) {
    const cepInfos = await fetch(
      `https://viacep.com.br/ws/${cep}/json/`
    ).then(res => res.json());
    addressField.value = cepInfos.logradouro;
    neighborhoodField.value = cepInfos.bairro;

    await updateCities(cepInfos.uf);

    selectUf.value = cepInfos.uf;
    selectCity.value = cepInfos.localidade;
  }
};

async function setUFs() {
  const ufs = await fetch(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
  ).then(res => res.json());

  const ufSorted = ufs.sort((a, b) => (a.sigla > b.sigla ? 1 : -1));

  selectUf.innerHTML =
    '<option value="">Selecione seu Estado</option>' +
    ufSorted.map(({ sigla }) => `<option value="${sigla}">${sigla}</option>`);
}

async function updateCities(uf) {
  selectCity.innerHTML = '<option value="">Selecione sua cidade</option>';

  const cities = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
  ).then(res => res.json());

  selectCity.innerHTML += cities.map(
    ({ nome }) => `<option value="${nome}">${nome}</option>`
  );
}
