DROP TABLE IF EXISTS `flights`;

CREATE TABLE `flights` (
  `id` varchar(10) NOT NULL,
  `from_airport_code` varchar(4) NOT NULL,
  `to_airport_code` varchar(4) NOT NULL,
  `cost_per_adult` decimal(7,2) NOT NULL DEFAULT '0.00',
  `cost_per_child` decimal(7,2) NOT NULL DEFAULT '0.00',
  `time_depart` time NOT NULL,
  `time_arrive` time DEFAULT NULL,
  `seats_available` int DEFAULT '200',
  PRIMARY KEY (`id`)
);

-- 3 flights leaving every day from Orlando to Las Vegas
insert into flights (`id`, `from_airport_code`, `to_airport_code`, `cost_per_adult`, `cost_per_child`, `time_depart`, `time_arrive`) values ('FLT-001', 'KMCO', 'KLVS', 99.99, 49.99, '08:00:00', '12:00:00');
insert into flights (`id`, `from_airport_code`, `to_airport_code`, `cost_per_adult`, `cost_per_child`, `time_depart`, `time_arrive`) values ('FLT-002', 'KMCO', 'KLVS', 99.99, 49.99, '12:00:00', '16:00:00');
insert into flights (`id`, `from_airport_code`, `to_airport_code`, `cost_per_adult`, `cost_per_child`, `time_depart`, `time_arrive`) values ('FLT-003', 'KMCO', 'KLVS', 99.99, 49.99, '16:00:00', '20:00:00');

-- 3 flights leaving every day from Las Vegas to Orlando
insert into flights (`id`, `from_airport_code`, `to_airport_code`, `cost_per_adult`, `cost_per_child`, `time_depart`, `time_arrive`) values ('FLT-004', 'KLVS', 'KMCO', 99.99, 49.99, '08:00:00', '12:00:00');
insert into flights (`id`, `from_airport_code`, `to_airport_code`, `cost_per_adult`, `cost_per_child`, `time_depart`, `time_arrive`) values ('FLT-005', 'KLVS', 'KMCO', 99.99, 49.99, '12:00:00', '16:00:00');
insert into flights (`id`, `from_airport_code`, `to_airport_code`, `cost_per_adult`, `cost_per_child`, `time_depart`, `time_arrive`) values ('FLT-006', 'KLVS', 'KMCO', 99.99, 49.99, '16:00:00', '20:00:00');

select * from flights


