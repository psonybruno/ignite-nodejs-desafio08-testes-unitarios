import { CreateUserUseCase } from "./CreateUserUseCase";
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('Should create a new user', async () => {
    const user = {
      name: "Usuário Teste",
      email: "usuario@email.com.br",
      password: "12345678"
    }
    const createdUser = await createUserUseCase.execute(user);
    expect(createdUser).toHaveProperty("id");
  });

  it('Should not create a new user if already exists', async () => {
    expect( async () => {
      const user = {
        name: "Usuário Teste",
        email: "usuario@email.com.br",
        password: "12345678"
      }
      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });

})
