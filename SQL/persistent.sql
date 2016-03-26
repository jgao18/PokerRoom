-- Table structure for table `users`

CREATE TABLE IF NOT EXISTS `users` (
  `user_key` char(8) NOT NULL PRIMARY KEY,
  `username` varchar(30) NOT NULL UNIQUE,
  `pwd` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for table `sessions`

CREATE TABLE IF NOT EXISTS `sessions` (
  `sid` varchar(40) NOT NULL PRIMARY KEY,
  `expiry` int(10) unsigned NOT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for table `autologin`

CREATE TABLE IF NOT EXISTS `autologin` (
  `user_key` char(8) NOT NULL,
  `token` char(32) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data` text,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_key`, `token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Change the value of ENGINE to MyISAM
-- if your server doesn't support InnoDB