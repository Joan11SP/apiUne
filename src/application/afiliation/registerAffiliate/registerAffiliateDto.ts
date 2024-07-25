import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class RegisterAffiliateDto
{
    person: Person;
    workInstitution:WorkInstitution;
    account:Account;
}

export class Person
{
    @IsString()
    @IsNotEmpty()
    identification: string;

    @IsString()
    @IsNotEmpty()
    names: string;

    @IsString()
    @IsNotEmpty()
    fathersLastName: string;
    mothersLastName: string;

    gender: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;
    landlineTelephone: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    province: number;

    @IsNumber()
    canton: number;

    @IsNumber()
    parish: number
}

export class WorkInstitution
{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    district: number;

    @IsNumber()
    canton: number;

    @IsNumber()
    province: number;

    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    phone: string;
}

export class Account
{
    @IsNumber()
    institution: number;

    @IsString()
    @IsNotEmpty()
    numAccount: string;

    @IsNumber()
    type: number
}