var express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const publicacionesController = require('../controllers/publicaciones.controller');
const comentariosController = require('../controllers/comentarios.controller');
var router = express.Router();


/* USUARIOS */
router.post('/usuario/registrar', async (req, res) => {
  const { nombre, apellido, correo, usuario, edad } = req.body;

  if (nombre && apellido && correo && usuario && edad) {
    await usuariosController.ingresarUsuario(nombre, apellido, correo, usuario, edad)
      .then(response => res.status(201).json(response))
      .catch(response => res.status(400).json(response));
  } else {
    res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
});

router.post('/usuario/solicitud', async (req, res) => {
  const { usuario_id, amigo_id } = req.body;

  if (usuario_id && amigo_id) {
    await usuariosController.enviarSolicitud(usuario_id, amigo_id)
      .then(response => res.status(200).json(response))
      .catch(response => res.status(400).json(response));
  } else {
    res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
});

router.put('/usuario/editar/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, usuario, edad } = req.body;

  if (nombre && apellido && correo && usuario && edad) {
    await usuariosController.editarUsuario(id, nombre, apellido, correo, edad, usuario)
      .then(response => res.status(200).json(response))
      .catch(response => res.status(400).json(response));
  } else {
    res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
});

router.post('/usuario/responder_solicitud', async (req, res) => {
  const { usuario_id, amigo_id, respuesta } = req.body;

  if (usuario_id && amigo_id && typeof(respuesta) === 'boolean') {
    await usuariosController.responderSolicitud(usuario_id, amigo_id, respuesta)
      .then(response => res.status(200).json(response))
      .catch(response => res.status(400).json(response));
  } else {
    res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
});

router.delete('/usuario/eliminar/:id', async (req, res) => {
  await usuariosController.eliminarUsuario(req.params.id)
    .then(response => res.status(200).json(response))
    .catch(response => res.status(400).json(response));
});

router.delete('/usuario/eliminar_amistad', async (req, res) => {
  const { usuario_id, amigo_id } = req.body;
  
  if (usuario_id && amigo_id) {
    await usuariosController.eliminarAmistad(usuario_id, amigo_id)
      .then(response => res.status(200).json(response))
      .catch(response => res.status(400).json(response));
  } else {
    res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
});


/* PUBLICACIONES */
router.post('/publicaciones/registrar', async (req, res) => {
  const { titulo, url_multimedia, descripcion, usuario_id, fecha } = req.body;

  if (titulo && url_multimedia && descripcion && usuario_id && fecha) {
    await publicacionesController.ingresarPublicacion(titulo, url_multimedia, descripcion, usuario_id, fecha)
      .then(response => res.status(201).json(response))
      .catch(response => res.status(400).json(response));
  } else {
    res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
});

router.put('/publicaciones/editar/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, url_multimedia, descripcion, usuario_id, fecha } = req.body;

  if (titulo && url_multimedia && descripcion && usuario_id && fecha) {
    await publicacionesController.editarPublicacion(id, titulo, url_multimedia, descripcion, usuario_id, fecha)
      .then(response => res.status(200).json(response))
      .catch(response => res.status(400).json(response));
  } else {
    res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
});

router.get('/publicaciones/usuario/:usuario_id', async (req, res) => {
  await publicacionesController.mostrarPublicacionesPorUsuario(req.params.usuario_id)
    .then(response => res.status(200).json(response))
    .catch(response => res.status(400).json(response));
});

router.delete('/publicaciones/eliminar/:id', async (req, res) => {
  await publicacionesController.eliminarPublicacion(req.params.id)
    .then(response => res.status(200).json(response))
    .catch(response => res.status(400).json(response));
});

router.get('/publicaciones/ultimas', async (req, res) => {
  await publicacionesController.mostrarUltimasPublicaciones()
    .then(response => res.status(200).json(response))
});


/* COMENTARIOS */
router.post('/comentarios/registrar', async (req, res) => {
  const { comentario, publicacion_id, usuario_id } = req.body;

  if (comentario && publicacion_id && usuario_id) {
    await comentariosController.ingresarComentario(comentario, publicacion_id, usuario_id)
      .then(response => res.status(201).json(response))
      .catch(response => res.status(400).json(response));
  } else {
    res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
});

router.get('/comentarios/publicacion/:publicacion_id', async (req, res) => {
  await comentariosController.mostrarComentariosPorPublicacion(req.params.publicacion_id)
    .then(response => res.status(200).json(response))
    .catch(response => res.status(400).json(response));
});


/* VISTAS */
router.get('/index', async (req, res) => {
  await usuariosController.mostrarUsuarios()
    .then(usuarios => res.render('index', { usuarios }));
});

router.get('/usuario/:id', async (req, res) => {
  await publicacionesController.mostrarPublicacionesPorUsuario(req.params.id)
    .then(publicaciones => res.render('publicaciones', { publicaciones, mensaje: '' }))
    .catch(mensaje => res.render('publicaciones', { mensaje }));
});

router.get('/publicacion/:id', async (req, res) => {
  await comentariosController.mostrarComentariosPorPublicacion(req.params.id)
    .then(comentarios => res.render('comentarios', { comentarios, mensaje: '' }))
    .catch(mensaje => res.render('comentarios', { mensaje }));
});


module.exports = router;
