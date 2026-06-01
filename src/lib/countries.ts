export const COUNTRY_CODES = [
  "AF","ZA","AL","DZ","DE","AD","AO","AG","SA","AR","AM","AU","AT","AZ","BS","BH","BD","BB","BE","BZ",
  "BJ","BT","BY","MM","BO","BA","BW","BR","BN","BG","BF","BI","KH","CM","CA","CV","CL","CN","CY","CO",
  "KM","CG","CD","KR","KP","CR","CI","HR","CU","DK","DJ","DM","EG","SV","AE","EC","ER","ES","EE","US",
  "ET","FJ","FI","FR","GA","GM","GE","GH","GR","GD","GT","GN","GW","GQ","GY","HT","HN","HU","IN","ID",
  "IQ","IR","IE","IS","IL","IT","JM","JP","JO","KZ","KE","KG","KI","KW","LA","LS","LV","LB","LR","LY",
  "LI","LT","LU","MK","MG","MY","MW","MV","ML","MT","MA","MH","MU","MR","MX","FM","MD","MC","MN","ME",
  "MZ","NA","NR","NP","NI","NE","NG","NO","NZ","OM","UG","UZ","PK","PW","PS","PA","PG","PY","NL","PE",
  "PH","PL","PT","QA","CF","DO","CZ","RO","GB","RU","RW","KN","SM","VC","LC","SB","WS","ST","SN","RS",
  "SC","SL","SG","SK","SI","SO","SD","SS","LK","SE","CH","SR","SY","TJ","TZ","TD","TH","TL","TG","TO",
  "TT","TN","TM","TR","TV","UA","UY","VU","VA","VE","VN","YE","ZM","ZW"
] as const;

export type CountryOption = { code: string; name: string };

const collator = new Intl.Collator("fr", { sensitivity: "base" });

export function getCountries(locale = "fr"): CountryOption[] {
  let dn: Intl.DisplayNames | null = null;
  try {
    dn = new Intl.DisplayNames([locale], { type: "region" });
  } catch {
    dn = null;
  }
  const list = COUNTRY_CODES.map((code) => ({
    code,
    name: (dn?.of(code) ?? code) as string,
  }));
  list.sort((a, b) => collator.compare(a.name, b.name));
  return list;
}
