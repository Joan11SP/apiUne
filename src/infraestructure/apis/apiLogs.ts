import { Inject, Injectable } from "@nestjs/common";
import { IServicioHttp } from "../Common/Http/IServicioHttp";
import { IApiLogs } from "src/application/common/Interfaces/apis/IApiLogs";

@Injectable()
export class ApiLogs implements IApiLogs
{
    private name_db = "api_authentication";
    constructor(@Inject('IServicioHttp') private servicioHttp: IServicioHttp) { }

    async addSolicitud(solicitud: any)
    {
        try
        {
            let data =
            {
                name_db: this.name_db,
                collection: 'request',
                object: {...solicitud}
            }
        }
        catch (error)
        {
            console.log('log sol: ' + error);
        }
    }

    async addRespuesta(respuesta: any)
    {
        try
        {
            let data =
            {
                name_db: this.name_db,
                collection: 'response',
                object: {...respuesta}
            };
        } 
        catch (error)
        {
            console.log('log res: ' + error);
        }
    }




}