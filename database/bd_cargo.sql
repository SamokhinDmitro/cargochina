-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Май 07 2020 г., 20:02
-- Версия сервера: 10.3.13-MariaDB-log
-- Версия PHP: 7.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `bd_cargo`
--

-- --------------------------------------------------------

--
-- Структура таблицы `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `clients`
--

INSERT INTO `clients` (`id`, `name`, `email`, `phone`, `message`) VALUES
(4, 'qwerty', 'test@gmail.com', '+38(098)-555-55-55', 'qwerty'),
(5, 'тест', 'test@gmail.com', '+38(098)-111-11-11', 'тестовое кккк'),
(8, 'qwerty', 'qwer@re.ry', '+38(098)-555-55-55', 'qwerty'),
(9, 'wqertyu', 'wert@tt.ru', '+38(098)-320-65-55', ''),
(10, 'waerty', 'qwer@rr.ry', '+38(098)-320-95-51', '0jhgf'),
(12, 'rrrrr', 'rr@rrt.rt', '+38(098)-777-77-77', 'qwerty'),
(13, 'Дмитрий', 'testing@gm.ru', '+38(098)-111-11-00', ''),
(14, 'qwertyui', 'wert@rety.ry', '+38(098)-320-99-99', ''),
(15, 'кккк', 'test@gmail.com', '+38(098)-777-74-44', ''),
(16, 'фывапр', 'treat@qw.rt', '+38(098)-112-33-33', ''),
(18, 'ferfr', 'test@gmail.com', '+38(098)-320-95-51', 'qwert'),
(19, 'дмитрий', 'test@rrt.ua', '+38(098)-547-88-88', ''),
(20, 'dmitro', 'tr@rt.yy', '+38(098)-777-77-77', 'ftgrtgtrg'),
(21, 'qwer', 'trest@gmail.com', '+38(098)-777-74-44', 'gtrgtrg'),
(22, 'ftrgtg', 'rt@rr.ty', '+38(098)-777-44-44', 'wadrtfgyh'),
(23, 'ewrtyu', 'qwer@ee.ty', '+38(098)-555-55-55', 'qwesrtyu'),
(24, 'wer', 'qwert@test.ry', '+38(098)-320-95-54', ''),
(25, 'rtyuu', 'qwer@tt.ru', '+38(093)-444-44-44', '');

-- --------------------------------------------------------

--
-- Структура таблицы `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `news`
--

INSERT INTO `news` (`id`, `title`, `text`, `img`, `date`) VALUES
(1, 'Срочные новости с границы!', ' «1 Карго» уведомляет вас о том, что на таможенных пропускных пунктах проходит совместная\r\n                               российско- казахская инспекция таможенных переходов России и Казахстана.\r\n                               Не исключено, что в связи с этим в ближайшее время произойдет повышение тарифных ставок\r\n                               на оформление грузов.', 'img/news/news-1.jpg', '2019-05-23'),
(2, 'Электронные новинки', 'Постоянно развивающееся производство в Поднебесной ежегодно балует покупателей новинками и трендами, способными упростить жизнь. В последний год темой многих выставок и семинаров становились самые различные направления – от промышленности до домашних товаров.', 'img/news/news-2.jpg', '2019-05-23'),
(3, 'За спорт!', 'Команда «1 Карго» прибыла в Челябинск, чтобы поддержать российского марафонца Александра Капера, который преодолевает грандиозный по протяженности маршрут «Москва-Пекин»Что сказать?! Энергией зарядились, размялись и собираемся побегать.', 'img/news/news-3.jpg', '2019-05-22'),
(4, 'Что такое Lorem Ipsum?', 'Lorem Ipsum - это текст-\"рыба\", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной \"рыбой\" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов.', NULL, '2020-04-01'),
(5, 'Почему он используется?', 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации \"Здесь ваш текст.. ', NULL, '2020-04-15');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT для таблицы `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
