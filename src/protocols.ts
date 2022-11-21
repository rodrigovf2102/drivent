export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,
};

export type AddressEnrollment = {
  logradouro: string,
  complemento: string,
  bairro: string,
  cidade: string,
  uf: string,
  error?: string
}

export type RequestError = {
  status: number,
  data: object | null,
  statusText: string,
  name: string,
  message: string,
};

export type AddressFromCep = {
  logradouro: string,
  complemento: string,
  bairro: string,
  cidade: string,
  uf: string
}

export type AddressFromCepEntity = {
  cep: string,
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,
  ibge: string,
  gia: string,
  ddd: string,
  siafi: string
}

export type CardData = {
  issuer: string,
  number: string,
  name: string,
  expirationDate: Date,
  cvv: string
}

export type PaymentPost = {
  ticketId: number,
  cardData: CardData
}

export type Payment = {
  id: number
  ticketId: number
  value: number
  cardIssuer: string
  cardLastDigits: string
  createdAt?: Date | string
  updatedAt?: Date | string
}
