import { SecurityTip } from '../types';

export const SECURITY_TIPS: SecurityTip[] = [
  { id: '1', title: 'Ne partagez jamais votre seed phrase', description: 'Personne légitime ne vous demandera vos 12 ou 24 mots de récupération.', category: 'general' },
  { id: '2', title: 'Activez la double authentification', description: 'Utilisez la 2FA sur tous vos comptes exchange et wallets.', category: 'general' },
  { id: '3', title: 'Vérifiez les adresses', description: 'Contrôlez toujours l\'adresse de destination avant d\'envoyer des fonds.', category: 'transactions' },
  { id: '4', title: 'Méfiez-vous des gains garantis', description: 'Aucun investissement ne garantit 20% par semaine. C\'est probablement une arnaque.', category: 'scam' },
  { id: '5', title: 'Utilisez un hardware wallet', description: 'Pour les montants importants, un cold wallet est recommandé.', category: 'storage' },
  { id: '6', title: 'Mettez à jour vos logiciels', description: 'Gardez vos wallets et OS à jour pour corriger les failles de sécurité.', category: 'general' },
];

export const PHISHING_EXAMPLES = [
  { title: 'Faux email d\'exchange', description: 'Email imitant Binance/Coinbase demandant de « vérifier votre compte » via un lien frauduleux.', signs: ['URL suspecte', 'Urgence artificielle', 'Fautes d\'orthographe'] },
  { title: 'Support Telegram frauduleux', description: 'Faux agents support demandant votre seed phrase pour « débloquer » votre compte.', signs: ['Demande de seed phrase', 'Contact non sollicité', 'Promesse de remboursement'] },
  { title: 'Site clone', description: 'Copie visuelle d\'un exchange connu avec un domaine légèrement différent.', signs: ['Domaine incorrect', 'Pas de HTTPS', 'Certificat invalide'] },
];

export const COMMON_SCAMS = [
  { name: 'Ponzi / HYIP', description: 'Promesse de rendements élevés payés avec l\'argent des nouveaux investisseurs.', risk: 'CRITICAL' },
  { name: 'Fake Exchange', description: 'Plateforme d\'échange frauduleuse qui disparaît avec les fonds.', risk: 'HIGH' },
  { name: 'Giveaway Scam', description: '« Envoyez 1 BTC, recevez 2 BTC » — arnaque classique sur les réseaux sociaux.', risk: 'HIGH' },
  { name: 'Pump & Dump', description: 'Gonflement artificiel du prix d\'une crypto suivie d\'une vente massive.', risk: 'MEDIUM' },
  { name: 'Rug Pull', description: 'Les développeurs abandonnent un projet DeFi en emportant la liquidité.', risk: 'HIGH' },
  { name: 'Phishing Wallet', description: 'Application wallet malveillante qui vole vos clés privées.', risk: 'CRITICAL' },
];
