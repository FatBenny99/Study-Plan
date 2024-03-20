"use strict"

function Exam(code,name,credits,maxstudents,enrolledstudents,preparatory=[],incompatibility=[])
{
    this.code=code;
    this.name=name;
    this.credits=credits;
    this.maxstudents=maxstudents;
    this.enrolledstudents=enrolledstudents;
    this.preparatory=preparatory;
    this.incompatibility=incompatibility;
}

module.exports=Exam;