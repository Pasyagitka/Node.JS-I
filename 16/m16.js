const mssql = require('mssql');
const config = {user: 'Node.JS', password: 'node', server: 'localhost', database: 'Node.js14',  options: {trustServerCertificate: true }};

function DB (cb) { 
    this.getFaculties = async() => (await (new mssql.Request()).query("select faculty.faculty, faculty.faculty_name from faculty")).recordset;
    this.getPulpits  =  async() => (await (new mssql.Request()).query("select pulpit.pulpit, pulpit.pulpit_name,  pulpit.faculty from pulpit")).recordset;
    this.getSubjects =  async() => (await (new mssql.Request()).query("select subject, subject_name, pulpit from subject")).recordset;
    this.getTeachers =  async() => (await (new mssql.Request()).query("select teacher, teacher_name, pulpit from teacher")).recordset;

    this.getFaculty =   async(faculty) => (await (new mssql.Request()).input('faculty', mssql.NVarChar, faculty).query("select faculty.faculty, faculty.faculty_name from faculty where faculty = @faculty")).recordset;
    this.getPulpit  =   async(pulpit)  => (await (new mssql.Request()).input('pulpit', mssql.NVarChar, pulpit).query("select pulpit.pulpit, pulpit.pulpit_name,  pulpit.faculty from pulpit where pulpit = @pulpit")).recordset;
    this.getSubject =   async(subject) => (await (new mssql.Request()).input('subject', mssql.NVarChar, subject).query("select subject, subject_name, pulpit from subject where subject = @subject")).recordset;
    this.getTeacher =   async(teacher) => (await (new mssql.Request()).input('teacher', mssql.NVarChar, teacher).query("select teacher, teacher_name, pulpit from teacher where teacher = @teacher")).recordset;

    this.insertFaculty = async (faculty) => {
        const r = await (new mssql.Request())
            .input('faculty', mssql.NVarChar, faculty.faculty)
            .input('faculty_name', mssql.NVarChar, faculty.facultyname)
            .query('insert faculty(faculty, faculty_name) values (@faculty, @faculty_name)');
        let res = [];
        ({ faculty: res.faculty, facultyname: res.faculty_name } = faculty);
        return res;
    };

    this.insertPulpit = async (pulpit) => {
        const r = await (new mssql.Request())
            .input('pulpit', mssql.NVarChar, pulpit.pulpit)
            .input('pulpit_name', mssql.NVarChar, pulpit.pulpitname)
            .input('faculty', mssql.NVarChar, pulpit.faculty)
            .query('insert pulpit(pulpit, pulpit_name, faculty) values (@pulpit, @pulpit_name, @faculty)');
        let res = [];
        ({ pulpit: res.pulpit, pulpitname: res.pulpit_name, faculty: res.faculty } = pulpit);
        return res;
    };   

    this.insertTeacher = async (teacher) => {
        const r = await (new mssql.Request())
            .input('teacher', mssql.NVarChar, teacher.teacher)
            .input('teacher_name', mssql.NVarChar, teacher.teachername)
            .input('pulpit', mssql.NVarChar, teacher.pulpit)
            .query('insert teacher(teacher, teacher_name, pulpit) values (@teacher, @teacher_name, @pulpit)');
        let res = [];
        ({ teacher: res.teacher, teachername: res.teacher_name, pulpit: res.pulpit } = teacher);
        return res;
    };


    this.insertSubject = async (subject) => {
        const r = await (new mssql.Request())
            .input('subject', mssql.NVarChar, subject.subject)
            .input('subject_name', mssql.NVarChar, subject.subjectname)
            .input('pulpit', mssql.NVarChar, subject.pulpit)
            .query('insert subject(subject, subject_name, pulpit) values (@subject, @subject_name, @pulpit)');
        let res = [];
        ({ subject: res.subject, subjectname: res.subject_name, pulpit: res.pulpit } = subject);
        return res;
    };

    this.updateFaculty = async (faculty) => {
        const r = await (new mssql.Request())
            .input('faculty', mssql.NVarChar, faculty.faculty)
            .input('faculty_name', mssql.NVarChar, faculty.facultyname)
            .query('update faculty set faculty_name = @faculty_name where faculty = @faculty');
        let res = [];
        ({ faculty: res.faculty, facultyname: res.faculty_name } = faculty);
        return (r.rowsAffected[0] === 0) ? null : res;
    };

    this.updatePulpit = async (pulpit) => {
        const r = await (new mssql.Request())
            .input('pulpit', mssql.NVarChar, pulpit.pulpit)
            .input('pulpit_name', mssql.NVarChar, pulpit.pulpitname)
            .input('faculty', mssql.NVarChar, pulpit.faculty)
            .query('update pulpit set pulpit_name = @pulpit_name, faculty = @faculty where pulpit = @pulpit');
        let res = [];
        ({ pulpit: res.pulpit, pulpitname: res.pulpit_name, faculty: res.faculty } = pulpit);
        return (r.rowsAffected[0] === 0) ? null : res;
    };

    this.updateTeacher = async (teacher) => {
        const r = await (new mssql.Request())
            .input('teacher', mssql.NVarChar, teacher.teacher)
            .input('teacher_name', mssql.NVarChar, teacher.teachername)
            .input('pulpit', mssql.NVarChar, teacher.pulpit)
            .query('update teacher set teacher_name = @teacher_name, pulpit = @pulpit where teacher = @teacher');
        let res = [];
        ({ teacher: res.teacher, teachername: res.teacher_name, pulpit: res.pulpit } = teacher);
        return (r.rowsAffected[0] === 0) ? null : res;
    };

    this.updateSubject = async (subject) => {
        const r = await (new mssql.Request())
            .input('subject', mssql.NVarChar, subject.subject)
            .input('subject_name', mssql.NVarChar, subject.subjectname)
            .input('pulpit', mssql.NVarChar, subject.pulpit)
            .query('update subject set subject_name = @subject_name, pulpit = @pulpit where subject = @subject');
        let res = [];
        ({ subject: res.subject, subjectname: res.subject_name, pulpit: res.pulpit } = subject);
        return (r.rowsAffected[0] === 0) ? null : res;
    };


    this.delFaculty = async (faculty) => {
        const r = await (new mssql.Request()).input('faculty', mssql.NVarChar, faculty)
            .query(`update pulpit set faculty = null where faculty = @faculty; 
                    delete from faculty where faculty = @faculty`);
        return (r.rowsAffected[1] == 0) ? { result: false } : { result: true };
    };
        
    this.delPulpit = async (pulpit) => {
        const r = await (new mssql.Request())
            .input('pulpit', mssql.NVarChar, pulpit)
            .query(`update subject set pulpit = null where pulpit = @pulpit;
                    update teacher set pulpit = null where pulpit = @pulpit; 
                    delete from pulpit where pulpit = @pulpit`);
        return (r.rowsAffected[2] == 0) ? { result: false } : { result: true };
    };
    
    this.delTeacher = async (teacher) => {
        const r = await (new mssql.Request())
            .input('teacher', mssql.NVarChar, teacher)
            .query('delete from teacher where teacher = @teacher');
        return (r.rowsAffected[0] == 0) ? { result: false } : { result: true };
    };
    
    this.delSubject = async (subject) => {
        const r = await (new mssql.Request())
            .input('subject', mssql.NVarChar, subject)
            .query('delete from subject where subject = @subject');
        return (r.rowsAffected[0] == 0) ? { result: false } : { result: true };
    };

    this.getTeachersByFaculty = async (faculty) => {
        const r = await (new mssql.Request())
            .input('faculty', mssql.NVarChar, faculty)
            .query(`select pulpit.FACULTY as faculty, teacher, teacher_name, pulpit.pulpit
                    from pulpit  join teacher on pulpit.PULPIT = teacher.PULPIT   
                    where pulpit.FACULTY = @faculty`);
        let zapt = (o_1) => { return { teacher: o_1.teacher, teacher_name: o_1.teacher_name, pulpit: o_1.pulpit }; };
        let zapf = (o_3) => { return { faculty: o_3.faculty, teachers: [zapt(o_3)] }; };
        let rc = [];
        r.recordset.forEach((el, index) => {
            if (index == 0) rc.push(zapf(el));
            else rc[rc.length - 1].teachers.push(zapt(el));
        });
        return rc;
    };

    this.getPulpitsForFaculty = async(faculty) => {
        return (await (new mssql.Request()).input('faculty', mssql.NVarChar, faculty).query("select pulpit.pulpit from pulpit where faculty = @faculty")).recordset;
    };

    this.getSubjectsByPulpit = async (pulpit) => {
        const r = await (new mssql.Request())
            .input('pulpit', mssql.NVarChar, pulpit)
            .query(`select p.pulpit as pulpit, p.pulpit_name as pulpit_name, s.subject as subject, s.subject_name as subject_name
                    from subject s join pulpit p on s.pulpit = p.pulpit 
                    where p.pulpit = @pulpit`);
        let zaps = (o_1) => { return { subject: o_1.subject, subject_name: o_1.subject_name, pulpit: o_1.pulpit }; };
        let zapp = (o_3) => { return { pulpit: o_3.pulpit, pulpit_name: o_3.pulpit_name, subjects: [zaps(o_3)] }; };
        let rc = [];
        r.recordset.forEach((el, index) => {
            if (index == 0) rc.push(zapp(el));
            else rc[rc.length - 1].subjects.push(zaps(el));
        });
        return rc;
    };

    this.connect = mssql.connect(config, err => {
        if (err) cb(err, null)
        else cb(null, this.connect);
    });
}
exports.DB = (cb) => { return new DB(cb) };

