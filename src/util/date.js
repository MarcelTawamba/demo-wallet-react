import moment from 'moment';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const WEEK4 = 4 * WEEK;
const MONTH = 31 * DAY;
const YEAR = Math.floor(365 * DAY);

export const TIMES = {
  second: SECOND,
  minute: MINUTE,
  day: DAY,
  hour: HOUR,
  week: WEEK,
  week4: WEEK4,
  month: MONTH,
  year: YEAR,
};

export const COUNTRY_DATE_FORMATS = {
  AD: 'DD-MM-YYYY', // Andorra
  AE: 'DD-MM-YYYY', // United Arab Emirates
  AF: 'DD-MM-YYYY', // Afghanistan
  AG: 'MM-DD-YYYY', // Antigua and Barbuda
  AI: 'MM-DD-YYYY', // Anguilla
  AL: 'DD-MM-YYYY', // Albania
  AM: 'DD-MM-YYYY', // Armenia
  AO: 'DD-MM-YYYY', // Angola
  AQ: 'YYYY-MM-DD', // Antarctica
  AR: 'DD-MM-YYYY', // Argentina
  AS: 'MM-DD-YYYY', // American Samoa
  AT: 'DD-MM-YYYY', // Austria
  AU: 'DD-MM-YYYY', // Australia
  AW: 'DD-MM-YYYY', // Aruba
  AX: 'DD-MM-YYYY', // Åland Islands
  AZ: 'DD-MM-YYYY', // Azerbaijan
  BB: 'DD-MM-YYYY', // Barbados
  BD: 'DD-MM-YYYY', // Bangladesh
  BE: 'DD-MM-YYYY', // Belgium
  BF: 'DD-MM-YYYY', // Burkina Faso
  BG: 'DD-MM-YYYY', // Bulgaria
  BH: 'DD-MM-YYYY', // Bahrain
  BI: 'DD-MM-YYYY', // Burundi
  BJ: 'DD-MM-YYYY', // Benin
  BL: 'DD-MM-YYYY', // Saint Barthélemy
  BM: 'DD-MM-YYYY', // Bermuda
  BN: 'DD-MM-YYYY', // Brunei Darussalam
  BO: 'DD-MM-YYYY', // Bolivia (Plurinational State of)
  BQ: 'DD-MM-YYYY', // Bonaire, Sint Eustatius and Saba
  BR: 'DD-MM-YYYY', // Brazil
  BS: 'DD-MM-YYYY', // Bahamas
  BT: 'DD-MM-YYYY', // Bhutan
  BV: 'YYYY-MM-DD', // Bouvet Island
  BW: 'DD-MM-YYYY', // Botswana
  BY: 'DD-MM-YYYY', // Belarus
  BZ: 'DD-MM-YYYY', // Belize
  CA: 'YYYY-MM-DD', // Canada
  CC: 'DD-MM-YYYY', // Cocos (Keeling) Islands
  CD: 'DD-MM-YYYY', // Congo (Democratic Republic of the)
  CF: 'DD-MM-YYYY', // Central African Republic
  CG: 'DD-MM-YYYY', // Congo
  CH: 'DD-MM-YYYY', // Switzerland
  CI: 'DD-MM-YYYY', // Côte d'Ivoire
  CK: 'DD-MM-YYYY', // Cook Islands
  CL: 'DD-MM-YYYY', // Chile
  CM: 'DD-MM-YYYY', // Cameroon
  CN: 'YYYY-MM-DD', // China
  CO: 'DD-MM-YYYY', // Colombia
  CR: 'DD-MM-YYYY', // Costa Rica
  CU: 'DD-MM-YYYY', // Cuba
  CV: 'DD-MM-YYYY', // Cabo Verde
  CW: 'DD-MM-YYYY', // Curaçao
  CX: 'DD-MM-YYYY', // Christmas Island
  CY: 'DD-MM-YYYY', // Cyprus
  CZ: 'DD-MM-YYYY', // Czech Republic
  DE: 'DD-MM-YYYY', // Germany
  DJ: 'DD-MM-YYYY', // Djibouti
  DK: 'DD-MM-YYYY', // Denmark
  DM: 'DD-MM-YYYY', // Dominica
  DO: 'DD-MM-YYYY', // Dominican Republic
  DZ: 'DD-MM-YYYY', // Algeria
  EC: 'DD-MM-YYYY', // Ecuador
  EE: 'DD-MM-YYYY', // Estonia
  EG: 'DD-MM-YYYY', // Egypt
  EH: 'DD-MM-YYYY', // Western Sahara
  ER: 'DD-MM-YYYY', // Eritrea
  ES: 'DD-MM-YYYY', // Spain
  ET: 'DD-MM-YYYY', // Ethiopia
  FI: 'DD-MM-YYYY', // Finland
  FJ: 'DD-MM-YYYY', // Fiji
  FK: 'DD-MM-YYYY', // Falkland Islands (Malvinas)
  FM: 'DD-MM-YYYY', // Micronesia (Federated States of)
  FO: 'DD-MM-YYYY', // Faroe Islands
  FR: 'DD-MM-YYYY', // France
  GA: 'DD-MM-YYYY', // Gabon
  GB: 'DD-MM-YYYY', // United Kingdom
  GD: 'DD-MM-YYYY', // Grenada
  GE: 'DD-MM-YYYY', // Georgia
  GF: 'DD-MM-YYYY', // French Guiana
  GG: 'DD-MM-YYYY', // Guernsey
  GH: 'DD-MM-YYYY', // Ghana
  GI: 'DD-MM-YYYY', // Gibraltar
  GL: 'DD-MM-YYYY', // Greenland
  GM: 'DD-MM-YYYY', // Gambia
  GN: 'DD-MM-YYYY', // Guinea
  GP: 'DD-MM-YYYY', // Guadeloupe
  GQ: 'DD-MM-YYYY', // Equatorial Guinea
  GR: 'DD-MM-YYYY', // Greece
  GS: 'YYYY-MM-DD', // South Georgia and the South Sandwich Islands
  GT: 'DD-MM-YYYY', // Guatemala
  GU: 'MM-DD-YYYY', // Guam
  GW: 'DD-MM-YYYY', // Guinea-Bissau
  GY: 'DD-MM-YYYY', // Guyana
  HK: 'DD-MM-YYYY', // Hong Kong
  HM: 'DD-MM-YYYY', // Heard Island and McDonald Islands
  HN: 'DD-MM-YYYY', // Honduras
  HR: 'DD-MM-YYYY', // Croatia
  HT: 'DD-MM-YYYY', // Haiti
  HU: 'YYYY-MM-DD', // Hungary
  ID: 'DD-MM-YYYY', // Indonesia
  IE: 'DD-MM-YYYY', // Ireland
  IL: 'DD-MM-YYYY', // Israel
  IM: 'DD-MM-YYYY', // Isle of Man
  IN: 'DD-MM-YYYY', // India
  IO: 'DD-MM-YYYY', // British Indian Ocean Territory
  IQ: 'DD-MM-YYYY', // Iraq
  IR: 'DD-MM-YYYY', // Iran (Islamic Republic of)
  IS: 'DD-MM-YYYY', // Iceland
  IT: 'DD-MM-YYYY', // Italy
  JE: 'DD-MM-YYYY', // Jersey
  JM: 'DD-MM-YYYY', // Jamaica
  JO: 'DD-MM-YYYY', // Jordan
  JP: 'YYYY-MM-DD', // Japan
  KE: 'DD-MM-YYYY', // Kenya
  KG: 'DD-MM-YYYY', // Kyrgyzstan
  KH: 'DD-MM-YYYY', // Cambodia
  KI: 'DD-MM-YYYY', // Kiribati
  KM: 'DD-MM-YYYY', // Comoros
  KN: 'DD-MM-YYYY', // Saint Kitts and Nevis
  KP: 'YYYY-MM-DD', // Korea (Democratic People's Republic of)
  KR: 'YYYY-MM-DD', // Korea (Republic of)
  KW: 'DD-MM-YYYY', // Kuwait
  KY: 'DD-MM-YYYY', // Cayman Islands
  KZ: 'DD-MM-YYYY', // Kazakhstan
  LA: 'DD-MM-YYYY', // Lao People's Democratic Republic
  LB: 'DD-MM-YYYY', // Lebanon
  LC: 'DD-MM-YYYY', // Saint Lucia
  LI: 'DD-MM-YYYY', // Liechtenstein
  LK: 'DD-MM-YYYY', // Sri Lanka
  LR: 'DD-MM-YYYY', // Liberia
  LS: 'DD-MM-YYYY', // Lesotho
  LT: 'YYYY-MM-DD', // Lithuania
  LU: 'DD-MM-YYYY', // Luxembourg
  LV: 'DD-MM-YYYY', // Latvia
  LY: 'DD-MM-YYYY', // Libya
  MA: 'DD-MM-YYYY', // Morocco
  MC: 'DD-MM-YYYY', // Monaco
  MD: 'DD-MM-YYYY', // Moldova (Republic of)
  ME: 'DD-MM-YYYY', // Montenegro
  MF: 'DD-MM-YYYY', // Saint Martin (French part)
  MG: 'DD-MM-YYYY', // Madagascar
  MH: 'MM-DD-YYYY', // Marshall Islands
  MK: 'DD-MM-YYYY', // North Macedonia
  ML: 'DD-MM-YYYY', // Mali
  MM: 'DD-MM-YYYY', // Myanmar
  MN: 'YYYY-MM-DD', // Mongolia
  MO: 'DD-MM-YYYY', // Macao
  MP: 'MM-DD-YYYY', // Northern Mariana Islands
  MQ: 'DD-MM-YYYY', // Martinique
  MR: 'DD-MM-YYYY', // Mauritania
  MS: 'DD-MM-YYYY', // Montserrat
  MT: 'DD-MM-YYYY', // Malta
  MU: 'DD-MM-YYYY', // Mauritius
  MV: 'DD-MM-YYYY', // Maldives
  MW: 'DD-MM-YYYY', // Malawi
  MX: 'DD-MM-YYYY', // Mexico
  MY: 'DD-MM-YYYY', // Malaysia
  MZ: 'DD-MM-YYYY', // Mozambique
  NA: 'DD-MM-YYYY', // Namibia
  NC: 'DD-MM-YYYY', // New Caledonia
  NE: 'DD-MM-YYYY', // Niger
  NF: 'DD-MM-YYYY', // Norfolk Island
  NG: 'DD-MM-YYYY', // Nigeria
  NI: 'DD-MM-YYYY', // Nicaragua
  NL: 'DD-MM-YYYY', // Netherlands
  NO: 'DD-MM-YYYY', // Norway
  NP: 'DD-MM-YYYY', // Nepal
  NR: 'DD-MM-YYYY', // Nauru
  NU: 'DD-MM-YYYY', // Niue
  NZ: 'DD-MM-YYYY', // New Zealand
  OM: 'DD-MM-YYYY', // Oman
  PA: 'MM-DD-YYYY', // Panama
  PE: 'DD-MM-YYYY', // Peru
  PF: 'DD-MM-YYYY', // French Polynesia
  PG: 'DD-MM-YYYY', // Papua New Guinea
  PH: 'MM-DD-YYYY', // Philippines
  PK: 'DD-MM-YYYY', // Pakistan
  PL: 'DD-MM-YYYY', // Poland
  PM: 'DD-MM-YYYY', // Saint Pierre and Miquelon
  PN: 'DD-MM-YYYY', // Pitcairn
  PR: 'MM-DD-YYYY', // Puerto Rico
  PS: 'DD-MM-YYYY', // Palestine, State of
  PT: 'DD-MM-YYYY', // Portugal
  PW: 'MM-DD-YYYY', // Palau
  PY: 'DD-MM-YYYY', // Paraguay
  QA: 'DD-MM-YYYY', // Qatar
  RE: 'DD-MM-YYYY', // Réunion
  RO: 'DD-MM-YYYY', // Romania
  RS: 'DD-MM-YYYY', // Serbia
  RU: 'DD-MM-YYYY', // Russian Federation
  RW: 'DD-MM-YYYY', // Rwanda
  SA: 'DD-MM-YYYY', // Saudi Arabia
  SB: 'DD-MM-YYYY', // Solomon Islands
  SC: 'DD-MM-YYYY', // Seychelles
  SD: 'DD-MM-YYYY', // Sudan
  SE: 'YYYY-MM-DD', // Sweden
  SG: 'DD-MM-YYYY', // Singapore
  SH: 'DD-MM-YYYY', // Saint Helena, Ascension and Tristan da Cunha
  SI: 'DD-MM-YYYY', // Slovenia
  SJ: 'DD-MM-YYYY', // Svalbard and Jan Mayen
  SK: 'DD-MM-YYYY', // Slovakia
  SL: 'DD-MM-YYYY', // Sierra Leone
  SM: 'DD-MM-YYYY', // San Marino
  SN: 'DD-MM-YYYY', // Senegal
  SO: 'DD-MM-YYYY', // Somalia
  SR: 'DD-MM-YYYY', // Suriname
  SS: 'DD-MM-YYYY', // South Sudan
  ST: 'DD-MM-YYYY', // Sao Tome and Principe
  SV: 'DD-MM-YYYY', // El Salvador
  SX: 'DD-MM-YYYY', // Sint Maarten (Dutch part)
  SY: 'DD-MM-YYYY', // Syrian Arab Republic
  SZ: 'DD-MM-YYYY', // Eswatini
  TC: 'DD-MM-YYYY', // Turks and Caicos Islands
  TD: 'DD-MM-YYYY', // Chad
  TF: 'DD-MM-YYYY', // French Southern Territories
  TG: 'DD-MM-YYYY', // Togo
  TH: 'DD-MM-YYYY', // Thailand
  TJ: 'DD-MM-YYYY', // Tajikistan
  TK: 'DD-MM-YYYY', // Tokelau
  TL: 'DD-MM-YYYY', // Timor-Leste
  TM: 'DD-MM-YYYY', // Turkmenistan
  TN: 'DD-MM-YYYY', // Tunisia
  TO: 'DD-MM-YYYY', // Tonga
  TR: 'DD-MM-YYYY', // Turkey
  TT: 'DD-MM-YYYY', // Trinidad and Tobago
  TV: 'DD-MM-YYYY', // Tuvalu
  TW: 'YYYY-MM-DD', // Taiwan (Province of China)
  TZ: 'DD-MM-YYYY', // Tanzania, United Republic of
  UA: 'DD-MM-YYYY', // Ukraine
  UG: 'DD-MM-YYYY', // Uganda
  UM: 'MM-DD-YYYY', // United States Minor Outlying Islands
  US: 'MM-DD-YYYY', // United States of America
  UY: 'DD-MM-YYYY', // Uruguay
  UZ: 'DD-MM-YYYY', // Uzbekistan
  VA: 'DD-MM-YYYY', // Holy See
  VC: 'DD-MM-YYYY', // Saint Vincent and the Grenadines
  VE: 'DD-MM-YYYY', // Venezuela (Bolivarian Republic of)
  VG: 'DD-MM-YYYY', // Virgin Islands (British)
  VI: 'MM-DD-YYYY', // Virgin Islands (U.S.)
  VN: 'DD-MM-YYYY', // Vietnam
  VU: 'DD-MM-YYYY', // Vanuatu
  WF: 'DD-MM-YYYY', // Wallis and Futuna
  WS: 'DD-MM-YYYY', // Samoa
  XK: 'DD-MM-YYYY', // Kosovo
  YE: 'DD-MM-YYYY', // Yemen
  YT: 'DD-MM-YYYY', // Mayotte
  ZA: 'YYYY-MM-DD', // South Africa
  ZM: 'DD-MM-YYYY', // Zambia
  ZW: 'DD-MM-YYYY', // Zimbabwe
};

export function getCountryFormattedDate(date, countryCode, withTime = false) {
  let format = COUNTRY_DATE_FORMATS[countryCode ?? 'US'] ?? 'MM-DD-YYYY';
  if (withTime) {
    format = format + ' hh:mm a';
  }
  const value = moment(date).format(format);
  return value;
}
