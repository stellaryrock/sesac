use testdb;
select * from emp;

-- varchar 최대 16 KB


select e.id, d.pid from emp e, dept d ;

-- 16KB 는 메모리 페이지 크기, 레코드의 최소 단위
-- text 는 별개의 공간에 힙으로 저장된다.

CREATE TABLE  Student (
	id int unsigned not null auto_increment PRIMARY KEY COMMENT '학번',
	name varchar(31) not null COMMENT '학생명',
	createdate timestamp DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
	updatedate timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '작업일시',
	graduatedt varchar(10) DEFAULT NULL COMMENT '졸업일',
	auth tinyint(1) unsigned NOT NULL DEFAULT 9 COMMENT '0:sys, 1:super, ...9:guest',
	 FOREIGN KEY <key-name>(col3)
       REFERENCES Tbl1(id) ON [DELETE|UPDATE] [CASCADE | SET NULL | NO ACTION | SET DEFAULT | RESTRICT]
  	 UNIQUE KEY unique_stu_id_name (createdate, name)
);


-- 조인되면 foreign key 기준으로 정렬됨
alter table Student add column birthdt timestamp not null;
alter table Student add column major varchar(31) not null;
alter table Student add column mobile varchar(31) not null;
alter table Student add column email varchar(31) not null;

-- 김1수, 김2수, 김3수, 김4수
insert into Student( name, birthdt, major, mobile, email ) values ('김4수', '19900101', 1, '0100100004', '4@gmail.com') ;
insert into Student( name, birthdt, major, mobile, email ) values ('김1수', '19900101', 2, '0130100004', '1@gmail.com') ;
insert into Student( name, birthdt, major, mobile, email ) values ('김2수', '19900101', 3, '0110100004', '2@gmail.com') ;

alter table Student modify column major varchar(31);

update Student set major = null where id =3 ;

select s.*, m.name from Student s inner join Major m on s.major = m.id;

select s.*, m.name from Student s left outer join Major m on s.major = m.id;

-- rename table A to B;
-- create table <table-name> AS select * from A;

create table StudentLike like Student;
select * from StudentLike;
select * from Student;

create table StudentBackup AS select * from Student; -- 백업해놓는 방법1. , 인덱스는 오지 않는다. 데이터만 옵니당.
show create table StudentLike;

insert into StudentLike select * from StudentBackup;
-- 최소한 6번 이상 쳐보기
-- group by, cte, window

-- drop, create 
drop table StudentBackup;
drop table StudentLike;

-- UTC- 시간대 맞춰줄 때, time_zone
set time_zone = 'Asia/Seoul';

use testdb;
select * from dept;

-- 외래키를 INDEX 걸어주면 join 성능이 조금 더 좋아진다.
alter table dept add column captain int unsigned null;
alter table dept add constraint fk_Dept_captain_Emp_ foreign key (captain) references Emp(id) on update cascade on delete set null;
show index from Dept;


create table EmailLog(
  id int unsigned not null auto_increment primary key,
  sender int unsigned not null comment '발신자',
  receiver varchar(1024) not null comment '수신자',
  subject varchar(255) not null default '' comment '제목',
  body text null comment '내용',
  foreign key fk_EmailLog_sender_Emp (sender)
    references Emp(id) on update cascade on delete no action
) ENGINE = MyIsam;

-- Innodb(가볍고 빠르다.) , MyIsam, MemoryDB
-- 트랜잭션 메모리에 일단 올려놓고 COMMIT 하면 적용한다,
-- COMMIT 이전에는 기존 값으로 READ 결과 반환.

-- COMMIT 10초 걸리는데 5초에 팅기면 ROLLBACK;
select last_insert_index();

-- 재귀함수 형태로 commit 확인하고 commit 안되면 rollback 하고 다시 insert 한다.
-- two - phase - commit 이라고 부른다고 하심.

select * from EmailLog;

