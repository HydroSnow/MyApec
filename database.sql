
CREATE TABLE `offers` (
  `id` varchar(16) NOT NULL AUTO_INCREMENT,
  `salary` int(11) DEFAULT NULL,
  `experience` int(11) DEFAULT NULL,
  `city` varchar(256) DEFAULT NULL,
  `date` date NOT NULL,
  `contract` varchar(256) DEFAULT NULL,
  `society` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `keywords` (
  `id_skill` int(11) NOT NULL,
  `word` varchar(256) NOT NULL,
  FOREIGN KEY (`id_skill`) REFERENCES `skills` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `matches` (
  `id_offer` varchar(16) NOT NULL,
  `id_skill` int(11) NOT NULL,
  PRIMARY KEY (`id_offer`,`id_skill`),
  FOREIGN KEY (`id_offer`) REFERENCES `offers` (`id`),
  FOREIGN KEY (`id_skill`) REFERENCES `skills` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
