export class customError extends Error {
  errorMessage?: string;
  status?: number;

  constructor(message?: string, errorMessage?: string, status?: number) {
    super(message);
    this.name = this.constructor.name;
    this.errorMessage = errorMessage;
    this.status = status;
  }
}

type Favourite = {
  color: string;
  food: string;
  drink: string;
  number: number;
};

class DataClass {
  favourite: Partial<Favourite> = {};

  constructor(favourite: Favourite) {
    this.favourite.color = favourite.color;
    this.favourite.food = favourite.food;
    this.favourite.drink = favourite.drink;
    this.favourite.number = favourite.number;
  }
}

type Greeting = 'Hei' | 'Moi' | 'Terve' | 'Moro';
export class GreetingClass extends DataClass {
  favourite!: Favourite;
  greeting: string;
  firstName: string = 'Aku';
  lastName: string = 'Ankka';

  constructor(
    favourite: Favourite,
    greeting: Greeting | (string & {}),
    {
      newFirstName,
      newLastName,
    }: {
      newFirstName?: string;
      newLastName?: string;
    },
  ) {
    super(favourite);
    this.greeting = greeting;
    if (newFirstName !== undefined) {
      this.firstName = newFirstName;
    }
    if (newLastName !== undefined) {
      this.lastName = newLastName;
    }
  }

  get getFirstName() {
    return this.firstName;
  }
  get getLastName() {
    return this.lastName;
  }
  setFirstName(newName: string) {
    this.firstName = newName;
  }
}
