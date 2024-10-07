const comentariosController = require("./comentarios.controller");
const usuariosController = require("./usuarios.controller");
const { v4: uuidv4 } = require('uuid');

const publicaciones = [
    {
        id: '4c5c952b-0f2c-4813-bd11-c1036f391c56',
        titulo: 'uno',
        url_multimedia: 'https://i.scdn.co/image/ab67616d0000b273b80f37385bd537d17f9be93a',
        descripcion: 'mejor album',
        usuario_id: '2b95542d-496f-4ece-af14-72ff84fa2f6e',
        fecha: '2018-06-24'
    },
    {
        id: 'fbbaf204-268f-4a6c-a702-6158f5ec21a5',
        titulo: 'uno',
        url_multimedia: 'https://i.scdn.co/image/ab67616d0000b273b80f37385bd537d17f9be93a',
        descripcion: 'mejor album',
        usuario_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        fecha: '2018-07-22'
    },
    {
        id: '4deb35b7-b0fa-4cd5-8f9f-d42d96ddad20',
        titulo: 'uno',
        url_multimedia: 'https://i.scdn.co/image/ab67616d0000b273b80f37385bd537d17f9be93a',
        descripcion: 'mejor album',
        usuario_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        fecha: '2018-07-23'
    },
    {
        id: '4c5c952b-0f2c-4813-bd11-c1036f391c56',
        titulo: 'uno',
        url_multimedia: 'https://i.scdn.co/image/ab67616d0000b273b80f37385bd537d17f9be93a',
        descripcion: 'mejor album',
        usuario_id: '2b95542d-496f-4ece-af14-72ff84fa2f6e',
        fecha: '2018-07-25'
    },
    {
        id: '4c5c952b-0f2c-4813-bd11-c1036f391c55',
        titulo: 'uno',
        url_multimedia: 'https://i.scdn.co/image/ab67616d0000b273b80f37385bd537d17f9be93a',
        descripcion: 'mejor album',
        usuario_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        fecha: '2018-07-24'
    }
];

class PublicacionesController {
    async ingresarPublicacion(titulo, url_multimedia, descripcion, usuario_id, fecha) {
        return new Promise(async (resolve, reject) => {
            await usuariosController.existeUsuario(usuario_id)
                .then(v => {
                    const patronURL = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i');
                    const id = uuidv4();
                    
                    if (!patronURL.test(url_multimedia)) reject({ message: 'URL invalida' });
                    if ((new Date(fecha)).toDateString() === 'Invalid Date') reject({ message: 'Fecha invalida' });

                    publicaciones.push({
                        id, titulo, url_multimedia, descripcion, usuario_id, fecha
                    });

                    resolve({
                        id,
                        message: 'Publicacion registrada satisfactoriamente'
                    });
                })
                .catch(v => reject({ message: 'No existe el usuario' }));
        });
    }

    async editarPublicacion(id, titulo, url_multimedia, descripcion, usuario_id, fecha) {
        return new Promise((resolve, reject) => {
            for (const publicacion of publicaciones) {
                if (id === publicacion.id) {
                    if (usuario_id === publicacion.usuario_id) {
                        publicacion.titulo = titulo;
                        publicacion.url_multimedia = url_multimedia;
                        publicacion.descripcion = descripcion;
                        publicacion.fecha = fecha;

                        resolve({ message: 'Publicacion modificada satisfactoriamente' });
                    } else {
                        reject({ message: 'Acceso denegado' });
                    }
                }
            }

            reject({ message: 'No existe la publicacion' });
        });
    }

    async mostrarPublicacionesPorUsuario(usuario_id) {
        return new Promise(async (resolve, reject) => {
            await usuariosController.existeUsuario(usuario_id)
                .then(v => {
                    const publicaciones_usu = [];

                    for (const publicacion of publicaciones) {
                        const { usuario_id: id } = publicacion;

                        if (id === usuario_id) {
                            publicaciones_usu.push(publicacion);
                        }
                    }

                    if (publicaciones_usu.length) {
                        resolve(publicaciones_usu);
                    } else {
                        reject({ message: 'El usuario no tiene publicaciones' });
                    }
                })
                .catch(v => reject({ message: 'No existe el usuario' }));
        });
    }
    
    async eliminarPublicacion(id) {
        return new Promise(async (resolve, reject) => {
            for (const publicacion of publicaciones) {
                if (id === publicacion.id) {
                    await comentariosController.eliminarComentariosPorPublicacion(id)
                        .then(v => v)
                        .catch(v => v);

                    publicaciones.splice(publicaciones.indexOf(publicacion), 1);

                    resolve({ message: 'Publicacion eliminada satisfactoriamente' });
                }
            }

            reject({ message: 'No existe la publicacion' });
        });
    }
    
    async mostrarUltimasPublicaciones() {
        return new Promise(async (resolve, reject) => {
            await usuariosController.mostrarUsuarios()
                .then(async usuarios => {
                    const ultimas = [];

                    for (const { id: usuario_id } of usuarios) {     
                        await this.mostrarPublicacionesPorUsuario(usuario_id)
                            .then(publicaciones => {
                                publicaciones.sort(({ fecha: fecha_a }, { fecha: fecha_b }) => {
                                    if (new Date(fecha_a) > new Date(fecha_b)) return -1;
                                    else if (new Date(fecha_a) < new Date(fecha_b)) return 1;
                                    else return 0;
                                });

                                ultimas.push({
                                    usuario: usuario_id,
                                    utlima_publicacion: publicaciones[0]
                                });
                            })
                            .catch(v => console.log(v));
                    }

                    resolve(ultimas);
                });
        });
    }

    async existePublicacion(id) {
        return new Promise((resolve, reject) => {
            for (const { id: publicacion_id } of publicaciones) {
                if (id === publicacion_id) {
                    resolve(true);
                }
            }

            reject(false);
        });
    }
}

module.exports = new PublicacionesController();
