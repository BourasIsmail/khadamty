import 'package:flutter_test/flutter_test.dart';

import 'package:khadamati/main.dart';

void main() {
  testWidgets('Khadamati app starts on login', (WidgetTester tester) async {
    await tester.pumpWidget(const KhadamatiApp());
    await tester.pump();

    expect(find.text('Khadamati'), findsWidgets);
  });
}
