import { RespuestaProcesos } from "../../Model/respuestaProcesos";

export interface ICloudinarySrv
{
    sendFile(file: any, publicId: string): Promise<RespuestaProcesos>;
}