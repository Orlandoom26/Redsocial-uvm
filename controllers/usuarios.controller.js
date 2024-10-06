const { v4: uuidv4 } = require('uuid');

const usuarios = [
    {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        nombre: 'Uno',
        apellido: 'Uno',
        correo: 'uno@yopmail.com',
        usuario: 'unoYopmail',
        edad: 18,
        amistades: [
            '2b95542d-496f-4ece-af14-72ff84fa2f6e',
            'aeb3dc2e-4577-4d89-9129-3516705e913e'
        ],
        solicitudes: []
    },
    {
        id: '2b95542d-496f-4ece-af14-72ff84fa2f6e',
        nombre: 'Uno',
        apellido: 'Uno',
        correo: 'uno1@yopmail.com',
        usuario: 'unoYopmail',
        edad: 18,
        amistades: [
            '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        ],
        solicitudes: []
    },
    {
        id: 'aeb3dc2e-4577-4d89-9129-3516705e913e',
        nombre: 'Uno',
        apellido: 'Uno',
        correo: 'uno2@yopmail.com',
        usuario: 'unoYopmail',
        edad: 18,
        amistades: [
            '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        ],
        solicitudes: []
    },
]

class UsuariosController {
    async ingresarUsuario(nombre, apellido, correo, usuario, edad) {
        return new Promise((resolve, reject) => {
            const expEmail = new RegExp('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}');
            const id = uuidv4();

            for (const { correo: correoUsu } of usuarios) {
                if (correoUsu === correo) reject({ message: 'El correo ya esta registrado' });
            }

            if (edad < 18) reject({ message: 'Debe ser mayor de edad' });
            if (!expEmail.test(correo)) reject({ message: 'El correo es inválido' });

            usuarios.push({
                id, nombre, apellido, correo, usuario, edad,
                amistades: [],
                solicitudes: []
            });

            resolve({
                id, 
                message: 'Usuario registrado satisfactoriamente'
            });
        });
    }

    async enviarSolicitud(usuarioId, amigoId) {
        return new Promise((resolve, reject) => {
            if (usuarioId === amigoId) {
                reject({ message: 'Errores en los datos' });
            } else {
                for (const { id } of usuarios) {
                    if (usuarioId === id) {
                        for (const { id: id_amigo, solicitudes, amistades } of usuarios) {
                            for (const solicitud of solicitudes) {
                                if (solicitud === usuarioId) {
                                    reject({ message: 'La solicitud ya fue enviada' });
                                }
                            }

                            if (id_amigo === amigoId) {
                                if (amistades.includes(usuarioId)) {
                                    reject({ message: 'Ya son amigos' });
                                }

                                solicitudes.push(usuarioId);
                                resolve({ message: 'Solicitud enviada satisfactoriamente' });
                            }
                        }
                    }
                }
    
                reject({ message: 'Errores en los datos' });
            }
        });
    }

    async editarUsuario(id, nombre, apellido, correo, edad, usuario) {
        return new Promise((resolve, reject) => {
            for (const { correo: correoUsu } of usuarios) {
                if (correo === correoUsu) {
                    resolve({ message: 'El correo ya se encuentra registrado' });
                }
            }

            for (const usu of usuarios) {
                if (usu.id === id) {
                    usu.nombre = nombre;
                    usu.apellido = apellido;
                    usu.correo = correo;
                    usu.edad = edad;
                    usu.usuario = usuario;

                    resolve({ message: 'Usuario modificado satisfactoriamente' });
                }
            }

            reject({ message: 'El usuario no existe' });
        });
    }

    async responderSolicitud(id, amigo_id, respuesta) {
        return new Promise((resolve, reject) => {
            for (const { id: usuario_id, amistades: usuario_amistades } of usuarios) {
                if (id === usuario_id) {
                    for (const { id: amigo, solicitudes: amigo_solicitudes, amistades: amigo_amistades } of usuarios) {
                        if (amigo === amigo_id) {
                            if (amigo_solicitudes.includes(id)) {
                                amigo_solicitudes.splice(amigo_solicitudes.indexOf(id), 1);

                                if (respuesta) {
                                    usuario_amistades.push(amigo);
                                    amigo_amistades.push(id);
                                }

                                resolve({ message: 'Solicitud respondida' });
                            } else {
                                reject({ message: 'No se ha hecho la solicitud' });
                            }
                        }
                    }

                    reject({ message: 'No existe el usuario' });
                }
            }

            reject({ message: 'No existe el usuario' });
        });
    }

    async eliminarUsuario(id) {
        return new Promise((resolve, reject) => {
            for (const usuario of usuarios) {
                if (id === usuario.id) {
                    usuarios.splice(usuarios.indexOf(usuario), 1);

                    for (const { amistades, solicitudes } of usuarios) {
                        if (amistades.includes(usuario.id)) {
                            amistades.splice(amistades.indexOf(usuarios.id), 1);
                        }

                        if (solicitudes.includes(usuario.id)) {
                            solicitudes.splice(solicitudes.indexOf(usuario.id), 1);
                        }
                    }


                    resolve({ message: 'Usuario eliminado satisfactoriamente' });
                }
            }

            reject({ message: 'No existe el usuario' });
        });
    }

    async eliminarAmistad(usuario_id, amigo_id) {
        return new Promise((resolve, reject) => {
            if (usuario_id === amigo_id) {
                reject({ message: 'Error en los datos' });
            }

            for (const { id, amistades } of usuarios) {
                if (usuario_id === id) {
                    if (amistades.includes(amigo_id)) {
                        amistades.splice(amistades.indexOf(amigo_id), 1);
                    } else {
                        reject({ message: 'No son amigos' });
                    }
                }

                if (amigo_id === id) {
                    if (amistades.includes(usuario_id)) {
                        amistades.splice(amistades.indexOf(usuario_id), 1);
                    } else {
                        reject({ message: 'No son amigos' });
                    }
                }
            }

            resolve({ message: 'Amistad eliminada satisfactoriamente' });
        });
    }

    async existeUsuario(id) {
        return new Promise((resolve, reject) => {
            for (const { id: usuario_id } of usuarios) {
                if (id === usuario_id) {
                    resolve(true);
                }
            }

            reject(false);
        });
    }

    async mostrarUsuarios() {
        return new Promise((resolve, reject) => resolve(usuarios));
    }
}

module.exports = new UsuariosController();
