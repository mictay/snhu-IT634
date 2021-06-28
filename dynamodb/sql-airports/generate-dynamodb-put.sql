select 
concat(
'{"PutRequest":{"Item":{'
'"pk": {"S": "airports"}, ',
'"sk": {"S": "', UPPER(`icao`) ,'"}, ',
'"gpk1": {"S": "airports"}, ',
'"gsk1": {"S": "', UPPER(`state`),'"}, ',
'"gpk2": {"S": "airports"}, ',
'"gsk2": {"S": "', UPPER(`country`),'"}, ',
'"lsk1": {"S": "', UPPER(REPLACE(`name`, "'", "`")), '"}, ',
'"lsk2": {"S": "', UPPER(REPLACE(`city`, "'", "`")), '"}, ',
'"name": {"S": "', REPLACE(`name`, "'", "`"),'"}, ',
'"city": {"S": "', REPLACE(`city`, "'", "`"),'"}, ',
'"state": {"S": "', `state` ,'"}, ',
'"country": {"S": "', `country` ,'"}, ',
'"elevation": {"N": "', `elevation`, '"}, ',
'"lat": {"N": "', `lat` ,'"}, ',
'"lon": {"N": "', `lon`, '"}, ',
'"tz": {"S": "', `tz`, '"}, ',
IF( LOCATE(`city`,`name`) = 0, 
	CONCAT('"displayName": {"S": "', TRIM(REPLACE(`name`, "'", "`")), ' ', TRIM(REPLACE(`city`, "'", "`")), ', ', `state`, ' ', `country` , '"}'),
    CONCAT('"displayName": {"S": "', TRIM(REPLACE(`name`, "'", "`")), ', ', `state`, ' ', `country` , '"}')
),
'}}},'
) as notes
from `airports` order by `icao`;

select * from airports where `icao` like '%MCO%';

update airports set state = city where state = '' and city != '';
update airports set city = REPLACE(name, 'Airport', ''), state = REPLACE(name, 'Airport', '') where state = '' and city = '';
update airports set city = REPLACE(name, 'Airport', '');
update airports set name = REPLACE(name, '``', '`');
update airports set city = REPLACE(city, '``', '`');
update airports set state = REPLACE(state, '``', '`');

select icao, count(icao) as cnt from airports group by icao order by cnt;
select * from airports where icao = 'ZYXC';

select * from airports where name like 'orlando%';