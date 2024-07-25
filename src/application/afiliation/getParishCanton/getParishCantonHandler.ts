import { HeadersHttp } from "src/application/common/Model/headers";
import { RespuestaProcesos } from "src/application/common/Model/respuestaProcesos";

import { IAffiliateDB } from "../../common/Interfaces/IAffiliateDB";
import { Inject } from "@nestjs/common";
import { GetParishCantonDto } from "./getParishCantonDto";

export class GetParishCantonHandler
{
    constructor(@Inject('IAffiliateDB') private readonly IAffiliateDB: IAffiliateDB) { }

    handle = async (request: GetParishCantonDto, headers: HeadersHttp) =>
    {
        let response = new RespuestaProcesos();
        try
        {
            response = await this.IAffiliateDB.getParsihCaton(request);
        } 
        catch (error)
        {
            console.log(error);            
        }
        return response;
    }
}