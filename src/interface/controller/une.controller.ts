import { Body, Controller, Post, Headers, ValidationPipe, UsePipes, HttpCode, UploadedFile, UseInterceptors, UploadedFiles } from "@nestjs/common";
import { RegisterAffiliateDto } from "src/application/afiliation/registerAffiliate/registerAffiliateDto";
import { MetodosGenericos } from "src/application/common/utils/metodos_genericos";
import { ServiceLocator } from "src/application/common/utils/serviceLocator";
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@UsePipes(new ValidationPipe())
@Controller('/api/une')
export class UneController
{
    constructor (private readonly serviceLocator: ServiceLocator) {}

    @HttpCode(200)
    @Post('/registerAffiliate')
    @UseInterceptors(FilesInterceptor('files', 3))
    async registerAffiliate(@UploadedFiles() files: any, @Body() body: any, @Headers() headers): Promise<any>
    {
        body = await MetodosGenericos.getDatosSolicutd('REGISTER_AFFILIATE', headers, JSON.parse(body.data));
        return await this.serviceLocator.resolve('RegisterAffiliateHandler').handle(body, headers, files);
    }

    @HttpCode(200)
    @Post('/getCatalogs')
    async getCatalogs(@Body() body: any, @Headers() headers): Promise<any>
    {
        body = await MetodosGenericos.getDatosSolicutd('GET_CATALOGS', headers, body);
        return await this.serviceLocator.resolve('GetCatalogsHandler').handle(body, headers);
    }

    @HttpCode(200)
    @Post('/getParishCanton')
    async getParishCanton(@Body() body: any, @Headers() headers): Promise<any>
    {
        body = await MetodosGenericos.getDatosSolicutd('GET_PARISH_CANTON', headers, body);
        return await this.serviceLocator.resolve('GetParishCantonHandler').handle(body, headers);
    }

}

