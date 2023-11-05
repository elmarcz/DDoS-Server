function getTime(timestamp) {
    const date = new Date(timestamp);

    const hora = date.getHours();
    const minutos = date.getMinutes();
    const segundos = date.getSeconds();
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const anio = date.getFullYear();

    return `[${hora}:${minutos}h ${segundos}seg] [${dia}/${mes}/${anio}]`;
}

export default getTime;