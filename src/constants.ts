import { Tier, Vehicle } from './types';

export const TIERS: Tier[] = [
  {
    id: 'elite',
    name: 'Elite',
    price: '$15,000 / ANNUALLY',
    tag: 'ENTRY PROTOCOL',
    features: ['Regional Ops Response', 'B6 Class Armoring', '24/7 Concierge']
  },
  {
    id: 'presidential',
    name: 'Presidential',
    price: '$120,000 / ANNUALLY',
    tag: 'MAXIMUM ASSET PROTECTION',
    features: ['24/7 Global Ops Center', 'B7 Armoring & Air Support', 'Biometric Threat Detection', 'Exfiltration Logistics'],
    mostRequested: true
  },
  {
    id: 'executive',
    name: 'Executive',
    price: '$45,000 / ANNUALLY',
    tag: 'PROFESSIONAL GRADE',
    features: ['Continental Response', 'B6+ Tactical Fleet', 'Cyber-Suite Access']
  }
];

export const VEHICLES: Vehicle[] = [
  {
    id: 'suv-blindada',
    name: 'SUV Blindada',
    category: 'ARMORED COMMAND UNIT',
    description: 'Level B7 Ballistic Protection. Full perimeter sensors.',
    armor: 'B7',
    capacity: '4 PAX',
    price: 420.00,
    eta: 8,
    icon: 'Car',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrQ-i7ZLNu8H4Pv9U1AyKnC1zb4vHF10GHUyfGyTL_40_lzTa0uN8SUdZRaxG_j2r-5MCrak9M2ikZ0a1VPYKJPI-Ew9_ZpibX1SoN9usQRQEWoSH74xFhB0xre-SMTe3e5rddlQoadllX-PCRn0Y6ZaJCFdDbTtUpqw-xlGgZugWba2TjK_NKUh-AkXuFtecZIn4hbDo0NSYntCc7RPYUZ8YScl9_PidvxWWCSdmvgGsm8tMAngrsSoEakH-zp052jz1b_i0jS7k'
  },
  {
    id: 'sedan-ejecutivo',
    name: 'Sedán Ejecutivo',
    category: 'VIP STEALTH TRANSPORT',
    description: 'Level B4 High-Speed Mobility. Discretion prioritized.',
    armor: 'B4',
    capacity: '3 PAX',
    price: 280.00,
    eta: 5,
    icon: 'CarFront',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3bh1-Te38mi57cgbrEWY9KyEn7R_sx1748H6_9NSC_4YHsVuTFFoA4jWQVwJIY4sOxP94Sq-n_W84gN4j5d_oH2oEGIBK_DLqFCJy084fFvNp2NjzpMOqHm4TQpcons0XJhts1fZaZ22T9iPA3nfor9fwQ1Ho-Jy9PnFulDIRyGbQfMBrqnotehn5COyOkX3kkVT3-aboUlJO-5gNGd3PRI9coEsPW8IXsU3cD6_F1a21jDH9HxlpP3GlYlIFWelZ1e7sTOq_ApE'
  },
  {
    id: 'convoy-tactico',
    name: 'Convoy táctico',
    category: 'OFF-ROAD EXTRACTION',
    description: '3 Vehicle formation. Lead & Tail escort units.',
    armor: 'B7+',
    units: 3,
    price: 1150.00,
    eta: 12,
    icon: 'GitFork',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXrTiOrOibKN_0VifTk8buDMVcFjNTCpSsTm3B3xB9lmXA6pt4-gsCcINxxhwI87iIifb25X5uIifnQG8dSvqJWP-BqVvJ-_DIbHDMtwVaX4RribNN9-E82_-cWHRAhiapCEhLEgk55sg74cXZrUkdCbwy0a3r0lrf-qhXTyCNYttenFa1ZJLQ6IGsir7l7PrBugReGNNLDQRXsiC4g6e7JhfnBr8JJ95eeG3gDe8Km1Xz_ZMASHtuL2ixdQe9b5d-FCGkdIXao6Q'
  }
];
