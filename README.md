# Plataforma de Minijuegos CRM

Este proyecto es una página web donde los usuarios pueden jugar a diferentes minijuegos, como el Slope 3D, chatear con otros jugadores en tiempo real y gestionar su perfil con reconocimiento facial. Los administradores también tienen un panel para añadir, editar o borrar juegos de la plataforma.

Para que todo esto funcione, el proyecto está dividido en varias partes que se comunican entre sí. A continuación se explica qué hace cada una y por qué se usa.

---

## El frontend

El frontend es todo lo que el usuario ve y toca en el navegador: los menús, los botones, las pantallas del juego, el chat, el formulario de perfil, etc.

Para construirlo se usan dos frameworks distintos según la necesidad. La mayoría de páginas, como el panel de juegos, el perfil o el chat, están hechas con **React**, una librería de JavaScript que permite dividir la interfaz en piezas reutilizables llamadas componentes. Sin embargo, el juego Slope 3D tiene su propia lógica gráfica y está construido con **Vue 3** junto a **Three.js**, una librería especializada en renderizar gráficos 3D directamente en el navegador sin necesidad de instalar nada extra.

Para darle estilo visual a todo se usa **Tailwind CSS**, que permite aplicar colores, márgenes, sombras y demás propiedades directamente en el HTML sin necesidad de escribir hojas de estilos separadas.

El puente que une el frontend con el servidor es **Inertia.js**. Normalmente, cuando el usuario hace clic en un enlace, el navegador tiene que pedir la página entera al servidor y recargar todo. Inertia evita eso: solo pide los datos que cambian y los pinta en pantalla al instante, lo que hace que la navegación se sienta mucho más fluida.

---

## El backend principal

El backend es la parte que el usuario no ve pero que hace todo el trabajo importante: guardar información, comprobar que el usuario tiene permiso para hacer algo, gestionar las contraseñas, etc.

Para esto se usa **Laravel**, un framework escrito en **PHP**. Laravel organiza el código en controladores, que son archivos que se encargan de una tarea concreta. Por ejemplo, el `GameController` gestiona todo lo relacionado con los juegos (crearlos, editarlos, borrarlos y listarlos), el `ChatController` guarda los mensajes del chat y los emite en tiempo real, y el `ProfileFaceController` se encarga de subir la foto del usuario y de pedir al microservicio de inteligencia artificial que compare dos caras.

La seguridad de los usuarios la gestiona **Laravel Jetstream**, que proporciona las pantallas de registro e inicio de sesión y se encarga de cifrar las contraseñas. Además, cada cuenta tiene un rol asignado. Los administradores pueden crear y editar juegos, mientras que los estudiantes solo pueden jugar. Si un estudiante intentara acceder a una ruta protegida, el sistema lo bloquearía automáticamente.

---

## El sistema de tiempo real

El chat en vivo que aparece mientras se juega funciona gracias a una tecnología llamada **WebSocket**. A diferencia de las peticiones HTTP normales, donde el navegador pregunta y el servidor responde cada vez, un WebSocket mantiene una conexión abierta y permanente. Esto permite que el servidor avise al navegador en el momento exacto en que llega un mensaje nuevo, sin que el usuario tenga que recargar nada.

Para implementar esto se usa **Laravel Reverb**, que es el servidor WebSocket del proyecto. Cuando un usuario envía un mensaje, Laravel lo guarda en la base de datos y lanza un evento llamado `MessageSent`. Reverb recoge ese evento y lo distribuye inmediatamente a todos los navegadores que estén conectados al canal de chat en ese momento.

En el lado del navegador, **Laravel Echo** es la librería que escucha ese canal y actualiza la lista de mensajes en pantalla cada vez que llega algo nuevo. Por debajo, Echo usa **Pusher-JS** como driver de comunicación para conectarse con Reverb.

Hay un detalle especial en el chat: cuando el usuario envía un mensaje, este aparece en su pantalla de forma inmediata, incluso antes de que el servidor confirme que lo ha recibido. Esto se llama actualización optimista y hace que la aplicación se sienta muy rápida. Si el servidor devuelve un error, el mensaje desaparece solo.

---

## El microservicio de reconocimiento facial

Una parte del proyecto que funciona de manera completamente independiente es el reconocimiento facial. Un microservicio es un programa pequeño y separado que hace una sola tarea muy concreta y se comunica con el resto del sistema a través de peticiones HTTP, igual que si fuera una API externa.

En este caso, el microservicio está escrito en **Python** y usa **FastAPI** para exponer un único endpoint al que se le mandan dos fotos. Internamente, usa la librería **DeepFace** con el modelo Facenet y el detector MTCNN para analizar los rasgos faciales de ambas imágenes y calcular si pertenecen a la misma persona.

El flujo es el siguiente: el usuario sube una foto de registro a su perfil, que Laravel guarda en el disco. Más adelante, cuando quiere verificar su identidad, sube una segunda foto. Laravel recoge ambas imágenes y las envía al microservicio Python mediante una petición interna. El microservicio responde con un resultado que indica si las caras coinciden y con qué nivel de certeza. Finalmente, Laravel devuelve ese resultado al navegador.

---

## La base de datos

Toda la información del proyecto se guarda en una base de datos llamada **SQLite**. A diferencia de otros sistemas de base de datos que necesitan un servidor propio, SQLite guarda todo en un único archivo del disco llamado `database.sqlite`, lo que la hace muy práctica para trabajar en local.

Las tablas más importantes son la de usuarios, que almacena el nombre, el correo, la contraseña cifrada y la ruta de la foto facial de cada persona; la de juegos, con el nombre, la descripción y la imagen de portada de cada juego; la de mensajes, donde se guardan todos los mensajes del chat junto con el identificador del usuario que los escribió; y la de roles, que es la que determina si una cuenta es de tipo Administrador o Estudiante.

Estas tablas no se crean a mano. Laravel usa unos archivos llamados migraciones, que son como instrucciones escritas en código, y con el comando `php artisan migrate` construye toda la estructura de la base de datos automáticamente.

---

## Cómo arrancar el proyecto

Para que todo funcione hace falta levantar varios servidores a la vez, cada uno en una terminal distinta.

```bash
# Servidor principal de Laravel
php artisan serve

# Servidor de WebSocket para el chat en tiempo real
php artisan reverb:start

# Compilador del frontend (React + Vue)
npm run dev

# Microservicio de reconocimiento facial (solo si se necesita)
uvicorn face_service:app --port 8001
```

---

## Resumen de tecnologías

**Laravel** actúa como el núcleo del proyecto: gestiona las rutas, la lógica de negocio, la autenticación y la base de datos. **React** y **Vue 3** construyen la interfaz que ve el usuario, conectadas al servidor mediante **Inertia.js**. **Laravel Reverb** y **Laravel Echo** se encargan de la comunicación en tiempo real del chat. Y el microservicio de **Python con FastAPI y DeepFace** aporta la capacidad de reconocimiento facial de forma aislada y sin interferir con el resto del sistema. Todo el almacenamiento de datos se centraliza en una base de datos **SQLite**.
