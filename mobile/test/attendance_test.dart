import 'package:flutter_test/flutter_test.dart';
import 'package:kadiri_attendance/attendance.dart';

class MemoryStorage implements RegisterStorage {
  String? value;
  bool failWrites = false;

  @override
  Future<String?> read() async => value;

  @override
  Future<void> write(String next) async {
    if (failWrites) throw StateError('storage unavailable');
    value = next;
  }
}

void main() {
  const a = Student(id: 'a', rollNo: 'G1-1', name: 'Anusha', group: 'Group I');
  const b = Student(id: 'b', rollNo: 'G1-2', name: 'Vani', group: 'Group I');
  const c = Student(
    id: 'c',
    rollNo: 'G2-1',
    name: 'Deepthi',
    group: 'Group II',
  );

  late MemoryStorage storage;
  late AttendanceStore store;

  setUp(() {
    storage = MemoryStorage();
    store = AttendanceStore(students: [a, b, c], storage: storage);
  });

  test('requires a complete register for its own group', () async {
    await expectLater(
      store.save(
        date: '2026-09-29',
        group: 'Group I',
        marks: {'a': AttendanceStatus.present},
      ),
      throwsStateError,
    );
    await expectLater(
      store.save(
        date: '2026-09-29',
        group: 'Group I',
        marks: {
          'a': AttendanceStatus.present,
          'b': AttendanceStatus.absent,
          'c': AttendanceStatus.present,
        },
      ),
      throwsStateError,
    );
    expect(store.registers, isEmpty);
  });

  test(
    'editing a saved date replaces marks without counting another session',
    () async {
      await store.save(
        date: '2026-09-29',
        group: 'Group I',
        marks: {'a': AttendanceStatus.present, 'b': AttendanceStatus.absent},
      );
      expect(store.attendanceFor(b).total, 1);
      expect(store.attendanceFor(b).attended, 0);

      final edited = await store.save(
        date: '2026-09-29',
        group: 'Group I',
        marks: {'a': AttendanceStatus.present, 'b': AttendanceStatus.late},
      );
      expect(edited.revision, 2);
      expect(store.registers, hasLength(1));
      expect(store.attendanceFor(b).total, 1);
      expect(store.attendanceFor(b).attended, 1);
      expect(store.attendanceFor(b).late, 1);
      expect(store.attendanceFor(b).percentage, 100);
    },
  );

  test('groups and dates remain separate through reload', () async {
    await store.save(
      date: '2026-09-28',
      group: 'Group I',
      marks: {'a': AttendanceStatus.present, 'b': AttendanceStatus.absent},
    );
    await store.save(
      date: '2026-09-29',
      group: 'Group I',
      marks: {'a': AttendanceStatus.absent, 'b': AttendanceStatus.present},
    );
    await store.save(
      date: '2026-09-29',
      group: 'Group II',
      marks: {'c': AttendanceStatus.late},
    );
    final reopened = AttendanceStore(students: [a, b, c], storage: storage);
    await reopened.load();
    expect(reopened.registers, hasLength(3));
    expect(reopened.attendanceFor(a).total, 2);
    expect(reopened.attendanceFor(a).attended, 1);
    expect(reopened.attendanceFor(c).total, 1);
    expect(reopened.attendanceFor(c).late, 1);
  });

  test('failed storage write keeps the old register', () async {
    await store.save(
      date: '2026-09-29',
      group: 'Group II',
      marks: {'c': AttendanceStatus.present},
    );
    storage.failWrites = true;
    await expectLater(
      store.save(
        date: '2026-09-29',
        group: 'Group II',
        marks: {'c': AttendanceStatus.absent},
      ),
      throwsStateError,
    );
    expect(
      store.registerFor('2026-09-29', 'Group II')!.marks['c'],
      AttendanceStatus.present,
    );
    expect(store.attendanceFor(c).attended, 1);
  });
}
