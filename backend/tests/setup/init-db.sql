-- Disable integrity checks and save current settings
SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS,
    UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS,
    FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE,
    SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
-- Create the test database if it doesn't exist
DROP SCHEMA IF EXISTS `exocosmos_test`;
CREATE SCHEMA IF NOT EXISTS `exocosmos_test`;
USE `exocosmos_test`;
-- Users table
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `profile_picture_url` VARCHAR(200) NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    UNIQUE INDEX `username_UNIQUE` (`username`),
    UNIQUE INDEX `email_UNIQUE` (`email`)
) ENGINE = InnoDB;
-- Stars table
CREATE TABLE IF NOT EXISTS `stars` (
    `star_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `mass_solar` NUMERIC(10, 2) NOT NULL,
    `radius_solar` NUMERIC(10, 2) NOT NULL,
    `thumbnail_url` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`star_id`),
    UNIQUE INDEX `name_UNIQUE` (`name`)
) ENGINE = InnoDB;
-- Planetary systems table
CREATE TABLE IF NOT EXISTS `planetary_systems` (
    `planetary_system_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `distance_ly` INT NOT NULL,
    `thumbnail_url` VARCHAR(200) NOT NULL,
    `user_id` INT NOT NULL,
    `star_id` INT NOT NULL,
    PRIMARY KEY (`planetary_system_id`),
    UNIQUE INDEX `name_UNIQUE` (`name`),
    UNIQUE INDEX `star_id_UNIQUE` (`star_id`),
    INDEX (`user_id`),
    CONSTRAINT `fk_planetary_systems_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_planetary_systems_stars` FOREIGN KEY (`star_id`) REFERENCES `stars` (`star_id`)
) ENGINE = InnoDB;
-- Planet types table
CREATE TABLE IF NOT EXISTS `planet_types` (
    `planet_type_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `min_mass` INT NOT NULL,
    `max_mass` INT NOT NULL,
    `min_radius` INT NOT NULL,
    `max_radius` INT NOT NULL,
    `has_rings` TINYINT(1) NOT NULL,
    `has_surface` TINYINT(1) NOT NULL,
    `max_moons` INT NOT NULL,
    PRIMARY KEY (`planet_type_id`)
) ENGINE = InnoDB;
-- Planets table
CREATE TABLE IF NOT EXISTS `planets` (
    `planet_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `mass_earth` NUMERIC(10, 2) NOT NULL,
    `radius_earth` NUMERIC(10, 2) NOT NULL,
    `inclination_deg` NUMERIC(10, 2) NOT NULL,
    `rotation_speed_kms` NUMERIC(10, 2) NOT NULL,
    `albedo` NUMERIC(10, 2) NOT NULL,
    `star_distance_au` NUMERIC(10, 2) NOT NULL,
    `has_rings` TINYINT(1) NOT NULL,
    `moon_count` INT NOT NULL,
    `surface_texture_url` VARCHAR(200) NOT NULL,
    `height_texture_url` VARCHAR(200) NOT NULL,
    `thumbnail_url` VARCHAR(200) NOT NULL,
    `planetary_system_id` INT NOT NULL,
    `planet_type_id` INT NOT NULL,
    PRIMARY KEY (`planet_id`),
    UNIQUE INDEX `name_UNIQUE` (`name`),
    INDEX (`planetary_system_id`),
    INDEX (`planet_type_id`),
    CONSTRAINT `fk_planets_planetary_systems1` FOREIGN KEY (`planetary_system_id`) REFERENCES `planetary_systems` (`planetary_system_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_planets_planet_types1` FOREIGN KEY (`planet_type_id`) REFERENCES `planet_types` (`planet_type_id`)
) ENGINE = InnoDB;
-- Atmospheres table
CREATE TABLE IF NOT EXISTS `atmospheres` (
    `planet_id` INT NOT NULL,
    `pressure_atm` NUMERIC(10, 2) NOT NULL,
    `greenhouse_factor` NUMERIC(10, 2) NOT NULL,
    `texture_url` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`planet_id`),
    CONSTRAINT `fk_atmospheres_planets1` FOREIGN KEY (`planet_id`) REFERENCES `planets` (`planet_id`) ON DELETE CASCADE
) ENGINE = InnoDB;
-- Compounds table
CREATE TABLE IF NOT EXISTS `compounds` (
    `CID` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `formula` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`CID`)
) ENGINE = InnoDB;
-- Planet-compound relation
CREATE TABLE IF NOT EXISTS `planets_compounds` (
    `planet_id` INT NOT NULL,
    `CID` INT NOT NULL,
    `percentage` DECIMAL(5, 2) NOT NULL,
    PRIMARY KEY (`planet_id`, `CID`),
    CONSTRAINT `fk_planets_has_compounds_planets1` FOREIGN KEY (`planet_id`) REFERENCES `planets` (`planet_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_planets_has_compounds_compounds1` FOREIGN KEY (`CID`) REFERENCES `compounds` (`CID`) ON DELETE CASCADE
) ENGINE = InnoDB;
-- Atmosphere-compound relation
CREATE TABLE IF NOT EXISTS `atmospheres_compounds` (
    `planet_id` INT NOT NULL,
    `CID` INT NOT NULL,
    `percentage` DECIMAL(5, 2) NOT NULL,
    PRIMARY KEY (`planet_id`, `CID`),
    CONSTRAINT `fk_atmospheres_has_compounds_atmospheres1` FOREIGN KEY (`planet_id`) REFERENCES `atmospheres` (`planet_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_atmospheres_has_compounds_compounds2` FOREIGN KEY (`CID`) REFERENCES `compounds` (`CID`) ON DELETE CASCADE
) ENGINE = InnoDB;
-- Restore previous settings
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;