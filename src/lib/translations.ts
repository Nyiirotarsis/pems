
const en = {
  navHome: 'Home',
  navUsers: 'Users',
  navRoles: 'Roles',
  navPolicies: 'Policies',
  navHelp: 'Help',
  navContact: 'Contact',
  loginButton: 'Login',
  homeTitle: 'Pacific Events Management System',
  homeSubtitle: 'Streamline your event operations from inventory to finance, all in one powerful platform.',
  getStartedButton: 'Get Started',
  footerText: 'Pacific Events Management System. All Rights Reserved.',
};

const fr = {
  navHome: 'Accueil',
  navUsers: 'Utilisateurs',
  navRoles: 'Rôles',
  navPolicies: 'Politiques',
  navHelp: 'Aide',
  navContact: 'Contact',
  loginButton: 'Connexion',
  homeTitle: 'Système de Gestion d\'Événements Pacific',
  homeSubtitle: 'Rationalisez vos opérations événementielles, de l\'inventaire à la finance, sur une seule plateforme puissante.',
  getStartedButton: 'Commencer',
  footerText: 'Système de Gestion d\'Événements Pacific. Tous droits réservés.',
};

// Placeholder translations - they will show English text.
const sw = { ...en, navHome: 'Nyumbani' };
const ar = { ...en, navHome: 'الرئيسية' };
const lg = { ...en, navHome: 'Enyumba' };
const ny = { ...en, navHome: 'Ahabw\'enju' };
const soga = { ...en, navHome: 'Aka' };


export const translations = {
  en,
  fr,
  sw,
  ar,
  lg,
  ny,
  soga,
};

export type Language = keyof typeof translations;
