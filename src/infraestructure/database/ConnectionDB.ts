import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { Parametro } from '../Common/Model/parametro';

@Injectable()
export class ConnectionDB
{
    private static instance: ConnectionDB;
    private pool: mysql.Pool;
    public parametros: Parametro[];

    public constructor()
    {
        this.connect();
    }

    private async connect() 
    {
        this.pool = await mysql.createPool
        (
            {
                user: "root",
                host: "localhost",
                database: "une",
                password: "bruja12345#",
                port: 3306,
                connectionLimit: 50
            }
        );        
          
    }

    // abrir una unica conexion a mysql, patron singleton(no abre y cierra conexiones cada que se realiza una consulta)
    static getInstance(): ConnectionDB
    {
        if (!ConnectionDB.instance)
        {
            ConnectionDB.instance = new ConnectionDB();
        }
        return ConnectionDB.instance;
    }

    //* Obtener la conexion actual activa, si no existe se crea en ese momento
    async getConnection()
    {
        return this.pool.getConnection();
    }

    //* Obtener resultado en formato json, de un insert, update o delete

    static async getResultDB(rows: any)
    {
        let data_string = JSON.stringify(rows);

        return JSON.parse(data_string);
    }

    //* Obtener parametros cargados en memoria

    getParametrosUnico(busqueda: string): Parametro
    {
        return this.parametros.find(e => e.nom_unico == busqueda);
    }

    getParametrosGrupo(busqueda: string): Parametro[]
    {
        return this.parametros.filter(e => e.nom_grupo == busqueda);
    }
    getParametrosPorValor(busqueda: string, servicio_id: number = null, entidad_id: number = null, tipo_valor:string = 'valor')
    {
        if(servicio_id == null)
            return this.parametros.find(e => e[tipo_valor] == busqueda);
    
        return this.parametros.find(e => e[tipo_valor] == busqueda && e.servicio_id == servicio_id && e.entidad_id == entidad_id);            
    }
    getParametroIfi(busqueda: string, entidad_id: number)
    {
        return this.parametros.find(e => e.nom_unico == busqueda && e.entidad_id == entidad_id);            
    }
}