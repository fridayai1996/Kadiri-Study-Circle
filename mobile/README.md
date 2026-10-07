# Kadiri Attendance

Flutter attendance app for one Kadiri Study Circle device. It uses the supplied Sri Sathya Sai District logo and the 35 starter students from the existing React prototype (12 Group I, 23 Group II).

## What works

- Daily roll call for Group I and Group II, with Present, Absent, and Late statuses.
- Search by name or roll number and a confirmed “Mark all present” action.
- Complete-register validation, unsaved-change warnings, and clear save feedback.
- Local history. Opening and saving a past register replaces that date/group record and increases its revision number.
- Student attendance calculated from saved registers. Late counts as attended.
- Overview of registers, marks, absences, and students below 75% attendance.
- CSV copy for spreadsheet backup.

## Run

Install the [Flutter SDK](https://docs.flutter.dev/install), then from this directory:

```sh
flutter pub get
flutter run
```

Use `flutter test` and `flutter analyze` to verify the project. Android and iOS project files are included. iOS builds require macOS and Xcode; Android builds require the Android SDK. For a web preview, run `flutter run -d chrome`.

## Storage and scope

Registers live in the device's app storage. They are not shared across phones and can be lost when app data is cleared or the app is removed. Copy the CSV regularly for a backup. The starter roster is sample data from the original prototype; edit `assets/students.json` for the real roster before use. `tool/export_roster.mjs` recreates the starter roster from `../src/data/initialData.ts`.

This version has no account login or server permissions. Keep the device under the center's control. The previously shared Supabase secret is not used by this app.
