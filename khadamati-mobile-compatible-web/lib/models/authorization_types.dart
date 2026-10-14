/// Types d'autorisations (le backend applique les mêmes valeurs et plafonds).
class AuthorizationType {
  final String value;
  final String label;
  final String? note;
  const AuthorizationType(this.value, this.label, [this.note]);
}

class AuthorizationGroup {
  final String title;
  final List<AuthorizationType> types;
  const AuthorizationGroup(this.title, this.types);
}

const authorizationGroups = <AuthorizationGroup>[
  AuthorizationGroup('Autorisations administratives', [
    AuthorizationType('ANNUAL_LEAVE', 'Autorisation annuelle', '22 jours ouvrables par an, après 12 mois de service'),
    AuthorizationType('EXCEPTIONAL_LEAVE', 'Autorisation exceptionnelle / absence', 'Raisons personnelles ou familiales graves, 10 jours maximum'),
    AuthorizationType('HAJJ_LEAVE', 'Autorisation de pèlerinage (Hajj)', 'Une seule fois dans la carrière, 2 mois'),
  ]),
  AuthorizationGroup('Autorisations pour raisons de santé', [
    AuthorizationType('SICK_SHORT_TERM', 'Maladie de courte durée', '6 mois maximum par an'),
    AuthorizationType('SICK_MEDIUM_TERM', 'Maladie de moyenne durée', "Jusqu'à 3 ans"),
    AuthorizationType('SICK_LONG_TERM', 'Maladie de longue durée', "Jusqu'à 5 ans, maladies fixées par la loi"),
    AuthorizationType('WORK_ACCIDENT', 'Maladie ou accident du travail', "Jusqu'à la reprise du travail ou la mise à la retraite"),
  ]),
  AuthorizationGroup('Maternité, paternité, kafala, allaitement', [
    AuthorizationType('MATERNITY', 'Autorisation de maternité', '14 semaines'),
    AuthorizationType('PATERNITY', 'Autorisation de paternité', '15 jours'),
    AuthorizationType('ADOPTION', 'Autorisation de kafala', '14 semaines'),
    AuthorizationType('NURSING', "Heure d'allaitement", "1 heure par jour jusqu'aux 24 mois de l'enfant"),
  ]),
  AuthorizationGroup('Autorisations sans traitement', [
    AuthorizationType('UNPAID_LEAVE', 'Autorisation sans traitement', 'Sur demande, un mois maximum tous les deux ans'),
  ]),
];

// Anciennes valeurs encore présentes dans l'historique des demandes.
const _legacyLabels = <String, String>{
  'SICK_LEAVE': 'Autorisation maladie',
  'PERSONAL_LEAVE': 'Autorisation personnelle',
  'MATERNITY_LEAVE': 'Autorisation de maternité',
  'PATERNITY_LEAVE': 'Autorisation de paternité',
  'EMERGENCY_LEAVE': "Autorisation d'urgence",
};

AuthorizationType? findAuthorizationType(String value) {
  for (final g in authorizationGroups) {
    for (final t in g.types) {
      if (t.value == value) return t;
    }
  }
  return null;
}

String authorizationLabel(String value) =>
    findAuthorizationType(value)?.label ?? _legacyLabels[value] ?? value;
