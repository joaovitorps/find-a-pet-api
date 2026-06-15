export interface AddressProps {
  number: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
}

export class Address {
  public readonly number: string;
  public readonly street: string;
  public readonly neighborhood: string;
  public readonly city: string;
  public readonly state: string;
  public readonly complement?: string;

  constructor({
    number,
    street,
    neighborhood,
    city,
    state,
    complement,
  }: AddressProps) {
    if (!number || !street || !city || !neighborhood || !state) {
      throw new Error("Address is incomplete");
    }

    this.number = number;
    this.street = street;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;

    if (complement) {
      this.complement = complement;
    }
  }

  static create(props: AddressProps) {
    return new Address({ ...props });
  }
}
