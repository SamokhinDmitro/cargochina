const { src, dest, parallel, series, watch } = require('gulp');

//Подключаем Livereload
const connect = require('gulp-connect');

// Подключаем gulp-concat
const concat = require('gulp-concat');

// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

// Подключаем модули gulp-sass
const sass = require('gulp-sass');

// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');

// Подключаем модуль gulp-clean-css минимизация css
const cleancss = require('gulp-clean-css');

// Подключаем gulp-imagemin для работы с изображениями
const imagemin = require('gulp-imagemin');

// Подключаем модуль gulp-newer
const newer = require('gulp-newer');

// Подключаем модуль del
const del = require('del');


// Определяем логику работы Browsersync
/*
function browsersync() {
    browserSync.init({ // Инициализация Browsersync
        server: { baseDir: 'src/' }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true // Режим работы: true или false
    })
}
 */

//Создаем connect - соединение для livereload
function server(){
    return connect.server({
        host: 'localhost',
        root: 'src/',
        livereload: true,
        port: 3000
    });
}


//Изменение Html
function html() {
    return src('src/*.html')
        .pipe(connect.reload())
}

function scripts() {
    return src([ // Берём файлы из источников
        //'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
        'src/js/main.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
        //остальные файлы скриптов
    ])
        .pipe(concat('main.min.js')) // Конкатенируем в один файл
        .pipe(uglify()) // Сжимаем JavaScript
        .pipe(dest('src/js/')) // Выгружаем готовый файл в папку назначения
        //.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
        .pipe(connect.reload())// для обновления страницы livereload
}

function styles() {
    return src('src/sass/*.sass') // Подключаем  sass файлы
        .pipe(sass({
            outputStyle: 'expanded',     // вложенный (по умолчанию)
        }).on('error', sass.logError))
        .pipe(concat('style.min.css')) // Конкатенируем файл
        //.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: false })) // Создадим префиксы с помощью Autoprefixer
        //pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
        .pipe(dest('src/css/')) // Выгрузим результат в папку "app/css/"
        //.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
        .pipe(connect.reload()) //для обновления страницы livereload
}

//Минификация файла стилей
function minCss(){
    return src('src/css/style.min.css') // Подключаем главный style файл
        .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
        .pipe(dest('dist/css/')) // Выгрузим результат в папку "app/css/"
}

function images() {
    return src('src/img/**/*') // Берём все изображения из папки источника
        .pipe(newer('dist/img')) // Проверяем, было ли изменено (сжато) изображение ранее
       	.pipe(imagemin([
                imagemin.mozjpeg({quality: 75, progressive: true}),
            ])) // Сжимаем и оптимизируем изображеня
        .pipe(dest('dist/img')) // Выгружаем оптимизированные изображения в папку назначения
}

// Удаляем всё содержимое папки "dist/"
function cleandist() {
    return del('dist/**/*', { force: true })
}

//Отслеживание изменения файлов
function startwatch() {

    // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
    watch(['src/**/*.js', '!src/**/*.min.js'], scripts);

    // Мониторим файлы препроцессора на изменения
    watch('src/**/sass/**/*', styles);

    // Мониторим файлы HTML на изменения
    //watch('src/**/*.html').on('change', connect.reload);
    watch(['src/**/*.html'], html)

    // Мониторим папку-источник изображений и выполняем images(), если есть изменения
    //watch('src/img/**/*', images);
}

//Create PRODUCTION Version
function buildcopy() {
    return src([ // Выбираем нужные файлы
        'src/css/**/*.min.css',
        'src/js/**/*.min.js',
        'src/img/**/*',
        'src/**/*.html',
    ], { base: 'src' }) // Параметр "base" сохраняет структуру проекта при копировании
        .pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}


//ПОДКЛЮЧЕНИЕ функций

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
//exports.browsersync = browsersync;

exports.server = server;

exports.html = html;

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспорт функции images() в таск images
exports.images = images;

exports.cleandist = cleandist;

exports.minCss = minCss;



//PRODUCTION Version
// Создаём новый таск "build", который последовательно выполняет нужные операции
exports.build = series(cleandist,  styles, scripts, images, buildcopy, minCss);


// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(html, styles, scripts,  server, startwatch);

