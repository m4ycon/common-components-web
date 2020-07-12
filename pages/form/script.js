const nameField = document.querySelector('#name');

const cpfField = document.querySelector('#cpf');
const cepField = document.querySelector('#cep');

const emailField = document.querySelector('#email');
const phoneNumberField = document.querySelector('#phone-number');

const passwordField = document.querySelector('#password');
const passwordConfirmField = document.querySelector('#password-confirm');
const passwordEyeBtn = document.querySelector('.password-eye');

const birthField = document.querySelector('#birth');

const neighborhoodField = document.querySelector('#neighborhood');
const addressField = document.querySelector('#address');
const numberAddressField = document.querySelector('#number-address');

const selectUf = document.querySelector('#uf');
const selectCity = document.querySelector('#city');

const form = document.querySelector('form');

window.onload = async () => setUFs();

selectUf.onchange = async () => {
  const uf = selectUf.value;
  updateCities(uf);
};

cepField.oninput = async () => {
  formatCep(cepField);
  const cep = cepField.value.replace(/\D/g, '');

  if (cep.length === 0) cleanAddress();
  if (cep.match(/\d{5}-?\d{3}/)) {
    const cepInfos = await fetch(
      `https://viacep.com.br/ws/${cep}/json/`
    ).then(res => res.json());

    if (cepInfos.erro) return cleanAddress();
    updateAddress(cepInfos);
  }
};

cpfField.oninput = () => {
  formatCpf(cpfField);
  const cpf = cpfField.value.replace(/\D/g, '');
};

phoneNumberField.oninput = () => {
  formatPhoneNumber(phoneNumberField);
  const phoneNumber = phoneNumberField.value.replace(/\D/g, '');
};

birthField.oninput = () => {
  formatToDate(birthField);
  const birth = birthField.value.replace(/\D/g, '');
};

passwordEyeBtn.onclick = e => {
  e.preventDefault();
  const [notSee, see] = passwordEyeBtn.children;
  notSee.classList.toggle('hidden');
  see.classList.toggle('hidden');

  passwordField.type === 'password'
    ? (passwordField.type = passwordConfirmField.type = 'text')
    : (passwordField.type = passwordConfirmField.type = 'password');
};

passwordConfirmField.oninput = () => passwordDiffers();

form.onsubmit = e => {
  e.preventDefault();
  const data = {
    name: nameField.value.trim(),
    cpf: cpfField.value.replace(/\D/g, ''),
    email: emailField.value.trim(),
    phoneNumber: phoneNumberField.value.replace(/\D/g, ''),
    password: passwordDiffers() ? null : passwordField.value,
    birth: birthField.value.trim(),
    cep: cepField.value.replace(/\D/g, ''),
    neighborhood: neighborhoodField.value.trim(),
    address: addressField.value.trim(),
    numberAddress: numberAddressField.value.trim(),
    uf: selectUf.value,
    city: selectCity.value,
  };

  if (!data.password) throw new Error('Senha inválida');
  if (!data.uf) throw new Error('Selecione um Estado');
  if (!data.city) throw new Error('Selecione uma cidade');

  console.log(data);
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

function passwordDiffers() {
  passwordField.value !== passwordConfirmField.value
    ? (passwordConfirmField.style.backgroundColor = 'rgba(255,0,0,0.05)')
    : (passwordConfirmField.style.backgroundColor = 'white');
  return passwordField.value !== passwordConfirmField.value;
}

function formatCep(cep) {
  // 12345-678
  cep.value = cep.value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d{1,3})/, '$1-$2')
    .replace(/(-\d{3})\d/, '$1');
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
  phoneNumber.value = phoneNumber.value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(\d{4})-(\d{4})/, '$1-$2')
    .replace(/(\d{4})-(\d{1})(\d{4})/, '$1$2-$3')
    .replace(/(-\d{4})\d/, '$1');
}

function formatToDate(date) {
  date.value = date.value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\/\d{4})\d/, '$1');
}
