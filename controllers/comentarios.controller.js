const { v4: uuidv4 } = require('uuid');
const usuariosController = require('./usuarios.controller');
const publicacionesController = require('./publicaciones.controller');


const comentarios = [
    {
        id: '63e923bb-8594-4661-9ed1-137b3777d0e7',
        comentario: 'uno',
        publicacion_id: '4c5c952b-0f2c-4813-bd11-c1036f391c56',
        usuarios_id: 'aeb3dc2e-4577-4d89-9129-3516705e913e'
    },
    {
        id: 'b380661d-cb45-4dd5-999a-2701b78bf181',
        comentario: 'dos',
        publicacion_id: '4c5c952b-0f2c-4813-bd11-c1036f391c56',
        usuarios_id: 'aeb3dc2e-4577-4d89-9129-3516705e913e'
    },
    {
        id: '62b33cde-a654-41eb-9582-6546b2dabf97',
        comentario: 'tres',
        publicacion_id: 'fbbaf204-268f-4a6c-a702-6158f5ec21a5',
        usuarios_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    }
]

class ComentariosController {
    async ingresarComentario(comentario, publicacion_id, usuarios_id) {
        return new Promise(async (resolve, reject) => {
            const id = uuidv4();

            await usuariosController.existeUsuario(usuarios_id)
                .then(v => v)
                .catch(r => reject({ message: 'No existe el usuario' }));

            comentarios.push({ id, comentario, publicacion_id, usuarios_id });

            resolve({
                id,
                message: 'Comentario registrado satisfactoriamente'
            });
        });
    }

    async mostrarComentariosPorPublicacion(publicacion_id) {
        return new Promise(async (resolve, reject) => {
            const comentarios_pub = [];

            for (const comentario of comentarios) {
                const { publicacion_id: id } = comentario;

                if (id === publicacion_id) {
                    comentarios_pub.push(comentario);
                }
            }

            if (comentarios_pub.length) {
                resolve(comentarios_pub);
            } else {
                reject({ message: 'Esta publicacion no tiene comentarios' });
            }
        });
    }

    async eliminarComentariosPorPublicacion(publicacion_id) {
        return new Promise(async (resolve, reject) => {
            for (const comentario of comentarios) {
                const { publicacion_id: pub } = comentario;

                if (pub === publicacion_id) {
                    comentarios.splice(comentarios.indexOf(comentario), 1);
                }
            }

            resolve({ message: 'Comentarios eliminados satisfactoriamente' });
        });
    }
}

module.exports = new ComentariosController();
