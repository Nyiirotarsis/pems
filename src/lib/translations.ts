
const en = {
  navHome: 'Home',
  navUsers: 'Users',
  navRoles: 'Roles',
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
  navHelp: 'Aide',
  navContact: 'Contact',
  loginButton: 'Connexion',
  homeTitle: 'Système de Gestion d\'Événements Pacific',
  homeSubtitle: 'Rationalisez vos opérations événementielles, de l\'inventaire à la finance, sur une seule plateforme puissante.',
  getStartedButton: 'Commencer',
  footerText: 'Système de Gestion d\'Événements Pacific. Tous droits réservés.',
};

export const translations = {
  en,
  fr,
};

export type Language = keyof typeof translations;
