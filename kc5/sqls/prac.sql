select * from emp;
select * from dept;
-- 직원 목록에 부서명도 함께 출력하세요
select e.*, d.*
from Emp e inner join Dept d on e.id = d.id ;

-- 전체 급여 평균보다 더 높은 급여를 가진 직원 목록을 출력하시오.(부서id, 부서명, 직원id, 직원명, 급여)
desc emp;
select count(id) from emp where salary > ( select avg(salary) from emp ); 
select * from emp where salary > ( select avg(salary) from emp ); 

-- 부서 별 최고 급여자 목록을 추출하시오. (부서별 1명씩)
select max(salary) from emp group by dept;
select * from emp e inner join ( select dept, max(salary) maxsal from emp e inner join dept d on e.id = d.id group by dept ) j on e.salary = j.maxsal ;
select e.*, d.* from emp e inner join dept d on e.dept = d.id;

select * from Emp
-- update Emp set salary = 901 + dept 
where id in (152, 97,18,80,133,47,128) order by id asc;

select * 
from emp 
inner join 
(select dept, max(salary) maxsal from emp group by dept) deptsal 
on emp.salary = deptsal.maxsal 
order by emp.dept;

select * from emp e where e.salary = 800 and ename = '배파나';

alter table emp add column outdt datetime null;

update emp set outdt = '2025-04-25' where emp.id in (3, 5);
select * from emp;



-- Dept 테이블에 이름이 가장 빠른 직원(가나다 순)을 captain 으로 update 하시오.
