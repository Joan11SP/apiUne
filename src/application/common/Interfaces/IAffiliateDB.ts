import { RegisterAffiliateDto } from "src/application/afiliation/registerAffiliate/registerAffiliateDto";
import { RespuestaProcesos } from "../Model/respuestaProcesos";
import { GetParishCantonDto } from "src/application/afiliation/getParishCanton/getParishCantonDto";

export interface IAffiliateDB
{
    registerAffiliate(request: RegisterAffiliateDto, idFile: string): Promise<RespuestaProcesos>;
    validateAffiliate(identification: string): Promise<RespuestaProcesos>;
    getCatalogs(): Promise<RespuestaProcesos>;
    getParsihCaton(request: GetParishCantonDto): Promise<RespuestaProcesos>;
}