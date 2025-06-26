select ceil(2.1123), floor(2.1123), round(2.1123), conv('FF', 16, 10);
select date_format('2018-02-03', '%Y-%d-%m %h %i %s');
select date_format(now(), '%Y-%m-%d %h %i %s');

set time_zone = 'Asia/Seoul';
select hex(aes_encrypt(ename, 'salt')) from Emp;
select cast( aes_decrypt( aes_encrypt(ename, 'salt'), 'salt') as char )  from emp; -- 양방향 암호 , 
select sha2('test', 256); -- 단방향 암호 , 개인정보 보호법에서는 256 이상
select sha2('test', 512); 

select lpad( 123, 10, '0');
select rpad( 123, 10, '0');
select concat('2025', lpad(5,2,'0'), lpad(9,2,'0') );

select '12' regexp '[a-z29]'; 
-- 시험에 나옴 --
select regexp_replace('abc def ghi', '[a-z]+', 'X', 2, 2);
select regexp_replace('abc def ghi', '[f-z]+', 'X', 2, 2);

select now(), sysdate(), curdate(), curtime();
select weekday('2025-05-26'); -- 월 [00]

select MAKEDATE(2025, 365); -- 2025-12-31
select time_to_sec('2025-11-31');
select REGEXP_INSTR('dog cat dog', 'dog', 9); 

-- length 바이트 수 
-- 세션 별로 메모리 풀 이 생성됨, 인덱스 , 쿼리 등에 대한 정보가 기록됨 트랜잭션도 세션 별로 관리
-- ddl 은 자동적으로 commit 하기 때문에 세션 별로 이루어지지 않음 ( 전체 적용됨 )
start transaction;
 SavePoint x;
 
 -- x가 적용된 후의 뷰를 볼 수 있음.
 SavePoint y;
rollback;


select *
  from Subject b left outer join Prof p on b.prof; -- 다 나와야 하는 정보가 기준;
  
  select * from Subject;
  alter table Subject modify column prof varchar(31);
insert into Subject(name, prof) values('하나셋', 2), ('하나넷',3);

-- 뷰 는 읽기 전용 파일이라고 생각하면 됨.
-- DB 관리자와 프로그래머의 작업을 분리할 수 있음.
-- 프로그래머는 뷰만 신경쓰고 작업하면 됨. 보안상의 이점과 쿼리가 단순화 됨.
-- grant all privileges testdb.v_subject to xuser@'%';

-- Dept 테이블에 empcnt 컬럼 추가하고, Emp 테이블의 Trigger를 이용하여 부서별 직원수를 관리하시오.
alter table Dept add column empcnt smallint unsigned not null default 0;
select * from Dept;
update Dept d set empcnt = ( select count(*) from Emp where dept = d.id );

select * from Dept;
select * from Emp;

select id, f_empinfo(id) from emp;
update emp set dept = null where id = 33;
update emp set dept = null where id = 4;
select f_empinfo(99999);

select f_empinfo(captain) capName from dept;

select d.*, e.ename as capName, ( select avg(salary) from Emp where Emp.dept = d.id )
from Dept d left outer join Emp e on e.dept = d.id;

select *
  from Dept d
  inner join (select dept, avg(salary) from Emp e group by dept) adept on d.id = adept.dept inner join Emp e on d.captain = e.id;
  
  -- prepared statement : 캐시를 위해 ' ? ' 를 활용해서 쿼리 문자열을 보내줌.
  -- statement : 문자열 그대로 갈때, 다만 매번 새로 컴파일 될 확률이 있다.
  -- callable statement : 프로시저를 호춣 할 경우
  
  -- cursor 를 쓰면 모든 레코드를 불러올 필요가 없어서 효율적이다.
  -- 조인같은 경우 모든 테이블을 조인하지만
  -- 커서로 불러와서 메모리에서 조인과 비슷한 연산을 처리할 수 있다.
  

select min(salary), sum(case when salary = 100 then 1 else 0 end) from emp where dept = 1;

select minsal, sum(case when salary = min(salary) then 1 else 0 end) from (select min(salary) minsal from Emp where dept = 1) sub;

call sp_deptinfo('임');

call sp_dept_sal();

-- ~ 90 ppt page