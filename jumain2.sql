-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 12-05-2025 a las 01:31:30
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `jumain2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `institucion_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `nombre`, `institucion_id`) VALUES
(1, 'Matematicas Basicas', 1),
(2, 'Matematicas Media', 1),
(3, 'Matematicas Avanzadas', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `discapacidades`
--

CREATE TABLE `discapacidades` (
  `id` varchar(3) NOT NULL,
  `tipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `discapacidades`
--

INSERT INTO `discapacidades` (`id`, `tipo`) VALUES
('AUD', 'Auditiva'),
('COG', 'Cognitiva'),
('MOT', 'Motriz'),
('VIS', 'Visual');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `cedula` varchar(10) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` varchar(20) DEFAULT NULL,
  `curso_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`cedula`, `nombre`, `apellido`, `edad`, `sexo`, `curso_id`) VALUES
('0000000000', 'Termu', 'Granda', 14, 'Masculino', 3),
('0999999999', 'Juan', 'Mancara', 7, 'Masculino', 2),
('1111111111', 'Cristian', 'Acosta', 21, 'Masculino', 1),
('1222222222', 'Pablo', 'Perez', 8, 'Masculino', 1),
('1234567891', 'Danny', 'Alvarado', 21, 'Masculino', 1),
('1234567892', 'Jostin', 'Guañuna', 21, 'Masculino', 2),
('1333333333', 'Luis', 'Delgado', 8, 'Masculino', 2),
('1444444444', 'Freddy', 'Bustamante', 15, 'Masculino', 3),
('2103248555', 'Danny', 'Arroz', 20, 'Masculino', 2),
('2111111111', 'Maria', 'Jasinta', 13, 'Femenino', 3),
('2133445566', 'Mario', 'Mendez', 12, 'Masculino', 2),
('2203445032', 'Hugo', 'Andi', 20, 'Masculino', 3),
('2250040850', 'Cristian', 'Baltazar', 22, 'Masculino', 1),
('3111111111', 'Gina', 'Miriam', 13, 'Femenino', 2),
('3222222222', 'Gary', 'Mendez', 9, 'Masculino', 1),
('3333333333', 'Fredy', 'Manur', 33, 'Masculino', 1),
('3344552211', 'Gabriel', 'Huaman', 32, 'Masculino', 1),
('3444444444', 'Hugo', 'Mendina', 12, 'Masculino', 2),
('3555555555', 'Jin', 'Freed', 14, 'Masculino', 2),
('3666666666', 'Bastian', 'Tiron', 15, 'Masculino', 1),
('4111111111', 'Juan', 'Hernandez', 9, 'Masculino', 1),
('4222222222', 'Nataly', 'Moreira', 10, 'Femenino', 1),
('4333333333', 'Klever', 'Jungal', 11, 'Masculino', 1),
('4444444444', 'Mariux', 'Jimenez', 22, 'Femenino', 1),
('4555555555', 'Ricardo', 'Bravo', 9, 'Masculino', 1),
('5444444444', 'Federico', 'Mantilla', 12, 'Masculino', 1),
('5555555555', 'Mario', 'Bustamante', 12, 'Masculino', 1),
('6666666666', 'Jesus', 'Manrique', 12, 'Masculino', 1),
('7777777777', 'Joss', 'Klever', 12, 'Femenino', 1),
('8888888888', 'Kinm', 'Jupiter', 12, 'Masculino', 2),
('9988776655', 'Joel', 'Benalcazar', 21, 'Masculino', 1),
('9999999999', 'Carlos', 'Mermes', 12, 'Masculino', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes_discapacidades`
--

CREATE TABLE `estudiantes_discapacidades` (
  `estudiante_cedula` varchar(10) NOT NULL,
  `discapacidad_id` varchar(3) NOT NULL,
  `porcentaje` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiantes_discapacidades`
--

INSERT INTO `estudiantes_discapacidades` (`estudiante_cedula`, `discapacidad_id`, `porcentaje`) VALUES
('0000000000', 'AUD', 58),
('0999999999', 'MOT', 39),
('1111111111', 'AUD', 82),
('1111111111', 'VIS', 41),
('1222222222', 'AUD', 55),
('1333333333', 'COG', 34),
('1444444444', 'MOT', 38),
('2111111111', 'MOT', 14),
('2133445566', 'AUD', 30),
('2133445566', 'VIS', 86),
('2250040850', 'COG', 37),
('2250040850', 'VIS', 100),
('3111111111', 'VIS', 47),
('3222222222', 'COG', 29),
('3333333333', 'AUD', 33),
('3344552211', 'AUD', 82),
('3344552211', 'COG', 66),
('3344552211', 'MOT', 68),
('3344552211', 'VIS', 89),
('3444444444', 'AUD', 25),
('3555555555', 'COG', 71),
('3666666666', 'MOT', 69),
('4111111111', 'AUD', 39),
('4222222222', 'COG', 37),
('4333333333', 'MOT', 29),
('4444444444', 'AUD', 57),
('4555555555', 'VIS', 37),
('5444444444', 'AUD', 57),
('5555555555', 'COG', 27),
('6666666666', 'MOT', 47),
('7777777777', 'VIS', 48),
('8888888888', 'AUD', 44),
('9988776655', 'AUD', 65),
('9999999999', 'AUD', 45);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instituciones`
--

CREATE TABLE `instituciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `instituciones`
--

INSERT INTO `instituciones` (`id`, `nombre`) VALUES
(1, 'Unidad Educativa Especializada \"Manuela Cañizares\"'),
(2, 'Colegio Académico de Desarrollo'),
(3, 'Universidad de Estudios Avanzados');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juegos`
--

CREATE TABLE `juegos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `juegos`
--

INSERT INTO `juegos` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Exploradores de colores y formas', 'Juego interactivo donde los estudiantes deben observar y replicar patrones de colores, formas y tamaños seleccionando los objetos correctos.'),
(2, 'El mapa del tesoro', 'Juego interactivo donde los estudiantes deben guiar un carrito a través de un laberinto evitando obstáculos y alcanzando la meta en diferentes niveles.'),
(3, 'La Tienda de Frutas', 'Juego interactivo donde los estudiantes deben clasificar frutas según su color, tamaño y tipo, avanzando a través de diferentes niveles de dificultad.'),
(4, 'Aventura en el Reino de los Números', 'Juego interactivo donde los estudiantes ayudan a un personaje a recoger objetos y resolver desafíos de suma y resta avanzando a través de niveles.'),
(5, 'Constructor de Mundos', 'Juego interactivo donde los estudiantes deben seleccionar y colocar piezas geométricas para replicar patrones y construir figuras correctamente.'),
(6, 'El Tren Matemático', 'Juego interactivo donde los estudiantes deben contar los vagones del tren y responder correctamente para avanzar a través de niveles.'),
(7, 'Tienda por virtual', 'Juego interactivo donde los estudiantes deben seleccionar las monedas correctas para pagar productos en una tienda y avanzar a través de niveles.'),
(8, 'El Clima Mágico', 'Juego interactivo donde los estudiantes deben arrastrar y soltar imágenes del clima en sus cuadros correspondientes para aprender sobre los diferentes tipos de clima.'),
(9, 'Recolectores de Datos', 'Juego interactivo donde los estudiantes deben organizar y clasificar elementos como frutas y números arrastrándolos a las cajas correctas antes de que se acabe el tiempo.'),
(10, 'Juego de Suma de Objetos', 'Juego interactivo donde los estudiantes deben observar y contar objetos dentro de un círculo, sumando correctamente para avanzar de nivel.'),
(11, 'Juego de Resta de Objetos', 'Juego interactivo donde los estudiantes deben observar y contar objetos dentro de un círculo, restando correctamente para avanzar de nivel.'),
(12, 'Juego de Multiplicación', 'Juego interactivo donde los estudiantes deben resolver correctamente multiplicaciones seleccionando la opción correcta para avanzar de nivel.'),
(13, 'Juego de División', 'Juego interactivo donde los estudiantes deben resolver correctamente divisiones seleccionando la opción correcta para avanzar de nivel.'),
(14, 'Juego de Mayor y Menor', 'Juego interactivo donde los estudiantes deben comparar grupos de objetos y determinar si la relación mayor, menor o igual es verdadera o falsa para avanzar de nivel.'),
(15, 'Identificación de Figuras', 'Juego de identificación de figuras geométricas.'),
(16, 'Suma y Resta de Fracciones', 'Juego educativo interactivo donde los estudiantes practican la suma y resta de fracciones mediante ejercicios dinámicos y visuales.'),
(17, 'Potencias', 'Juego educativo interactivo donde los estudiantes practican el cálculo de potencias mediante ejercicios dinámicos y visuales.'),
(18, 'MCD y MCM', 'Juego educativo interactivo donde los estudiantes practican el cálculo del Máximo Común Divisor (MCD) y el Mínimo Común Múltiplo (MCM) mediante ejercicios dinámicos y visuales.'),
(19, 'Coloreando Fracciones', 'Juego educativo interactivo donde los estudiantes practican fracciones coloreando figuras según una fracción dada.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `cedula` varchar(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `edad` int(11) NOT NULL,
  `sexo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`cedula`, `nombre`, `apellido`, `edad`, `sexo`) VALUES
('0912345678', 'María', 'Pérez', 35, 'Femenino'),
('0923456789', 'Juan', 'Gómez', 40, 'Masculino'),
('0934567890', 'Ana', 'Martínez', 29, 'Femenino');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores_cursos`
--

CREATE TABLE `profesores_cursos` (
  `profesor_cedula` varchar(10) NOT NULL,
  `curso_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesores_cursos`
--

INSERT INTO `profesores_cursos` (`profesor_cedula`, `curso_id`) VALUES
('0912345678', 1),
('0912345678', 2),
('0912345678', 3),
('0923456789', 3),
('0934567890', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `progreso`
--

CREATE TABLE `progreso` (
  `id` int(11) NOT NULL,
  `estudiante_cedula` varchar(10) NOT NULL,
  `juego_id` int(11) NOT NULL,
  `nivel` int(11) DEFAULT NULL,
  `puntaje` int(11) DEFAULT NULL,
  `fallos` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `progreso`
--

INSERT INTO `progreso` (`id`, `estudiante_cedula`, `juego_id`, `nivel`, `puntaje`, `fallos`, `fecha`) VALUES
(1, '2103248555', 15, 7, 60, 19, '2025-02-19 01:11:38'),
(2, '2103248555', 16, 4, 240, 195, '2025-02-19 07:58:45'),
(3, '2133445566', 16, 6, 150, 18, '2025-02-19 08:02:55'),
(4, '1234567892', 16, 1, 10, 0, '2025-02-19 08:07:41'),
(5, '1234567892', 15, 3, 20, 0, '2025-02-19 08:09:53'),
(19, '2203445032', 17, 3, 0, 7, '2025-02-19 22:28:39'),
(20, '2203445032', 18, 3, 1, 6, '2025-02-19 20:52:54'),
(21, '2203445032', 16, 1, 0, 0, '2025-02-19 20:00:50'),
(22, '2203445032', 19, 2, 0, 0, '2025-02-19 20:16:05'),
(23, '2203445032', 1, 3, 40, 0, '2025-02-19 23:37:45'),
(25, '2203445032', 3, 2, 120, 4, '2025-02-20 02:27:32'),
(26, '2203445032', 4, 2, 0, 0, '2025-02-20 02:26:31'),
(27, '2203445032', 5, 3, 20, 0, '2025-02-20 02:32:05'),
(29, '2203445032', 6, 3, 60, 0, '2025-02-20 14:53:13'),
(30, '1234567891', 6, 2, 10, 0, '2025-03-18 01:25:08'),
(31, '1234567892', 6, 1, 0, 0, '2025-02-20 14:41:09'),
(32, '2203445032', 7, 10, 100, 6, '2025-02-20 18:36:55'),
(33, '2203445032', 8, 3, 100, 0, '2025-02-20 18:24:37'),
(34, '2203445032', 9, 3, 1010, 37, '2025-02-20 20:13:31'),
(35, '2103248555', 9, 1, 0, 3, '2025-02-20 19:07:35'),
(37, '2203445032', 10, 2, 30, 17, '2025-02-20 22:41:41'),
(53, '9988776655', 12, 3, 9, 6, '2025-02-21 02:02:15'),
(63, '9988776655', 14, 3, 50, 5, '2025-02-21 02:04:36'),
(67, '9988776655', 1, 2, 20, 0, '2025-02-21 00:40:09'),
(69, '9988776655', 2, 3, 0, 0, '2025-02-21 00:57:34'),
(70, '9988776655', 3, 3, 210, 1, '2025-02-21 00:51:34'),
(71, '1234567891', 13, 1, 0, 0, '2025-02-21 01:56:07'),
(72, '1234567891', 11, 3, 28, 12, '2025-02-21 01:53:30'),
(73, '9988776655', 13, 3, 12, 5, '2025-02-21 01:57:53'),
(74, '9988776655', 10, 3, 6, 5, '2025-02-21 02:02:55'),
(75, '9988776655', 15, 33, 320, 15, '2025-02-21 02:09:05'),
(76, '9988776655', 16, 3, 70, 1, '2025-02-21 02:16:04'),
(77, '9988776655', 17, 4, 2, 0, '2025-02-21 02:17:39'),
(78, '9988776655', 18, 2, 2, 0, '2025-02-21 02:21:21'),
(79, '1111111111', 1, 2, -10, 0, '2025-04-05 18:50:11'),
(80, '1111111111', 4, 2, 0, 0, '2025-02-21 09:54:51'),
(81, '1234567891', 1, 3, 240, 0, '2025-03-18 00:43:25'),
(82, '1234567891', 2, 1, 20, 0, '2025-03-18 00:44:50'),
(83, '1234567891', 3, 2, 90, 1, '2025-03-17 23:17:53'),
(84, '1234567891', 4, 1, 0, 0, '2025-03-18 00:58:05'),
(85, '1234567891', 5, 3, 20, 1, '2025-03-18 01:00:11'),
(86, '5555555555', 7, 2, 20, 0, '2025-03-18 22:39:22'),
(87, '5555555555', 8, 3, 100, 0, '2025-03-18 22:41:06'),
(88, '5555555555', 9, 2, 140, 4, '2025-03-18 22:43:35'),
(89, '8888888888', 10, 2, 11, 12, '2025-03-21 01:46:40'),
(91, '8888888888', 12, 1, 45, 47, '2025-03-21 01:47:14'),
(93, '8888888888', 11, 1, 10, 18, '2025-03-21 01:47:01'),
(94, '8888888888', 13, 1, 0, 0, '2025-03-21 01:47:27'),
(95, '8888888888', 14, 3, 20, 5, '2025-03-21 01:48:00'),
(96, '8888888888', 15, 3, 220, 11, '2025-03-19 01:24:08'),
(97, '8888888888', 16, 6, 250, 59, '2025-03-21 01:48:30'),
(98, '0000000000', 17, 1, 0, 1, '2025-03-19 01:48:31'),
(99, '0000000000', 16, 1, 0, 0, '2025-03-19 01:42:50'),
(100, '0000000000', 18, 3, 1, 9, '2025-03-19 02:01:09'),
(101, '0000000000', 19, 2, 0, 0, '2025-03-21 01:50:19'),
(102, '5555555555', 4, 1, 0, 0, '2025-03-21 01:44:31'),
(103, '3222222222', 1, 3, 30, 9, '2025-05-10 17:10:21'),
(104, '3222222222', 4, 1, 0, 2, '2025-05-10 17:26:45'),
(105, '3222222222', 2, 2, 60, 9, '2025-05-10 17:19:28'),
(106, '3222222222', 3, 3, 240, 4, '2025-04-05 19:18:23'),
(107, '3222222222', 6, 1, 0, 7, '2025-04-05 19:16:13'),
(108, '3222222222', 5, 1, 0, 1, '2025-04-05 19:17:42'),
(109, '3222222222', 9, 3, 100, 3, '2025-05-10 17:27:02'),
(110, '0999999999', 10, 1, 2, 6, '2025-04-05 19:57:54'),
(111, '0999999999', 11, 1, 3, 13, '2025-04-05 19:59:51'),
(112, '0999999999', 12, 1, 0, 0, '2025-04-05 19:59:15'),
(113, '0999999999', 13, 1, 0, 0, '2025-04-05 19:59:23'),
(114, '3111111111', 10, 1, 1, 3, '2025-04-05 20:09:36'),
(115, '2111111111', 17, 3, 2, 11, '2025-04-05 20:45:48'),
(116, '2111111111', 18, 3, 5, 5, '2025-04-05 20:46:09'),
(117, '2111111111', 19, 3, 0, 0, '2025-04-05 20:46:26'),
(118, '5444444444', 1, 2, 60, 0, '2025-04-05 22:13:18'),
(119, '1222222222', 1, 3, 70, 0, '2025-04-17 21:38:48'),
(120, '1222222222', 2, 2, 20, 0, '2025-04-17 21:40:07'),
(121, '1222222222', 3, 3, 210, 0, '2025-04-17 21:41:46'),
(122, '1222222222', 4, 2, 0, 0, '2025-04-17 21:43:01'),
(123, '1222222222', 5, 2, 10, 1, '2025-04-17 21:43:57'),
(124, '1222222222', 6, 3, 30, 1, '2025-04-17 21:44:36'),
(125, '1222222222', 7, 2, 20, 1, '2025-04-17 21:45:24'),
(126, '1222222222', 8, 1, 20, 0, '2025-04-17 21:46:26'),
(127, '1222222222', 9, 2, 40, 0, '2025-04-17 21:46:53'),
(128, '1333333333', 10, 1, 1, 0, '2025-04-17 21:50:42'),
(129, '1333333333', 11, 1, 1, 0, '2025-04-17 21:50:52'),
(130, '1333333333', 12, 1, 0, 0, '2025-04-17 21:51:11'),
(131, '1333333333', 13, 1, 1, 1, '2025-04-17 21:51:45'),
(132, '1333333333', 14, 2, 0, 0, '2025-04-17 21:52:21'),
(133, '1333333333', 15, 3, 90, 0, '2025-04-17 21:53:40'),
(134, '1333333333', 16, 1, 10, 1, '2025-04-17 21:54:32'),
(135, '1444444444', 17, 1, 2, 1, '2025-04-17 21:56:31'),
(136, '1444444444', 18, 2, 0, 0, '2025-04-17 21:57:33'),
(137, '1444444444', 19, 3, 0, 0, '2025-04-17 21:58:22'),
(138, '5555555555', 1, 3, 180, 0, '2025-05-10 16:13:08'),
(139, '5555555555', 2, 3, 40, 0, '2025-04-22 00:41:12'),
(140, '5555555555', 3, 3, 180, 3, '2025-04-22 00:41:38'),
(141, '4444444444', 1, 1, -40, 0, '2025-05-10 16:59:28');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `institucion_id` (`institucion_id`);

--
-- Indices de la tabla `discapacidades`
--
ALTER TABLE `discapacidades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tipo` (`tipo`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`cedula`),
  ADD KEY `curso_id` (`curso_id`);

--
-- Indices de la tabla `estudiantes_discapacidades`
--
ALTER TABLE `estudiantes_discapacidades`
  ADD PRIMARY KEY (`estudiante_cedula`,`discapacidad_id`),
  ADD KEY `discapacidad_id` (`discapacidad_id`);

--
-- Indices de la tabla `instituciones`
--
ALTER TABLE `instituciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `juegos`
--
ALTER TABLE `juegos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD PRIMARY KEY (`cedula`);

--
-- Indices de la tabla `profesores_cursos`
--
ALTER TABLE `profesores_cursos`
  ADD PRIMARY KEY (`profesor_cedula`,`curso_id`),
  ADD KEY `curso_id` (`curso_id`);

--
-- Indices de la tabla `progreso`
--
ALTER TABLE `progreso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estudiante_cedula` (`estudiante_cedula`),
  ADD KEY `juego_id` (`juego_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `instituciones`
--
ALTER TABLE `instituciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `juegos`
--
ALTER TABLE `juegos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `progreso`
--
ALTER TABLE `progreso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`institucion_id`) REFERENCES `instituciones` (`id`);

--
-- Filtros para la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD CONSTRAINT `estudiantes_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`);

--
-- Filtros para la tabla `estudiantes_discapacidades`
--
ALTER TABLE `estudiantes_discapacidades`
  ADD CONSTRAINT `estudiantes_discapacidades_ibfk_1` FOREIGN KEY (`estudiante_cedula`) REFERENCES `estudiantes` (`cedula`),
  ADD CONSTRAINT `estudiantes_discapacidades_ibfk_2` FOREIGN KEY (`discapacidad_id`) REFERENCES `discapacidades` (`id`);

--
-- Filtros para la tabla `profesores_cursos`
--
ALTER TABLE `profesores_cursos`
  ADD CONSTRAINT `profesores_cursos_ibfk_1` FOREIGN KEY (`profesor_cedula`) REFERENCES `profesores` (`cedula`),
  ADD CONSTRAINT `profesores_cursos_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`);

--
-- Filtros para la tabla `progreso`
--
ALTER TABLE `progreso`
  ADD CONSTRAINT `progreso_ibfk_1` FOREIGN KEY (`estudiante_cedula`) REFERENCES `estudiantes` (`cedula`),
  ADD CONSTRAINT `progreso_ibfk_2` FOREIGN KEY (`juego_id`) REFERENCES `juegos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
