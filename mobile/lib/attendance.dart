import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AttendanceStatus { present, absent, late }

extension AttendanceStatusLabel on AttendanceStatus {
  String get label => switch (this) {
    AttendanceStatus.present => 'Present',
    AttendanceStatus.absent => 'Absent',
    AttendanceStatus.late => 'Late',
  };
}

class Student {
  const Student({
    required this.id,
    required this.rollNo,
    required this.name,
    required this.group,
  });

  final String id;
  final String rollNo;
  final String name;
  final String group;

  factory Student.fromJson(Map<String, dynamic> json) => Student(
    id: json['id'] as String,
    rollNo: json['rollNo'] as String,
    name: json['name'] as String,
    group: json['group'] as String,
  );
}

class AttendanceRegister {
  const AttendanceRegister({
    required this.date,
    required this.group,
    required this.marks,
    required this.savedAt,
    required this.revision,
  });

  final String date;
  final String group;
  final Map<String, AttendanceStatus> marks;
  final DateTime savedAt;
  final int revision;

  String get key => '$date|$group';
  int count(AttendanceStatus status) =>
      marks.values.where((mark) => mark == status).length;

  factory AttendanceRegister.fromJson(Map<String, dynamic> json) =>
      AttendanceRegister(
        date: json['date'] as String,
        group: json['group'] as String,
        marks: (json['marks'] as Map<String, dynamic>).map(
          (id, value) =>
              MapEntry(id, AttendanceStatus.values.byName(value as String)),
        ),
        savedAt: DateTime.parse(json['savedAt'] as String),
        revision: json['revision'] as int? ?? 1,
      );

  Map<String, dynamic> toJson() => {
    'date': date,
    'group': group,
    'marks': marks.map((id, status) => MapEntry(id, status.name)),
    'savedAt': savedAt.toIso8601String(),
    'revision': revision,
  };
}

class StudentAttendance {
  const StudentAttendance({
    required this.total,
    required this.attended,
    required this.late,
  });

  final int total;
  final int attended;
  final int late;

  double get percentage => total == 0 ? 0 : attended * 100 / total;
}

abstract class RegisterStorage {
  Future<String?> read();
  Future<void> write(String value);
}

class DeviceRegisterStorage implements RegisterStorage {
  DeviceRegisterStorage() : _preferences = SharedPreferencesAsync();

  static const _key = 'kadiri.attendance.registers.v1';
  final SharedPreferencesAsync _preferences;

  @override
  Future<String?> read() => _preferences.getString(_key);

  @override
  Future<void> write(String value) => _preferences.setString(_key, value);
}

class AttendanceStore extends ChangeNotifier {
  AttendanceStore({required this.students, required this.storage});

  final List<Student> students;
  final RegisterStorage storage;
  final Map<String, AttendanceRegister> _registers = {};

  List<AttendanceRegister> get registers {
    final result = _registers.values.toList();
    result.sort((a, b) {
      final byDate = b.date.compareTo(a.date);
      return byDate != 0 ? byDate : a.group.compareTo(b.group);
    });
    return result;
  }

  List<Student> studentsIn(String group) =>
      students.where((student) => student.group == group).toList();

  AttendanceRegister? registerFor(String date, String group) =>
      _registers['$date|$group'];

  Future<void> load() async {
    final raw = await storage.read();
    if (raw == null || raw.isEmpty) return;
    final decoded = jsonDecode(raw) as List<dynamic>;
    final parsed = decoded
        .map(
          (item) => AttendanceRegister.fromJson(item as Map<String, dynamic>),
        )
        .where(
          (register) =>
              register.group == 'Group I' || register.group == 'Group II',
        );
    _registers.clear();
    for (final register in parsed) {
      _registers[register.key] = register;
    }
    notifyListeners();
  }

  Future<AttendanceRegister> save({
    required String date,
    required String group,
    required Map<String, AttendanceStatus> marks,
  }) async {
    final selected = studentsIn(group);
    if (selected.isEmpty) {
      throw StateError('No students are enrolled in $group.');
    }
    final requiredIds = selected.map((student) => student.id).toSet();
    if (!marks.keys.toSet().containsAll(requiredIds)) {
      throw StateError('Mark every student before saving this register.');
    }
    if (marks.keys.any((id) => !requiredIds.contains(id))) {
      throw StateError('The register contains a student from another group.');
    }
    final key = '$date|$group';
    final next = AttendanceRegister(
      date: date,
      group: group,
      marks: Map.unmodifiable(marks),
      savedAt: DateTime.now(),
      revision: (_registers[key]?.revision ?? 0) + 1,
    );
    final prospective = {..._registers, key: next};
    await storage.write(
      jsonEncode(prospective.values.map((item) => item.toJson()).toList()),
    );
    _registers[key] = next;
    notifyListeners();
    return next;
  }

  StudentAttendance attendanceFor(Student student) {
    var total = 0;
    var attended = 0;
    var late = 0;
    for (final register in _registers.values) {
      if (register.group != student.group) continue;
      final mark = register.marks[student.id];
      if (mark == null) continue;
      total++;
      if (mark == AttendanceStatus.present || mark == AttendanceStatus.late) {
        attended++;
      }
      if (mark == AttendanceStatus.late) late++;
    }
    return StudentAttendance(total: total, attended: attended, late: late);
  }

  String toCsv() {
    String cell(Object? value) => '"${value.toString().replaceAll('"', '""')}"';
    final lines = <String>[
      [
        'Date',
        'Group',
        'Roll number',
        'Student',
        'Status',
        'Revision',
      ].map(cell).join(','),
    ];
    for (final register in registers) {
      for (final student in studentsIn(register.group)) {
        lines.add(
          [
            register.date,
            register.group,
            student.rollNo,
            student.name,
            register.marks[student.id]?.label ?? 'Unmarked',
            register.revision,
          ].map(cell).join(','),
        );
      }
    }
    return lines.join('\r\n');
  }
}
