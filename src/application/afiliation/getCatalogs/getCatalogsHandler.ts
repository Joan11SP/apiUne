import { HeadersHttp } from "src/application/common/Model/headers";
import { RespuestaProcesos } from "src/application/common/Model/respuestaProcesos";

import { IAffiliateDB } from "../../common/Interfaces/IAffiliateDB";
import { Inject } from "@nestjs/common";

export class GetCatalogsHandler
{
    constructor(@Inject('IAffiliateDB') private readonly IAffiliateDB: IAffiliateDB) { }

    handle = async (request: any, headers: HeadersHttp) =>
    {
        let response = new RespuestaProcesos();
        try
        {
            response = await this.IAffiliateDB.getCatalogs();
        } 
        catch (error)
        {
            console.log(error);            
        }
        return response;
    }
}