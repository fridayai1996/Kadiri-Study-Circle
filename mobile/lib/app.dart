import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'attendance.dart';

const navy = Color(0xFF092653);
const orange = Color(0xFFF47700);
const paper = Color(0xFFF5F7FA);
const muted = Color(0xFF62738D);
const green = Color(0xFF16734A);
const red = Color(0xFFAD3D32);
const gold = Color(0xFF8B6100);

String isoDate(DateTime value) =>
    '${value.year.toString().padLeft(4, '0')}-${value.month.toString().padLeft(2, '0')}-${value.day.toString().padLeft(2, '0')}';

String prettyDate(String value) {
  final date = DateTime.tryParse(value);
  if (date == null) return value;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return '${date.day} ${months[date.month - 1]} ${date.year}';
}

Future<AttendanceStore> _openStore() async {
  final raw = jsonDecode(
    await rootBundle.loadString('assets/students.json'),
  ) as List<dynamic>;
  final students = raw
      .map((item) => Student.fromJson(item as Map<String, dynamic>))
      .toList();
  final store = AttendanceStore(
    students: students,
    storage: DeviceRegisterStorage(),
  );
  await store.load();
  return store;
}

class KadiriApp extends StatefulWidget {
  const KadiriApp({super.key});
  @override
  State<KadiriApp> createState() => _KadiriAppState();
}

