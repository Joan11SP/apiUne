import { IsNotEmpty, isNotEmpty, IsString } from "class-validator";

export class GetParishCantonDto
{
    @IsString()
    @IsNotEmpty()
    typeSearch: string;

    @IsString()
    @IsNotEmpty()
    valueSearch: string;
}