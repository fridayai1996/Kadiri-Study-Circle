import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kadiri_attendance/app.dart';
import 'package:kadiri_attendance/attendance.dart';

class MemoryStorage implements RegisterStorage {
  String? value;
  @override
  Future<String?> read() async => value;
  @override
  Future<void> write(String next) async => value = next;
}

void main() {
  testWidgets('roll call requires marks, then saves one register', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final store = AttendanceStore(
      students: const [
        Student(id: 'one', rollNo: 'G1-01', name: 'Anusha', group: 'Group I'),
        Student(id: 'two', rollNo: 'G1-02', name: 'Vani', group: 'Group I'),
      ],
      storage: MemoryStorage(),
    );
    await tester.pumpWidget(MaterialApp(home: HomeScreen(store: store)));
    await tester.pumpAndSettle();

    expect(
      tester
          .widget<FilledButton>(
            find.widgetWithText(FilledButton, 'Save register'),
          )
          .onPressed,
      isNull,
    );
    await tester.tap(find.text('Mark all').first);
    await tester.pumpAndSettle();
    await tester.tap(
      find.descendant(
        of: find.byType(AlertDialog),
        matching: find.text('Mark all'),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      tester
          .widget<FilledButton>(
            find.widgetWithText(FilledButton, 'Save register'),
          )
          .onPressed,
      isNotNull,
    );

    await tester.tap(find.widgetWithText(FilledButton, 'Save register'));
    await tester.pumpAndSettle();
    expect(store.registers, hasLength(1));
    expect(store.registers.single.count(AttendanceStatus.present), 2);
    expect(find.text('Register saved'), findsOneWidget);
  });
}
