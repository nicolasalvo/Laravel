# Plataforma de Minijuegos CRM

Este proyecto trata de una página web donde los usuarios pueden jugar a diferentes minijuegos, como el "Slope 3D". También tiene un panel para poder editar y subir los juegos que aparecen.

## Herramientas que he usado

Para hacer esto, he usado varios lenguajes de programación y herramientas unidas entre sí:

- **Laravel (creado con PHP):** Es la base principal y el cerebro de mi proyecto. Se encarga de guardar la información, gestionar la seguridad y controlar qué páginas se pueden ver.
- **React e Inertia.js:** He usado React para diseñar las pantallas y los menús visuales. Como Laravel y React son lenguajes con propósitos diferentes, usé una herramienta llamada Inertia.js que sirve de puente entre los dos para que hablen fácilmente entre sí y las páginas carguen muy rápido sin parpadear.
- **Tailwind CSS:** Lo usé para pintar todo con facilidad: ponerle colores, darle forma a los botones y ordenar el menú de los juegos sin tener que escribir hojas de estilos súper largas.
- **Vue 3 y Three.js:** El juego "Slope" en primera persona requiere crear figuras espaciales y formas geométricas. Por eso, el código gráfico de ese juego está pintado directamente utilizando Vue y Three.js, que son geniales para crear modelos 3D y videojuegos ligeros en el navegador.

### 1. La base de todo (Cómo funciona el proyecto)

Para no complicarme haciendo dos proyectos largos por separado (uno de diseño web visual y un servidor privado oculto), decidí combinarlo todo en la misma carpeta. Gracias al puente llamado Inertia, siempre que el usuario pincha en un botón de la página, el cerebro de Laravel busca los datos correctos del juego y se los manda directamente al dibujo de React súper rápido.

### 2. Base de Datos

Para no perder la información, he usado varias tablas de bases de datos conectadas entre sí usando las herramientas fáciles de Laravel. Simplemente programé un código base en mis archivos que dice cómo quiero que se ordenen mis tablas (la de usuarios con su nombre y contraseña, y la de los juegos con sus títulos, fotos de portada y estado). Cuando arranco el proyecto de sistema, Laravel lee ese código y construye los casilleros de la base de datos automáticamente.

### 3. Seguridad de usuarios y contraseñas

Para que no cualquiera pueda editar, he protegido el sistema usando "Laravel Jetstream", que es un modo que trae Laravel para controlar usuarios.

- Me permite tener unas pantallas para que la gente se registre, ponga su correo y cree una contraseña encriptada.
- Cada vez que alguien entre, el sistema le da un token invisible al navegador para afirmar que es el dueño de la sesión.
- Modifiqué el código en el botón de "Cerrar sesión" para que, cuando el usuario quiera irse, mande obligatoriamente la señal de destruir ese "token" y volver a bloquear las pantallas privadas de la web.

### 4. Administrar y Editar los juegos

Hice unos códigos en un archivo al que le puse como título "Controlador de juegos". Ahí programé los casos por si alguien quiere crear un juego nuevo en la plataforma, cambiarle el nombre a uno existente o directamente borrar su registro.
Además, he asignado **Roles** a mis cuentas. El código de la web comprueba de qué rol eres antes de trabajar; si le digo al código que exija un rol de "Administrador", los usuarios de niveles rasos ("Estudiante") que prueben el botón de "Editar", directamente no podrán utilizarlo y el sistema detendrá su petición.
