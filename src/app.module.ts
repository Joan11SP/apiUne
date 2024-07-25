import { Module } from '@nestjs/common';
import { ServiceLocator } from './application/common/utils/serviceLocator';
import { ApiLogs } from './infraestructure/apis/apiLogs';
import { ServicioHttp } from './infraestructure/Common/Http/servicioHttp';
import { UneController } from './interface/controller/une.controller';
import { RegisterAffiliateHandler } from './application/afiliation/registerAffiliate/registerAffiliateHander';
import { AffiliateDB } from './infraestructure/database/affiliateDB';
import { GetCatalogsHandler } from './application/afiliation/getCatalogs/getCatalogsHandler';
import { GetParishCantonHandler } from './application/afiliation/getParishCanton/getParishCantonHandler';
import { CloudinarySrv } from './infraestructure/services/cloudinarySrv';

@Module(
  {
    providers:
      [
        ServiceLocator,
        RegisterAffiliateHandler,
        GetCatalogsHandler,
        GetParishCantonHandler,
        { provide: 'IServicioHttp', useClass: ServicioHttp },
        { provide: 'IApiLogs', useClass: ApiLogs },
        { provide: 'IAffiliateDB', useClass: AffiliateDB },
        { provide: 'ICloudinarySrv', useClass: CloudinarySrv }
      ],
    controllers:
      [
        UneController
      ]
  }
)
export class AppModule
{

  constructor
    (
      private readonly serviceLocator: ServiceLocator,
      private readonly RegisterAffiliateHandler: RegisterAffiliateHandler,
      private readonly GetCatalogsHandler: GetCatalogsHandler,
      private readonly GetParishCantonHandler: GetParishCantonHandler
    )
  {
    this.serviceLocator.register('RegisterAffiliateHandler', this.RegisterAffiliateHandler);
    this.serviceLocator.register('GetCatalogsHandler', this.GetCatalogsHandler);
    this.serviceLocator.register('GetParishCantonHandler', this.GetParishCantonHandler);
  }

}
