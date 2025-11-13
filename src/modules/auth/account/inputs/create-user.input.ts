import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsNotEmpty, MinLength, Matches } from "class-validator";

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-z0-9]+(?:-[a-zA-Z0-9]+)*$/)
  public username: string;

  @Field()
  public email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string;
}