## Description

Afiliación UNE

## Stay in touch

- Author - Joan Sebastian Peña
- Email - [gmail](joanspena.11@gmail.com)

## License

Nest is [MIT licensed](LICENSE).

## Debug

- crear archivo .vscode al nivel de la carpeta src
- añadir ./vscode/launch.json
- dentro del archivo luanch.json añadir lo siguiente:

{
    
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Nest.js",
            "args": [
                "${workspaceFolder}/src/main.ts"
            ],
            "runtimeArgs": [
                "-r",
                "ts-node/register",
                "-r",
                "tsconfig-paths/register"
            ],
            "autoAttachChildProcesses": true
        }
    ]
}