create table Prof(
	id smallint unsigned not null primary key auto_increment,
    name varchar(31) not null,
    likecnt int not null default 0
);
-- 빨리 만들어보기 위해 일단 int 로 하는 것도 괜찮다.
create table Subject(
	id mediumint unsigned not null primary key auto_increment,
    name varchar(15),
    prof smallint unsigned null,
    
    foreign key fk_Subject_prof_Prof_id (prof)
    references Prof(id) on update cascade on delete set null
);
-- reverse engineering 으로 ERD
create table Eroll(
    id int unsigned not null primary key auto_increment,
    student int unsigned not null,
    subject mediumint unsigned not null,
    foreign key fk_Enroll_student_Student_id (student) references Student(id) on update cascade on delete cascade,
    foreign key fk_Enroll_subject_Subject_id (subject) references Subject(id) on update cascade on delete cascade
);

-- or 연산은 UNION 쿼리1 쿼리2 이라 생각하면 됨.
drop table Prof; -- 에러!
drop table Subject;
drop table Prof;

select * from Emp where dept = (select max(id) from Dept); 
select * from Emp where dept = (select min(id) from Dept);

select * from Emp where (dept, dept) = (select max(id), min(id) from Dept);
select * from Emp
 where dept in (select min(id) from Dept UNION select max(id) from Dept) order by dept;
 
 select dept, sum(salary) from Emp; -- 에러
 select max(dept), sum(salary) from Emp;
 select sum(salary), avg(salary) from Emp; -- group by 가 오거나 전부
-- group by : ~ 별로
select * from dept;
select dept , avg(salary) from Emp group by dept;

select dept, avg(salary) avgsal from Emp group by dept having avgsal > (select avg(salary) from Emp);

-- 부서 별 급여 평균이 전체 평균보다 높은 부서의 id 와 평균 급여 를 구하시오.
-- selcet 에 있는 서브 쿼리는 매 레코드마다 실행되므로 주의해야함.
select dept, (select name from Dept where id = dept), avg(salary) avgsal from Emp group by dept having avgsal > (select avg(salary) from Emp);

-- 서브쿼리보다는 조인이 성능이 좋다.
select main.dept, d.dname , main.avgsal 
from (select dept, avg(salary) avgsal 
from Emp group by dept having avgsal > (select avg(salary) from Emp)) main
inner join Dept d on main.dept = d.id;

-- group by 에 없는 컬럼은 집계함수를 걸어주는 것이 표준입니다.
select e.dept, max(d.dname), avg(salary) avgsal from Emp e inner join Dept d on e.dept = d.id 
group by e.dept having avgsal > (select avg(salary) from Emp);

select main.dept , d.dname, main.avgsal from ( ~ ) -- 서브 쿼리는 성능이 좋지 않다.

-- 조인으로 하는 것이 성능이 더 좋다. ( 외래키는 인덱스간의 연산이기 때문에 속도가 빠르다.)

-- 전체 평균보다 더 높은 급여를 가진 직원 목록을 출력하시오. (부서id, 부서명, 직원id, 직원명, 급여)
select dept, d.dname
from Emp e inner join Dept d on e.dept = d.id
where salary > (select avg(salary) from Emp);

select id, name, salary
from Emp
where salary = (
select dept, max(salary)
from Emp
-- where
group by Dept);
-- having

select e.dept, e.ename, d.dname, e.id, e.salary
from Emp e 
inner join ( select dept, max(salary) maxsal from Emp group by dept ) ms 
on e.dept = ms.dept and e.salary = ms.maxsal 
inner join Dept d on 
e.dept = d.id;

create table Major(
 id smallint unsigned auto_increment primary key comment '학과번호',
 name varchar(31) not null comment '학과명'
);

insert Major(name) values('철학과');
insert Major(name) values('컴공과');
insert Major(name) values('건축과');

-- call 프로시저
-- cursor = 다음 작업을 위한 포인터

-- ~ 47 page
use testdb;
select dept, min(ename) from Emp group by dept;

select * from emp;

select * from Student s inner join Major m on s.major = m.id where s.id in (1,3);
select * from Major;