exports.resolver = {
    getFaculties:(args, context) => (args.faculty) ? context.getFaculty(args.faculty) : context.getFaculties(),
    getTeachers: (args, context) => (args.teacher) ? context.getTeacher(args.teacher) : context.getTeachers(),
    getPulpits:  (args, context) => (args.pulpit)  ? context.getPulpit(args.pulpit)   : context.getPulpits(),
    getSubjects: (args, context) => (args.subject) ? context.getSubject(args.subject) : context.getSubjects(),

    getTeachersByFaculty: (args, context) => context.getTeachersByFaculty(args.faculty),
    getSubjectsByFaculties: async (args, context) => {
        let ppts = await context.getPulpitsForFaculty(args.faculty);
        let rc = [{faculty: args.faculty, pulpits: []}];
        for (var el of ppts) {
            let p = await context.getSubjectsByPulpit(el.pulpit);
            if (p.length !==0) rc[0].pulpits.push(p[0]);
        }
        return rc;
    },

    setFaculty: async (args, context) => (await context.updateFaculty(args.faculty)) ?? (await context.insertFaculty(args.faculty)),
    setPulpit:  async (args, context) => (await context.updatePulpit(args.pulpit)) ?? (await context.insertPulpit(args.pulpit)),
    setSubject: async (args, context) => (await context.updateSubject(args.subject)) ?? (await context.insertSubject(args.subject)),
    setTeacher: async (args, context) => (await context.updateTeacher(args.teacher)) ?? (await context.insertTeacher(args.teacher)),

    delFaculty: (args, context) => context.delFaculty(args.faculty),
    delPulpit:  (args, context) => context.delPulpit(args.pulpit),
    delSubject: (args, context) => context.delSubject(args.subject),
    delTeacher: (args, context) => context.delTeacher(args.teacher)
};
