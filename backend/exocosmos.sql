SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `exocosmos`;
USE `exocosmos`;

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

CREATE TABLE IF NOT EXISTS `stars` (
  `star_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  `description` TEXT NULL,
  `mass_solar` NUMERIC(10,2) NOT NULL,
  `radius_solar` NUMERIC(10,2) NOT NULL,
  `thumbnail_url` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`star_id`),
  UNIQUE INDEX `name_UNIQUE` (`name`)
) ENGINE = InnoDB;

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

CREATE TABLE IF NOT EXISTS `planets` (
  `planet_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  `description` TEXT NULL,
  `mass_earth` NUMERIC(10,2) NOT NULL,
  `radius_earth` NUMERIC(10,2) NOT NULL,
  `inclination_deg` NUMERIC(10,2) NOT NULL,
  `rotation_speed_kms` NUMERIC(10,2) NOT NULL,
  `albedo` NUMERIC(10,2) NOT NULL,
  `star_distance_au` NUMERIC(10,2) NOT NULL,
  `has_rings` TINYINT(1) NOT NULL,
  `moon_count` INT NOT NULL,
  `surface_texture_url` VARCHAR(200) NOT NULL,
  `height_texture_url` VARCHAR(200) NULL,
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

CREATE TABLE IF NOT EXISTS `atmospheres` (
  `planet_id` INT NOT NULL,
  `pressure_atm` NUMERIC(10,2) NOT NULL,
  `greenhouse_factor` NUMERIC(10,2) NOT NULL,
  `texture_url` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`planet_id`),
  CONSTRAINT `fk_atmospheres_planets1` FOREIGN KEY (`planet_id`) REFERENCES `planets` (`planet_id`) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `compounds` (
  `CID` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `formula` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`CID`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `planets_compounds` (
  `planet_id` INT NOT NULL,
  `CID` INT NOT NULL,
  `percentage` DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`planet_id`, `CID`),
  CONSTRAINT `fk_planets_has_compounds_planets1` FOREIGN KEY (`planet_id`) REFERENCES `planets` (`planet_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_planets_has_compounds_compounds1` FOREIGN KEY (`CID`) REFERENCES `compounds` (`CID`) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `planet_types_compounds` (
  `planet_type_id` INT NOT NULL,
  `CID` INT NOT NULL,
  `target` ENUM('planet', 'atmosphere') NOT NULL,
  PRIMARY KEY (`planet_type_id`, `CID`),
  INDEX (`planet_type_id`),
  INDEX (`CID`),
  CONSTRAINT `fk_compounds_has_planet_types_compounds1` FOREIGN KEY (`CID`) REFERENCES `compounds` (`CID`) ON DELETE CASCADE,
  CONSTRAINT `fk_compounds_has_planet_types_planet_types1` FOREIGN KEY (`planet_type_id`) REFERENCES `planet_types` (`planet_type_id`) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `atmospheres_compounds` (
  `planet_id` INT NOT NULL,
  `CID` INT NOT NULL,
  `percentage` DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`planet_id`, `CID`),
  CONSTRAINT `fk_atmospheres_has_compounds_atmospheres1` FOREIGN KEY (`planet_id`) REFERENCES `atmospheres` (`planet_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_atmospheres_has_compounds_compounds2` FOREIGN KEY (`CID`) REFERENCES `compounds` (`CID`) ON DELETE CASCADE
) ENGINE = InnoDB;

SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;

INSERT INTO planet_types (planet_type_id, name, min_mass, max_mass, min_radius, max_radius, has_rings, has_surface, max_moons)
VALUES
  (1, 'Terrestrial', 0, 4, 0, 2, 0, 1, 3),
  (2, 'Super-Earth', 2, 10, 1, 4, 0, 1, 10),
  (3, 'Neptune-like', 10, 130, 4, 11, 1, 0, 30),
  (4, 'Gas Giant', 130, 4000, 11, 25, 1, 0, 300),
  (5, 'Altres', 0, 4000, 0, 25, 1, 1, 300);

INSERT INTO `compounds` (`CID`, `name`, `formula`) VALUES
(176, 'Acetic Acid', 'C2H4O2'),
(222, 'Ammonia', 'H3N'),
(241, 'Benzene', 'C6H6'),
(280, 'Ammonia', 'NH3'),
(281, 'Carbon Monoxide', 'CO'),
(284, 'Formic Acid', 'CH2O2'),
(297, 'Methane', 'CH4'),
(313, 'Hydrochloric Acid', 'ClH'),
(402, 'Hydrogen Sulfide', 'H2S'),
(702, 'Ethanol', 'C2H6O'),
(712, 'Formaldehyde', 'CH2O'),
(713, 'Formamide', 'CH3NO'),
(756, 'Glycolaldehyde', 'C2H4O2'),
(768, 'Hydrogen Cyanide', 'CHN'),
(783, 'Hydrogen', 'H2'),
(784, 'Hydrogen Peroxide', 'H2O2'),
(878, 'Methanethiol', 'CH4S'),
(887, 'Methanol', 'CH4O'),
(935, 'Nickel', 'Ni'),
(944, 'Nitric Acid', 'HNO3'),
(947, 'Nitrogen', 'N2'),
(962, 'Acetone', 'C3H6O'),
(977, 'Oxygen', 'O2'),
(984, 'Hexadecanal', 'C16H32O'),
(1118, 'Sulfuric Acid', 'H2O4S'),
(1119, 'Sulfur Dioxide', 'O2S'),
(1234, 'Gallopamil', 'C28H40N2O5'),
(2244, 'Methane', 'CH4'),
(4873, 'Potassium Chloride', 'ClK'),
(5234, 'Sodium Chloride', 'ClNa'),
(5793, 'Glucose', 'C6H12O6'),
(6324, 'Ethane', 'C2H6'),
(6326, 'Acetylene', 'C2H2'),
(6334, 'Propane', 'C3H8'),
(6348, 'Carbon Disulfide', 'CS2'),
(11029, 'Magnesium Carbonate', 'MgCO3'),
(11248, 'Ferrous Carbonate', 'CFeO3'),
(13635, '2,6,7-Trioxa-1-phosphabicyclo(2.2.2)octane, 4-ethyl-, 1-sulfide', 'C6H11O3PS'),
(14769, 'Corundum', 'Al2O3'),
(14781, 'Tribasic Calcium Phosphate', 'Ca5HO13P3'),
(14788, 'Pyrite', 'FeS2'),
(14792, 'Magnesium Oxide', 'MgO'),
(14798, 'Sodium Hydroxide', 'HNaO'),
(14819, 'Lead sulfide', 'PbS'),
(14821, 'Zinc Sulfide', 'SZn'),
(14828, 'Ferrous sulfide', 'FeS'),
(14833, 'Hematite', 'Fe2O3'),
(14917, 'Hydrofluoric Acid', 'FH'),
(14923, 'Ammonium Hydroxide', 'H5NO'),
(23925, 'Iron', 'Fe'),
(23935, 'Neon', 'Ne'),
(23968, 'Argon', 'Ar'),
(23987, 'Helium', 'He'),
(24261, 'Silicon Dioxide', 'O2Si'),
(24404, 'Phosphine', 'H3P'),
(24414, 'Barium Sulfate', 'BaSO4'),
(24497, 'Calcium sulfate', 'CaSO4'),
(24617, 'Fluorite', 'CaF2'),
(24823, 'Ozone', 'O3'),
(24843, 'Magnesium Sulfate Heptahydrate', 'H14MgO11S'),
(24928, 'Calcium Sulfate Dihydrate', 'CaSO4 . 2H2O'),
(25477, 'Chrysotile Asbestos', 'Mg3Si2H4O9'),
(25518, 'CID 25518', 'Al4H30Mg2O14S'),
(26042, 'Titanium Dioxide', 'O2Ti'),
(31423, 'Pyrene', 'C16H10'),
(61680, 'MAGNESIUM SILICATE (synthetic)', 'MgO3Si'),
(61833, 'Calcium magnesium carbonate', 'C2CaMgO6'),
(62465, '4-Ethylguaiacol', 'C9H12O2'),
(114918, 'Cinnabarinic acid', 'C14H8N2O6'),
(145068, 'Nitric Oxide', 'NO'),
(159367, 'Spinel', 'Al2MgO4'),
(159436, 'Ilmenite', 'FeH6O3Ti'),
(159832, 'Atomic oxygen', 'O'),
(160506, '(+-)-Desoxypipradrol', 'C18H21N'),
(160559, '2-Chloro-10-(3-(diethylamino)propionyl)-10H-phenothiazinium chloride', 'C19H22Cl2N2OS'),
(161640, '7-(4-ethyl-5-methyltriazol-2-yl)-3-(4-methyl-3H-1,2,4-triazol-2-yl)chromen-2-one', 'C17H18N6O2'),
(166755, '2,7-Naphthalenedisulfonic acid, 4-(2-(4-(2-(4-amino-1-naphthalenyl)diazenyl)-1-naphthalenyl)diazenyl', 'C30H19N5Na2O6S2'),
(170510, '1H-Indole-1-propanenitrile, 3-formyl-2-phenyl-', 'C18H14N2O'),
(439200, '[[(2R,3S,4R,5R)-5-(6-amino-7H-purin-9-ium-9-yl)-3,4-dihydroxyoxolan-2-yl]methoxy-hydroxyphosphoryl] ', 'C15H24N5O14P2+'),
(516889, 'Calcium carbonate (calcite)', 'CCaO3'),
(3032552, 'Nitrogen Dioxide', 'NO2'),
(3080680, 'Orthoclase', 'AlKO8Si3'),
(5359268, 'Aluminum', 'Al'),
(5360545, 'Sodium', 'Na'),
(5362487, 'Sulfur', 'S'),
(5460341, 'Calcium', 'Ca'),
(5461123, 'Silicon', 'Si'),
(5462222, 'Potassium', 'K'),
(5462224, 'Magnesium', 'Mg'),
(5462310, 'Carbon', 'C'),
(6335838, 'Aragonite', 'CH2CaO3'),
(6337066, 'Forsterite (Mg2(SiO4))', 'H4Mg2O4Si'),
(10207414, 'Fluorapatite', 'Ca5FO12P3'),
(13726185, 'Fayalite', 'Fe2O4Si'),
(15972344, 'Ethynylbenzene;methyl(triphenyl)phosphanium;1,2,3,4,5-pentafluorobenzene-6-ide;platinum(2+)', 'C66H46F10P2Pt'),
(15976549, '(2S)-2-[[(4R)-17-[methyl(methylsulfonyl)amino]-2-oxo-3-azatricyclo[13.3.1.16,10]icosa-1(18),6,8,10(2', 'C31H42N4O4S'),
(16217398, 'L-Asparagine-13C4 monohydrate', 'C4H10N2O4'),
(19601290, 'Chalcopyrite', 'CuFeS2'),
(56843091, 'Calcium aluminosilicate (CaAl2Si2O8)', 'Al2CaO8Si2'),
(71300855, 'Kaolinite', 'Al2H4O9Si2'),
(71586775, 'Montmorillonite', 'Al2H2O12Si4'),
(85782665, 'Fire ice', 'C4H62O23'),
(92027383, 'Muscovite', 'Al2K2O6Si'),
(129628182, 'Jarosite', 'Fe3H12KO14S2-3'),
(154706400, 'Almandine', 'Al2Fe3O12Si3'),
(165411828, 'Talc', 'H2Mg3O12Si4');

