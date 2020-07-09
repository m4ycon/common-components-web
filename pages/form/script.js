const selectUf = document.querySelector('#uf');
const selectCity = document.querySelector('#city');

const cepField = document.querySelector('#cep');

window.onload = async () => {
  const ufs = await fetch(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
  ).then(res => res.json());

  const ufSorted = ufs.sort((a, b) => (a.sigla > b.sigla ? 1 : -1));

  selectUf.innerHTML =
    '<option value="">Selecione seu Estado</option>' +
    ufSorted.map(({ sigla }) => `<option value="${sigla}">${sigla}</option>`);
};

selectUf.onchange = async () => {
  const uf = selectUf.value;
  const cities = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
  ).then(res => res.json());

  selectCity.innerHTML =
    '<option value="">Selecione sua cidade</option>' +
    cities.map(({ nome }) => `<option value="${nome}">${nome}</option>`);
};
