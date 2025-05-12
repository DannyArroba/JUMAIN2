# Usa la imagen oficial de PHP con Apache
FROM php:8.2-apache

# Instala las extensiones necesarias (como pdo_mysql)
RUN docker-php-ext-install pdo pdo_mysql

# Copia tu proyecto al directorio raíz del servidor web
COPY . /var/www/html/

# Da permisos adecuados
RUN chown -R www-data:www-data /var/www/html

# Activa el módulo rewrite de Apache (opcional si usas .htaccess)
RUN a2enmod rewrite

# Expón el puerto 80
EXPOSE 80
