import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ICloudinarySrv } from 'src/application/common/Interfaces/apis/ICloudinarySrv';
import { RespuestaProcesos } from 'src/application/common/Model/respuestaProcesos';


@Injectable()
export class CloudinarySrv implements ICloudinarySrv
{
    private nameClass = CloudinarySrv.name;
    private static cloudinaryMemory = null;
    constructor()
    {
        CloudinarySrv.setConfiguration();
    }

    static async setConfiguration()
    {
        if (this.cloudinaryMemory == null)
        {
            cloudinary.config(
                {
                    cloud_name: 'drnuwuvau',
                    api_key: '711216881839665',
                    api_secret: '8s8v3tLsAXSsERbdnCtZfb9Y10k'
                });
            this.cloudinaryMemory = true;
        }
    }

    /**
     * Guardar archivo en la nube
     * @param file 
     */
    async sendFile(file, publicId: string): Promise<RespuestaProcesos>
    {
        let response = new RespuestaProcesos();
        try
        {
            this.streamToBuffer(file, (err, buffer) =>
            {
                if (err)
                {
                    throw err;
                }

                cloudinary.uploader.upload_stream(
                    { resource_type: 'raw', filename_override:'1150' }, // Utiliza 'raw' para archivos no estándar como ZIP
                    (error, result) =>
                    {
                        if (error)
                        {
                            console.error('Error uploading to Cloudinary:', error);
                        } else
                        {
                            response.result = result;
                        }
                    }
                ).end(buffer);
            });
        }
        catch (error)
        {
            console.log(error);

            response.code = 'COD_ERR_SRV';
            response.info = 'Error en la carga de archivo, intenta más tarde.';
            response.msgErr = error + `${this.nameClass}.sendFile`;
        }
        return response;
    }
    private streamToBuffer(stream, callback)
    {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => callback(null, Buffer.concat(chunks)));
        stream.on('error', callback);
    }
}
