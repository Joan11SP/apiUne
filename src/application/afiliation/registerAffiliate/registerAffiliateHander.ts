import { Inject, Injectable } from "@nestjs/common";
import { RegisterAffiliateDto } from "./registerAffiliateDto";
import { HeadersHttp } from "src/application/common/Model/headers";
import { RespuestaProcesos } from "src/application/common/Model/respuestaProcesos";
import { MetodosGenericos } from "src/application/common/utils/metodos_genericos";

import { IAffiliateDB } from "../../common/Interfaces/IAffiliateDB";
import { ICloudinarySrv } from "../../common/Interfaces/apis/ICloudinarySrv";
import { variables } from 'src/json/configuracion.json'

const path = require("path");
const archiver = require('archiver');
const {Readable, PassThrough} = require("stream");

@Injectable()
export class RegisterAffiliateHandler
{
    constructor
    (
        @Inject('IAffiliateDB') private readonly IAffiliateDB: IAffiliateDB,
        @Inject('ICloudinarySrv') private readonly ICloudinarySrv: ICloudinarySrv
    ) { }

    handle = async (request: RegisterAffiliateDto, headers: HeadersHttp, files) =>
    {
        let response = new RespuestaProcesos();
        try
        {
            response = await this.IAffiliateDB.validateAffiliate(request.person.identification);

            let pass = await this.compressFiles(files);
            response = await this.ICloudinarySrv.sendFile(pass, 'affilation');

            if(response.code != 'COD_OK')
                return response;
                  
            let idFile = await MetodosGenericos.getUuid();
            response = await this.IAffiliateDB.registerAffiliate(request, idFile);

        } 
        catch (error)
        {
            console.log(error);            
        }
        return response;
    }

    /**
     * Comprimir todos los archivos en uno solo
     * @param files 
     */
    private async compressFiles(files:any[])
    {
        let pass = new PassThrough();
        var archive2 = archiver('zip', { zlib: { level: 9 } });

        let buffers: {file:any, name: string}[] = [];

        for (let item of files)
        {            
            buffers.push({file: Buffer.from(item.buffer, 'utf-8'), name: path.extname(item.originalname).toLocaleLowerCase()})
        }

        // almacenar resultado
        archive2.pipe(pass);

        for(let item of buffers)
        {
            const bufferStream = new Readable();
            bufferStream.push(item.file);
            bufferStream.push(null);
            archive2.append(bufferStream, { name: item.name });
        }
        archive2.finalize();
        return pass;
    }
    
}
