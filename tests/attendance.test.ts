import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyAttendance } from '../src/attendance';
import { INITIAL_STUDENTS } from '../src/data/initialData';

test('saving the same daily register twice does not inflate attendance', () => {
 const s = INITIAL_STUDENTS[0];
 const first = applyAttendance([s], {}, { [s.id]: 'present' });
 const again = applyAttendance(first.students, first.attendance, { [s.id]: 'present' });
 assert.deepEqual(again, first);
 assert.equal(first.students[0].totalClasses, s.totalClasses + 1);
});
test('correcting present to absent preserves total and reverses attended count', () => {
 const s = INITIAL_STUDENTS[0];
 const first = applyAttendance([s], {}, { [s.id]: 'present' });
 const corrected = applyAttendance(first.students, first.attendance, { [s.id]: 'absent' });
 assert.equal(corrected.students[0].totalClasses, first.students[0].totalClasses);
 assert.equal(corrected.students[0].attendedClasses, s.attendedClasses);
});
test('a partial class update preserves the other class and late counts as attending', () => {
 const [a,b] = INITIAL_STUDENTS;
 const result = applyAttendance([a,b], { [b.id]: 'absent' }, { [a.id]: 'late' });
 assert.equal(result.attendance[b.id], 'absent');
 assert.equal(result.students[0].attendedClasses, a.attendedClasses + 1);
 assert.deepEqual(result.students[1], b);
});