class _KadiriAppState extends State<KadiriApp> {
  late final Future<AttendanceStore> _store = _openStore();

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Kadiri Attendance',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: paper,
      colorScheme: ColorScheme.fromSeed(
        seedColor: navy,
        primary: navy,
        secondary: orange,
        surface: Colors.white,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        isDense: true,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 13,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(11),
          borderSide: const BorderSide(color: Color(0xFFDDE5ED)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(11),
          borderSide: const BorderSide(color: Color(0xFFDDE5ED)),
        ),
      ),
    ),
    home: FutureBuilder<AttendanceStore>(
      future: _store,
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return const Scaffold(
            body: Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text(
                  'Could not open attendance data. Restart the app and try again.',
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          );
        }
        if (!snapshot.hasData) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        return HomeScreen(store: snapshot.data!);
      },
    ),
  );
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.store});
  final AttendanceStore store;
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int tab = 0;
  String date = isoDate(DateTime.now());
  String group = 'Group I';
  String search = '';
  Map<String, AttendanceStatus> marks = {};
  Map<String, AttendanceStatus> savedMarks = {};
  bool saving = false;

  bool get dirty => !mapEquals(marks, savedMarks);
  List<Student> get roster => widget.store.studentsIn(group);
  bool get complete =>
      roster.isNotEmpty &&
      roster.every((student) => marks.containsKey(student.id));

  @override
  void initState() {
    super.initState();
    loadRegister();
    widget.store.addListener(refresh);
  }

  @override
  void dispose() {
    widget.store.removeListener(refresh);
    super.dispose();
  }

  void refresh() {
    if (mounted) setState(() {});
  }

  void loadRegister() {
    savedMarks = Map.of(widget.store.registerFor(date, group)?.marks ?? {});
    marks = Map.of(savedMarks);
  }

  Future<bool> confirmDiscard() async {
    if (!dirty) return true;
    return await showDialog<bool>(
          context: context,
          builder: (dialog) => AlertDialog(
            title: const Text('Leave unsaved register?'),
            content: const Text('Your changes to this roll call will be lost.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialog, false),
                child: const Text('Keep editing'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(dialog, true),
                child: const Text('Discard changes'),
              ),
            ],
          ),
        ) ??
        false;
  }

  Future<void> selectRegister(String nextDate, String nextGroup) async {
    if (nextDate == date && nextGroup == group) return;
    if (!await confirmDiscard() || !mounted) return;
    setState(() {
      date = nextDate;
      group = nextGroup;
      search = '';
      tab = 0;
      loadRegister();
    });
  }

  Future<void> selectTab(int next) async {
    if (tab == next) return;
    if (tab == 0 && !await confirmDiscard()) return;
    if (!mounted) return;
    setState(() {
      tab = next;
      if (next != 0) loadRegister();
    });
  }

  Future<void> selectDate() async {
    final next = await showDatePicker(
      context: context,
      initialDate: DateTime.parse(date),
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (next != null && mounted) await selectRegister(isoDate(next), group);
  }

  Future<void> markAll() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialog) => AlertDialog(
        title: const Text('Mark all present?'),
        content: Text(
          'Mark all ${roster.length} $group students present? Individual statuses can still be changed.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialog, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialog, true),
            child: const Text('Mark all'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    setState(() {
      for (final student in roster) {
        marks[student.id] = AttendanceStatus.present;
      }
    });
  }

  Future<void> saveRegister() async {
    if (!complete || !dirty || saving) return;
    setState(() => saving = true);
    try {
      final result = await widget.store.save(
        date: date,
        group: group,
        marks: marks,
      );
      if (!mounted) return;
      setState(() => savedMarks = Map.of(result.marks));
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('$group register saved for ${prettyDate(date)}.'),
        ),
      );
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Could not save on this device. Changes are still here; try again.',
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final existing = widget.store.registerFor(date, group);
    return PopScope(
      canPop: !dirty,
      onPopInvokedWithResult: (didPop, result) async {
        if (!didPop && await confirmDiscard() && mounted) {
          setState(loadRegister);
        }
      },
      child: Scaffold(
        body: SafeArea(
          child: switch (tab) {
            0 => rollCall(existing),
            1 => history(),
            2 => students(),
            _ => overview(),
          },
        ),
        bottomNavigationBar: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (tab == 0) saveBar(existing),
            NavigationBar(
              selectedIndex: tab,
              onDestinationSelected: selectTab,
              destinations: const [
                NavigationDestination(
                  icon: Icon(Icons.fact_check_outlined),
                  selectedIcon: Icon(Icons.fact_check),
                  label: 'Roll call',
                ),
                NavigationDestination(
                  icon: Icon(Icons.history_outlined),
                  label: 'History',
                ),
                NavigationDestination(
                  icon: Icon(Icons.people_outline),
                  label: 'Students',
                ),
                NavigationDestination(
                  icon: Icon(Icons.insights_outlined),
                  label: 'Overview',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget header(String title, String subtitle) => Container(
    color: navy,
    width: double.infinity,
    padding: const EdgeInsets.fromLTRB(20, 14, 20, 27),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.asset(
                'assets/district-logo.jpeg',
                width: 46,
                height: 46,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(width: 11),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Kadiri Study Circle',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Text(
                    'Sri Sathya Sai District',
                    style: TextStyle(color: Color(0xFFCAD5E4), fontSize: 11),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.offline_bolt_outlined,
              color: Color(0xFFCAD5E4),
              size: 20,
            ),
          ],
        ),
        const SizedBox(height: 22),
        Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 29,
            fontWeight: FontWeight.w800,
            letterSpacing: -1,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          subtitle,
          style: const TextStyle(color: Color(0xFFCAD5E4), fontSize: 13),
        ),
      ],
    ),
  );

  Widget rollCall(AttendanceRegister? existing) {
    final filtered = roster
        .where(
          (student) => '${student.name} ${student.rollNo}'
              .toLowerCase()
              .contains(search.toLowerCase()),
        )
        .toList();
    final present = marks.values
        .where((item) => item == AttendanceStatus.present)
        .length;
    final absent = marks.values
        .where((item) => item == AttendanceStatus.absent)
        .length;
    final late = marks.values
        .where((item) => item == AttendanceStatus.late)
        .length;
    return ListView(
      children: [
        header('Daily roll call', 'Record attendance for each study group.'),
        Container(
          margin: const EdgeInsets.fromLTRB(15, 0, 15, 0),
          transform: Matrix4.translationValues(0, -11, 0),
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: const Color(0xFFE2E9F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const FieldLabel('Date'),
                        OutlinedButton.icon(
                          onPressed: selectDate,
                          icon: const Icon(
                            Icons.calendar_today_outlined,
                            size: 16,
                          ),
                          label: Text(prettyDate(date)),
                          style: OutlinedButton.styleFrom(
                            minimumSize: const Size.fromHeight(46),
                            alignment: Alignment.centerLeft,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const FieldLabel('Study group'),
                        Container(
                          height: 46,
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            border: Border.all(color: const Color(0xFFDDE5ED)),
                            borderRadius: BorderRadius.circular(11),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: group,
                              isExpanded: true,
                              items: const ['Group I', 'Group II']
                                  .map(
                                    (name) => DropdownMenuItem(
                                      value: name,
                                      child: Text(name),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (value) {
                                if (value != null) selectRegister(date, value);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(
                    Icons.circle,
                    size: 8,
                    color: existing == null
                        ? gold
                        : dirty
                        ? orange
                        : green,
                  ),
                  const SizedBox(width: 7),
                  Flexible(
                    child: Text(
                      existing == null
                          ? 'New register · no attendance saved'
                          : dirty
                          ? 'Saved register · unsaved edits'
                          : 'Saved register · revision ${existing.revision}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: muted,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 10, 20, 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Metric('${roster.length}', 'Students', navy),
                  Metric('$present', 'Present', green),
                  Metric('$absent', 'Absent', red),
                  Metric('$late', 'Late', gold),
                ],
              ),
              const Divider(height: 29),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Students',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                  ),
                  Text(
                    '${present + absent + late} of ${roster.length} marked',
                    style: const TextStyle(color: muted, fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      key: ValueKey('$date|$group'),
                      onChanged: (value) => setState(() => search = value),
                      decoration: const InputDecoration(
                        hintText: 'Search name or roll number',
                        prefixIcon: Icon(Icons.search),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  OutlinedButton(
                    onPressed: markAll,
                    child: const Text('Mark all'),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (filtered.isEmpty)
                const EmptyMessage('No students match your search.'),
              ...filtered.map(studentRow),
            ],
          ),
        ),
      ],
    );
  }

  Widget studentRow(Student student) {
    final selected = marks[student.id];
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(13),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(13),
        border: Border.all(color: const Color(0xFFE2E9F0)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: const Color(0xFFE9EEF5),
                child: Text(
                  student.name.split(' ').last[0],
                  style: const TextStyle(
                    color: navy,
                    fontWeight: FontWeight.w800,
                    fontSize: 12,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      student.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 13,
                      ),
                    ),
                    Text(
                      student.rollNo,
                      style: const TextStyle(color: muted, fontSize: 11),
                    ),
                  ],
                ),
              ),
              Text(
                selected?.label ?? 'Unmarked',
                style: TextStyle(
                  color: selected == null ? muted : statusColor(selected),
                  fontWeight: FontWeight.w700,
                  fontSize: 11,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: AttendanceStatus.values.map((status) {
              final active = selected == status;
              final color = statusColor(status);
              return Expanded(
                child: Padding(
                  padding: EdgeInsets.only(
                    right: status == AttendanceStatus.late ? 0 : 6,
                  ),
                  child: Semantics(
                    button: true,
                    selected: active,
                    label: '${student.name}, ${status.label}',
                    child: InkWell(
                      onTap: () => setState(() => marks[student.id] = status),
                      borderRadius: BorderRadius.circular(9),
                      child: Container(
                        height: 42,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: active
                              ? color.withValues(alpha: .11)
                              : Colors.white,
                          border: Border.all(
                            color: active
                                ? color.withValues(alpha: .45)
                                : const Color(0xFFDDE5ED),
                          ),
                          borderRadius: BorderRadius.circular(9),
                        ),
                        child: Text(
                          status.label,
                          style: TextStyle(
                            color: active ? color : muted,
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget saveBar(AttendanceRegister? existing) {
    final missing = roster
        .where((student) => !marks.containsKey(student.id))
        .length;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE0E7EF))),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  dirty
                      ? 'Unsaved changes'
                      : existing == null
                      ? 'Register incomplete'
                      : 'Register saved',
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 13,
                  ),
                ),
                Text(
                  missing > 0
                      ? '$missing student${missing == 1 ? '' : 's'} still unmarked'
                      : dirty
                      ? 'All students marked'
                      : 'Changes are up to date',
                  style: const TextStyle(color: muted, fontSize: 11),
                ),
              ],
            ),
          ),
          FilledButton(
            onPressed: complete && dirty && !saving ? saveRegister : null,
            style: FilledButton.styleFrom(
              backgroundColor: orange,
              foregroundColor: navy,
              minimumSize: const Size(110, 45),
            ),
            child: saving
                ? const SizedBox(
                    width: 17,
                    height: 17,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Text(
                    existing == null ? 'Save register' : 'Save changes',
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
          ),
        ],
      ),
    );
  }

  Widget history() {
    final registers = widget.store.registers;
    return ListView(
      children: [
        header('History', 'Saved registers on this device.'),
        Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '${registers.length} saved register${registers.length == 1 ? '' : 's'}',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 12),
              if (registers.isEmpty)
                const EmptyMessage(
                  'No registers saved yet. Start with Roll call.',
                ),
              ...registers.map(
                (item) => Card(
                  color: Colors.white,
                  margin: const EdgeInsets.only(bottom: 9),
                  child: ListTile(
                    leading: const Icon(Icons.event_note_outlined, color: navy),
                    title: Text(
                      '${prettyDate(item.date)} · ${item.group}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                      ),
                    ),
                    subtitle: Text(
                      '${item.count(AttendanceStatus.present)} present · ${item.count(AttendanceStatus.absent)} absent · ${item.count(AttendanceStatus.late)} late\nRevision ${item.revision}',
                      style: const TextStyle(color: muted, fontSize: 11),
                    ),
                    isThreeLine: true,
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => selectRegister(item.date, item.group),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget students() => ListView(
    children: [
      header('Students', 'Attendance from saved registers.'),
      Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${widget.store.students.length} students in starter roster',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 6),
            const Text(
              'Late counts as attended. Unsaved marks do not count.',
              style: TextStyle(color: muted, fontSize: 12),
            ),
            const SizedBox(height: 13),
            ...widget.store.students.map((student) {
              final attendance = widget.store.attendanceFor(student);
              return Card(
                color: Colors.white,
                margin: const EdgeInsets.only(bottom: 7),
                child: ListTile(
                  title: Text(
                    student.name,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  subtitle: Text(
                    '${student.rollNo} · ${student.group}',
                    style: const TextStyle(color: muted, fontSize: 11),
                  ),
                  trailing: Text(
                    attendance.total == 0
                        ? 'No records'
                        : '${attendance.percentage.toStringAsFixed(0)}%',
                    style: TextStyle(
                      color: attendance.total == 0
                          ? muted
                          : attendance.percentage < 75
                          ? red
                          : green,
                      fontWeight: FontWeight.w800,
                      fontSize: 13,
                    ),
                  ),
                  onTap: () => showStudent(student),
                ),
              );
            }),
          ],
        ),
      ),
    ],
  );

  void showStudent(Student student) {
    final attendance = widget.store.attendanceFor(student);
    final records = widget.store.registers
        .where(
          (item) =>
              item.group == student.group && item.marks.containsKey(student.id),
        )
        .toList();
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (dialog) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 22),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  student.name,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(
                  '${student.rollNo} · ${student.group}',
                  style: const TextStyle(color: muted, fontSize: 12),
                ),
                const SizedBox(height: 15),
                Text(
                  attendance.total == 0
                      ? 'No saved attendance yet'
                      : '${attendance.attended} of ${attendance.total} attended · ${attendance.percentage.toStringAsFixed(1)}%',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const Divider(height: 26),
                ...records.map(
                  (item) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(prettyDate(item.date)),
                    trailing: Text(
                      item.marks[student.id]!.label,
                      style: TextStyle(
                        color: statusColor(item.marks[student.id]!),
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget overview() {
    final registers = widget.store.registers;
    final marksCount = registers.fold<int>(
      0,
      (sum, item) => sum + item.marks.length,
    );
    final absences = registers.fold<int>(
      0,
      (sum, item) => sum + item.count(AttendanceStatus.absent),
    );
    final flagged = widget.store.students.where((student) {
      final value = widget.store.attendanceFor(student);
      return value.total > 0 && value.percentage < 75;
    }).toList();
    return ListView(
      children: [
        header('Overview', 'A clear view of local attendance.'),
        Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'This device',
                style: TextStyle(
                  color: muted,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Metric('${registers.length}', 'Registers', navy),
                  Metric('$marksCount', 'Marks', green),
                  Metric('$absences', 'Absences', red),
                ],
              ),
              const Divider(height: 30),
              const Text(
                'Below 75% attendance',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 10),
              if (flagged.isEmpty)
                const EmptyMessage('No students below 75% in saved registers.'),
              ...flagged.map(
                (student) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(student.name),
                  subtitle: Text(student.group),
                  trailing: Text(
                    '${widget.store.attendanceFor(student).percentage.toStringAsFixed(0)}%',
                    style: const TextStyle(
                      color: red,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),
              const Divider(height: 30),
              const Text(
                'Export',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 7),
              const Text(
                'Copy a CSV of saved attendance to paste into a spreadsheet.',
                style: TextStyle(color: muted, fontSize: 12),
              ),
              const SizedBox(height: 11),
              OutlinedButton.icon(
                onPressed: registers.isEmpty
                    ? null
                    : () async {
                        await Clipboard.setData(
                          ClipboardData(text: widget.store.toCsv()),
                        );
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                'Attendance CSV copied to clipboard.',
                              ),
                            ),
                          );
                        }
                      },
                icon: const Icon(Icons.copy_outlined),
                label: const Text('Copy attendance CSV'),
              ),
              const SizedBox(height: 18),
              const Text(
                'Offline on this device. Data is not shared with other phones. Keep the CSV in a safe place as a backup.',
                style: TextStyle(color: muted, fontSize: 12),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

Color statusColor(AttendanceStatus value) => switch (value) {
  AttendanceStatus.present => green,
  AttendanceStatus.absent => red,
  AttendanceStatus.late => gold,
};

class FieldLabel extends StatelessWidget {
  const FieldLabel(this.value, {super.key});
  final String value;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 6),
    child: Text(
      value,
      style: const TextStyle(
        color: muted,
        fontSize: 11,
        fontWeight: FontWeight.w700,
      ),
    ),
  );
}

class Metric extends StatelessWidget {
  const Metric(this.value, this.label, this.color, {super.key});
  final String value;
  final String label;
  final Color color;
  @override
  Widget build(BuildContext context) => Expanded(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: TextStyle(
            color: color,
            fontSize: 23,
            fontWeight: FontWeight.w800,
          ),
        ),
        Text(label, style: const TextStyle(color: muted, fontSize: 11)),
      ],
    ),
  );
}

class EmptyMessage extends StatelessWidget {
  const EmptyMessage(this.message, {super.key});
  final String message;
  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 27),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(13),
      border: Border.all(color: const Color(0xFFE2E9F0)),
    ),
    child: Text(
      message,
      textAlign: TextAlign.center,
      style: const TextStyle(color: muted, fontSize: 13),
    ),
  );
}
