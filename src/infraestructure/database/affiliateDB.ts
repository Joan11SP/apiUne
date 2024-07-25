import { Injectable } from "@nestjs/common";
import { RegisterAffiliateDto } from "src/application/afiliation/registerAffiliate/registerAffiliateDto";
import { RespuestaProcesos } from "src/application/common/Model/respuestaProcesos";
import { ConnectionDB } from "./ConnectionDB";
import { PoolConnection } from "mysql2/promise";
import { MetodosGenericos } from "src/application/common/utils/metodos_genericos";
import { IAffiliateDB } from "src/application/common/Interfaces/IAffiliateDB";
import { GetParishCantonDto } from "src/application/afiliation/getParishCanton/getParishCantonDto";


@Injectable()
export class AffiliateDB implements IAffiliateDB
{
    private readonly db: ConnectionDB;
    private nameClass = "AffiliateDB";
    constructor() { this.db = ConnectionDB.getInstance(); }

    /**
     * Validar existencia de usuario
     * @param identification 
     * @returns 
     */
    validateAffiliate = async (identification: string) =>
    {
        let response = new RespuestaProcesos();
        let client: PoolConnection;
        try
        {
            client = await this.db.getConnection();
            let sqlGetPerson = `select count(1) as total from persons where identification = ?;`;

            let rowsPerson = await client.query(sqlGetPerson, [ identification ] );

            if(rowsPerson[0][0].total > 0)
            {
                response.code = 'COD_ERR_USR_EXISTS';
                response.info = 'La persona ya se encuentra registrada.'
            }

            client.release();            
        }
        catch (error)
        {
            client.release();
            response.code = 'COD_ERR_DB';
            response.info = 'Error inesperado, intente más tarde.';
            response.msgErr = error + `${this.nameClass}.validateAffiliate`;
        }
        return response;
    }

    /**
     * Registrar afiliado
     * @param request 
     * @returns 
     */
    registerAffiliate = async (request: RegisterAffiliateDto, idFile: string) =>
    {
        let response = new RespuestaProcesos();
        let client: PoolConnection;
        let transaction = false;
        try
        {
            let sqlAddPerson = `insert into persons (idPerson,identification,names,fathersLastName,mothersLastName,gender,email,phone,landlineTelephone,address,province,canton,parish) values (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            let sqlAddWork = `insert into workInstitutions (idWorkInstitution,personId,name,district,canton,province,email,phone) values (?,?,?,?,?,?,?,?);`;
            let sqlAccount = `insert into accounts (idAccount,personId,institution,numAccount,type) values (?,?,?,?,?);`;

            let idPerson = await MetodosGenericos.getUuid();
            let idWorkInstitution = await MetodosGenericos.getUuid();
            let idAccount = await MetodosGenericos.getUuid();

            let person = request.person;
            let work = request.workInstitution;
            let account = request.account;
            client = await this.db.getConnection();
            await client.beginTransaction();

                transaction = true;
                await client.query(sqlAddPerson, [ idPerson, person.identification, person.names, person.fathersLastName, person.mothersLastName, person.gender, person.email, person.phone, person.landlineTelephone, person.address, person.province, person.canton, person.parish ]);
                await client.query(sqlAddWork, [ idWorkInstitution, idPerson, work.name, work.district, work.canton, work.province, work.email, work.phone ]);
                await client.query(sqlAccount, [ idAccount, idPerson, account.institution, account.numAccount, account.type ]);

            await client.commit();

            client.release();
        }
        catch (error)
        {
            if(transaction) await client.rollback();

            client.release();
            response.code = 'COD_ERR_DB';
            response.info = 'Error inesperado, intente más tarde.';
            response.msgErr = error + `${this.nameClass}.registerAffiliate`;
        }
        return response;
    }

    /**
     * Obtener catalogos para registrar afiliacion
     * @returns 
     */
    getCatalogs = async () =>
    {
        let response = new RespuestaProcesos();
        let client: PoolConnection;
        try
        {
            client = await this.db.getConnection();

            let sqlGetTpyesAccounts = `select nameGroup, nameUnique name, value from catalogs c where nameGroup in('TYPE_ACCOUNTS', 'PROVINCE');`;

            let rowsCatalogs:any = await client.query(sqlGetTpyesAccounts);

            let province = rowsCatalogs[0].filter(e => e.nameGroup == 'PROVINCE');
            let typeAccount = rowsCatalogs[0].filter(e => e.nameGroup == 'TYPE_ACCOUNTS');

            response.result = { typeAccount, province };
            
            client.release();
        }
        catch (error)
        {
            client.release();
            response.code = 'COD_ERR_DB';
            response.info = 'Error inesperado, intente más tarde.';
            response.msgErr = error + `${this.nameClass}.getCatalogs`;
        }
        return response;
    }

    /**
     * Obtener parroquias o provincia
     * @returns 
     */
    getParsihCaton = async (request: GetParishCantonDto) =>
    {
        let response = new RespuestaProcesos();
        let client: PoolConnection;
        try
        {
            client = await this.db.getConnection();

            let sqlGetTpyesAccounts = `select nameUnique name, value from catalogs c where description = ?;`;

            let rowsCatalogs:any = await client.query(sqlGetTpyesAccounts, [request.valueSearch]);

            response.result = rowsCatalogs[0];
            
            client.release();
        }
        catch (error)
        {
            client.release();
            response.code = 'COD_ERR_DB';
            response.info = 'Error inesperado, intente más tarde.';
            response.msgErr = error + ` ${this.nameClass}.getCatalogs`;
        }
        return response;
    }
}
