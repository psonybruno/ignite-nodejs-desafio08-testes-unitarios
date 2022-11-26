import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("User Profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should return a user profile", async () => {
    const user = {
      name: "Usuário Teste",
      email: "usuario@email.com.br",
      password: "12345678"
    }
    await createUserUseCase.execute(user);
    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    const result = await showUserProfileUseCase.execute(authenticatedUser.user.id!);
    expect(result).toHaveProperty("name");
  });

  it("Should not return a nonexistent user profile", async () => {

    expect(async () => {
      const user = {
        name: "Usuário Teste",
        email: "usuario@email.com.br",
        password: "12345678"
      }
      await createUserUseCase.execute(user);
      await showUserProfileUseCase.execute("");
    }).rejects.toBeInstanceOf(ShowUserProfileError);

  })

})
