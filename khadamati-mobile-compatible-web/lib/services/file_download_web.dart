import 'dart:html' as html;
import 'dart:typed_data';

Future<String> savePdfBytes(String fileName, Uint8List bytes) async {
  final safeName = _safeFileName(fileName);
  final blob = html.Blob([bytes], 'application/pdf');
  final url = html.Url.createObjectUrlFromBlob(blob);
  html.AnchorElement(href: url)
    ..setAttribute('download', safeName)
    ..click();
  html.Url.revokeObjectUrl(url);
  return 'Téléchargement lancé: $safeName';
}

String _safeFileName(String value) =>
    value.replaceAll(RegExp(r'[\\/:*?"<>|]'), '_');
