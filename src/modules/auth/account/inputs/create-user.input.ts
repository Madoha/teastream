import { InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
  public username: string;
}