import os from 'os';


function getPrivateIP() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const networkInterface = interfaces[interfaceName];
        for (const iface of networkInterface) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'No se encontró la IP privada';
}

export default getPrivateIP