import 'dart:io';
import 'dart:typed_data';

Future<String> savePdfBytes(String fileName, Uint8List bytes) async {
  final safeName = _safeFileName(fileName);
  final file = File('${Directory.systemTemp.path}${Platform.pathSeparator}$safeName');
  await file.writeAsBytes(bytes, flush: true);
  return 'PDF enregistré: ${file.path}';
}

String _safeFileName(String value) =>
    value.replaceAll(RegExp(r'[\\/:*?"<>|]'), '_');
