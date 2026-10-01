import 'dart:typed_data';

Future<String> savePdfBytes(String fileName, Uint8List bytes) async {
  return 'PDF prêt: $fileName (${bytes.length} octets)';
}
