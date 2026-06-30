USE mysql;

DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
id INT NOT NULL AUTO_INCREMENT,
username VARCHAR(100) NOT NULL,
email VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id),
UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE routes (
id INT NOT NULL AUTO_INCREMENT,
route_name VARCHAR(255) NOT NULL,
region VARCHAR(100) NOT NULL,
difficulty VARCHAR(50) NOT NULL,
duration_hours DECIMAL(4,1) NOT NULL,
description TEXT NOT NULL,
created_by INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
is_circular TINYINT(1) NOT NULL DEFAULT 0,
suitable_dogs TINYINT(1) NOT NULL DEFAULT 0,
suitable_babies TINYINT(1) NOT NULL DEFAULT 0,
romantic TINYINT(1) NOT NULL DEFAULT 0,
water_entry TINYINT(1) NOT NULL DEFAULT 0,
PRIMARY KEY (id),
FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (id, username, email, password, created_at)
VALUES
(1, 'Avi', '[aviaizman@gmail.com](mailto:aviaizman@gmail.com)', 'avi270900', '2026-06-23 08:34:51'),
(2, 'NoamL', '[noam6771@gmail.com](mailto:noam6771@gmail.com)', 'noam6771', '2026-06-23 08:34:51'),
(3, 'HilaBoss', '[hilaisra@post.bgu.ac.il](mailto:hilaisra@post.bgu.ac.il)', 'hila12345', '2026-06-23 08:34:51'),
(4, 'Itzik', '[itzik@gmail.com](mailto:itzik@gmail.com)', 'itzik123456', '2026-06-23 08:34:51'),
(5, 'Paz', '[Paz123456@gmail.com](mailto:Paz123456@gmail.com)', 'paz123456', '2026-06-23 08:34:51');

INSERT INTO routes
(id, route_name, region, difficulty, duration_hours, description, created_by, created_at,
is_circular, suitable_dogs, suitable_babies, romantic, water_entry)
VALUES
(1, 'Forest Trail', 'north', 'easy', 2.5, 'A calm forest route suitable for families.', 1, '2026-06-16 11:17:46', 1, 1, 1, 0, 0),
(2, 'Desert View', 'south', 'medium', 4.0, 'A desert hiking route with beautiful views.', 1, '2026-06-16 11:17:46', 0, 0, 0, 1, 0),
(3, 'Mountain Challenge', 'north', 'hard', 6.0, 'A challenging mountain trail for experienced hikers.', 2, '2026-06-16 11:17:46', 0, 0, 0, 1, 0),
(4, 'The butterfly highway', 'south', 'medium', 1.5, 'A beautiful route to visit with friends', 1, '2026-06-16 11:59:11', 1, 1, 1, 1, 0),
(5, 'angels in the dessert', 'south', 'hard', 6.0, 'not an easy trail but when you reach the you fill like youre an angel in the sky', 1, '2026-06-16 12:08:54', 0, 0, 0, 1, 0),
(6, 'Beit Zait Seher', 'center', 'easy', 2.0, 'An achzav lake, nice place to picnic', 1, '2026-06-16 12:13:12', 1, 1, 1, 1, 1),
(7, 'Tel Aviv Yaffo', 'center', 'easy', 3.5, 'Can eat very good at Shuk Hacrmel', 1, '2026-06-16 12:20:57', 1, 1, 1, 1, 0),
(8, 'Shoham Forest Trail', 'center', 'easy', 2.0, 'A calm forest trail near Shoham with shaded paths and picnic areas.', 1, '2026-06-23 09:00:43', 1, 1, 1, 0, 0),
(9, 'Ben Shemen Forest Trail', 'center', 'medium', 3.5, 'A popular forest route near Modi''in with wide paths and nature views.', 2, '2026-06-23 09:00:43', 1, 1, 1, 0, 0),
(10, 'Nahal Poleg Trail', 'center', 'easy', 2.5, 'A pleasant trail near Netanya with nature, sand areas and open views.', 3, '2026-06-23 09:00:43', 0, 1, 1, 0, 0),
(11, 'Hof HaSharon Trail', 'center', 'medium', 3.0, 'A coastal cliff trail with beautiful views of the Mediterranean Sea.', 4, '2026-06-23 09:00:43', 0, 1, 0, 1, 1),
(12, 'Mekorot HaYarkon Trail', 'center', 'easy', 2.0, 'A green route near the Yarkon sources with water views and easy walking.', 5, '2026-06-23 09:00:43', 1, 1, 1, 0, 0),
(13, 'Tel Afek Trail', 'center', 'easy', 1.5, 'A short route in Tel Afek National Park with history, lake views and open spaces.', 1, '2026-06-23 09:00:43', 1, 0, 1, 1, 0),
(14, 'Nahal Kziv Trail', 'north', 'medium', 5.0, 'A beautiful Galilee trail with flowing water, shade and natural pools.', 2, '2026-06-23 09:00:43', 0, 0, 0, 1, 1),
(15, 'Gamla Waterfall Trail', 'north', 'medium', 3.0, 'A scenic trail in the Golan Heights leading toward the Gamla waterfall area.', 3, '2026-06-23 09:00:43', 0, 0, 0, 1, 0),
(16, 'Mount Bental Trail', 'north', 'easy', 2.0, 'A short Golan Heights route with volcanic landscape and wide views.', 4, '2026-06-23 09:00:43', 1, 1, 1, 1, 0),
(17, 'Nahal Snir Trail', 'north', 'easy', 2.5, 'A green northern trail near flowing water and shaded walking areas.', 5, '2026-06-23 09:00:43', 0, 0, 1, 1, 1),
(18, 'Ein Gedi David Waterfall Trail', 'south', 'medium', 3.0, 'A famous desert oasis route with waterfalls, cliffs and wildlife.', 1, '2026-06-23 09:00:43', 0, 0, 0, 1, 1),
(19, 'Timna Park Arches Trail', 'south', 'medium', 3.5, 'A desert route in Timna Park with colorful rock formations and arches.', 2, '2026-06-23 09:00:43', 1, 0, 0, 1, 0),
(20, 'Nahal Tamar Trail', 'south', 'hard', 4.0, 'A challenging desert route with ladders, cliffs and impressive views.', 3, '2026-06-23 09:00:43', 0, 0, 0, 1, 0),
(21, 'Ein Kobi Trail', 'jerusalem', 'easy', 2.0, 'A peaceful Jerusalem hills route with a spring, terraces and forest scenery.', 4, '2026-06-23 09:00:43', 1, 1, 1, 1, 1),
(22, 'Castel National Park Trail', 'jerusalem', 'easy', 1.5, 'A short historical trail near Jerusalem with views and open walking paths.', 5, '2026-06-23 09:00:43', 1, 0, 1, 0, 0),
(23, 'Desert Saara', 'south', 'hard', 3.0, 'A desert water route with beautiful views.', 1, '2026-06-23 10:26:01', 1, 0, 1, 0, 0);
