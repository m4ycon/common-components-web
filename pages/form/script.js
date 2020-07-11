const selectUf = document.querySelector('#uf');
const selectCity = document.querySelector('#city');

const cepField = document.querySelector('#cep');
const cpfField = document.querySelector('#cpf');

const neighborhoodField = document.querySelector('#neighborhood');
const addressField = document.querySelector('#address');
const phoneNumberField = document.querySelector('#phone-number');

window.onload = async () => setUFs();

selectUf.onchange = async () => {
  const uf = selectUf.value;
  updateCities(uf);
};

cepField.oninput = async e => {
  const cep = cepField.value;
  formatCep(cepField);

  if (cep.length === 0) cleanAddress();
  if (cep.match(/\d{5}-?\d{3}/)) {
    const cepInfos = await fetch(
      `https://viacep.com.br/ws/${cep}/json/`
    ).then(res => res.json());

    if (cepInfos.erro) return cleanAddress();
    updateAddress(cepInfos);
  }
};

cpfField.oninput = e => {
  formatCpf(cpfField);
  const cpf = cpfField.value.replace(/\D/g, '');
};

phoneNumberField.onkeyup = e => {
  if (e.keyCode === 8) return;
  formatPhoneNumber(phoneNumberField);
  const phoneNumber = phoneNumberField.value.replace(/\D/g, '');
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

async function updateAddress(cepInfos) {
  addressField.value = cepInfos.logradouro;
  neighborhoodField.value = cepInfos.bairro;

  await updateCities(cepInfos.uf);
  selectUf.value = cepInfos.uf;
  selectCity.value = cepInfos.localidade;
}

function cleanAddress() {
  addressField.value = '';
  neighborhoodField.value = '';
  selectUf.value = '';
  selectCity.value = '';
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

function formatCep(cep) {
  // 12345-67
  cep.value = cep.value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d/, '$1');
}

function formatCpf(cpf) {
  // 123.456.789-01
  cpf.value = cpf.value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d/, '$1');
}

function formatPhoneNumber(phoneNumber) {
  const phoneNum = phoneNumber.value.replace(/\D/g, '');
  phoneNumber.value = phoneNum
    .split('')
    .map((n, i, arr) => {
      if (i === 0) return '(' + n;
      if (i === 1) return n + ') ';
      if ((i === 5 && arr.length === 10) || (i === 6 && arr.length === 11))
        return n + '-';
      return n;
    })
    .join('');
}