select * from Student where name like '김%';
select * from Major where name like '%학과';

select * from Student s inner join Major m on s.major = m.id;

select * from Student s inner join Major m on s.major = m.id where s.name like '김%';

desc Prof;

alter table Major add column prof smallint unsigned null comment '담당교수';

alter table Student add column gender int default 1;

-- update 이든 delete 를 하든 select 를 먼저 해본후 갱신해야 사고를 안침.
select * from Student 
 -- update Sutdent set gender = 1
 where id = 4;
 
 select * from Student s
 -- update Student s set gender = 0 
 where s.id =1 ;

select * from Student s
-- update Student s 
--   set gender = 1
where s.id > 2;

select * from Prof;
insert into Prof(name) values('김교수'),('박교수'),('최교수');


-- 두 테이블을 수정하기 위해 조인 후 update
update Student s inner join Major m on s.major = m.id
  set  s.gender = 1, m.prof = 2
where  m.id > 2;

start Transaction;
	
-- delete d from 테이블은 하나만 가능!, 여러 테이블을 연계해서 지울 때는 join


rollback;


select * from Emp;

-- Dept 테이블에 이름이 가장 빠른 직원(가나다 순)을 captain으로 update 하시오.
select dept, min(e.ename)
 from emp e
 group by dept;
 
-- select 먼저 !
select d.id, d.name , ( select min(name) from Emp where dept = d.id ) from Dept d;

update Dept d 
set captain = (select min(ename) from Emp where dept = d.id);

select * from Dept d inner join ( select min(ename) from Emp where dept = d.id ) ; 

select e.*, m.minName 
from Emp e inner join (select dept, min(ename) minName from Emp group by dept) m on e.dept = m.dept and e.ename = m.minName;

select d.*, m.*, e.*
from Dept d inner join ( select dept, min(ename) minName from Emp group by dept ) m on d.id = m.dept 
inner join Emp e on m.dept = e.dept and m.minName = e.ename;

alter table Emp add column outdt datetime null default null;
select * from Emp where id in (3,5);

update Emp set outdt = '2025-04-25' where id in (3,5);

select *
from Emp e inner join Dept d on e.id = d.captain
where e.id in (14, 26);

update Emp e left outer join Dept d on e.id = d.captain
  set e.outdt = curdate(), d.captain = null
where e.id in (14,26);

select * from emp;
set d.captain = e.id;
use testdb;


alter table emp add column remark json;
select * from emp;

update emp set remark = json_object('id',5,'age',44, 'fam', json_array( json_object('id', 7), json_object('id', 10)  ) ) where id = 5;

select id, remark->'$.age' from emp where id = 5;

select id, remark->'$.fam' from emp where id = 5;

select remark -> '$.fam[0 to 1 ]' from emp where id = 5;

update emp
   set remark = json_set(remark, '$.name','홍길동', '$.age') where id = 7;

select remark from Emp where id in (2,3,4);

select e.*, d.dname
  from Emp e inner join Dept d on e.remark->'$.id' = d.id
 where e.id <= 5;
 
 -- json type indexing
 -- json 타입 자체는 인덱싱이 안되므로, json 내부의 값을 캐스팅하여 인덱싱을 건다. 
 alter table Emp add index index_Emp_remark_famxx ((
 cast(remark->>'$.fam[*].name' as char(255) array)
));

select * from Emp where remark->'$.fam[0].name' = '유세찬';

show index from Emp;

explain select * from Emp where ename like '김%';

update emp set remark = null where id = 7;
select * from emp where id = 7;

explain select * from Emp where id > 0 limit 1000, 10;
explain select * from Emp where id < -10 or id > 10;
explain select * from emp where id in (1,3,5);
explain select * from emp where id in (1,2,3);

show variables like 'innodb_ft%';

-- dname, avg, min, max 
select * 
  from Emp e inner join dept d on e.dept = d.id
  group by e.dept;
  
select * from Notice where match(title, contents) against ('조선');  















