export interface CountryStateData {
  country: string;
  code: string;
  states: string[];
}

export const COUNTRIES_WITH_STATES: CountryStateData[] = [
  {
    country: 'United Kingdom',
    code: 'GB',
    states: [
      'England (Greater London)',
      'England (West Midlands)',
      'England (Greater Manchester)',
      'England (West Yorkshire)',
      'England (Merseyside)',
      'England (South Yorkshire)',
      'Scotland (Edinburgh)',
      'Scotland (Glasgow)',
      'Scotland (Aberdeen)',
      'Wales (Cardiff)',
      'Wales (Swansea)',
      'Northern Ireland (Belfast)',
      'Northern Ireland (Derry)',
      'Yorkshire & Humber',
      'East Midlands',
      'South East England',
      'South West England',
      'East of England',
      'North East England',
      'North West England'
    ]
  },
  {
    country: 'Germany',
    code: 'DE',
    states: [
      'Bavaria (München)',
      'Berlin',
      'Baden-Württemberg (Stuttgart)',
      'North Rhine-Westphalia (Köln/Düsseldorf)',
      'Hesse (Frankfurt)',
      'Hamburg',
      'Lower Saxony (Hannover)',
      'Saxony (Dresden/Leipzig)',
      'Rhineland-Palatinate (Mainz)',
      'Schleswig-Holstein (Kiel)',
      'Brandenburg (Potsdam)',
      'Thuringia (Erfurt)',
      'Saxony-Anhalt (Magdeburg)',
      'Mecklenburg-Vorpommern (Rostock)',
      'Saarland (Saarbrücken)',
      'Bremen'
    ]
  },
  {
    country: 'France',
    code: 'FR',
    states: [
      'Île-de-France (Paris)',
      'Auvergne-Rhône-Alpes (Lyon)',
      'Provence-Alpes-Côte d\'Azur (Marseille/Nice)',
      'Nouvelle-Aquitaine (Bordeaux)',
      'Occitanie (Toulouse/Montpellier)',
      'Hauts-de-France (Lille)',
      'Grand Est (Strasbourg)',
      'Pays de la Loire (Nantes)',
      'Brittany (Rennes)',
      'Normandy (Rouen/Caen)',
      'Bourgogne-Franche-Comté (Dijon)',
      'Centre-Val de Loire (Orléans)',
      'Corsica (Ajaccio)'
    ]
  },
  {
    country: 'Netherlands',
    code: 'NL',
    states: [
      'North Holland (Amsterdam/Haarlem)',
      'South Holland (Rotterdam/The Hague)',
      'Utrecht',
      'North Brabant (Eindhoven)',
      'Gelderland (Arnhem/Nijmegen)',
      'Overijssel (Zwolle)',
      'Limburg (Maastricht)',
      'Friesland (Leeuwarden)',
      'Groningen',
      'Drenthe (Assen)',
      'Zeeland (Middelburg)',
      'Flevoland (Almere)'
    ]
  },
  {
    country: 'Spain',
    code: 'ES',
    states: [
      'Community of Madrid (Madrid)',
      'Catalonia (Barcelona)',
      'Andalusia (Seville/Málaga)',
      'Valencian Community (Valencia/Alicante)',
      'Basque Country (Bilbao/San Sebastián)',
      'Galicia (A Coruña/Vigo)',
      'Castile and León (Valladolid)',
      'Canary Islands (Las Palmas/Tenerife)',
      'Balearic Islands (Palma de Mallorca)',
      'Castilla-La Mancha (Toledo)',
      'Region of Murcia (Murcia)',
      'Aragon (Zaragoza)',
      'Asturias (Oviedo)',
      'Navarre (Pamplona)',
      'Cantabria (Santander)',
      'Extremadura (Mérida)',
      'La Rioja (Logroño)'
    ]
  },
  {
    country: 'Italy',
    code: 'IT',
    states: [
      'Lombardy (Milan)',
      'Lazio (Rome)',
      'Veneto (Venice/Verona)',
      'Piedmont (Turin)',
      'Emilia-Romagna (Bologna)',
      'Tuscany (Florence)',
      'Campania (Naples)',
      'Sicily (Palermo/Catania)',
      'Apulia (Bari)',
      'Liguria (Genoa)',
      'Calabria (Catanzaro)',
      'Sardinia (Cagliari)',
      'Friuli Venezia Giulia (Trieste)',
      'Trentino-Alto Adige (Trento/Bolzano)',
      'Abruzzo (L\'Aquila)',
      'Umbria (Perugia)',
      'Marche (Ancona)'
    ]
  },
  {
    country: 'Switzerland',
    code: 'CH',
    states: [
      'Zurich',
      'Bern',
      'Vaud (Lausanne)',
      'Geneva',
      'Aargau',
      'St. Gallen',
      'Lucerne',
      'Ticino (Lugano/Bellinzona)',
      'Valais (Sion)',
      'Basel-Stadt (Basel)',
      'Fribourg',
      'Basel-Landschaft',
      'Solothurn',
      'Neuchâtel',
      'Graubünden (Chur)',
      'Thurgau',
      'Schwyz',
      'Zug'
    ]
  },
  {
    country: 'Austria',
    code: 'AT',
    states: [
      'Vienna',
      'Lower Austria (St. Pölten)',
      'Upper Austria (Linz)',
      'Styria (Graz)',
      'Tyrol (Innsbruck)',
      'Salzburg',
      'Carinthia (Klagenfurt)',
      'Vorarlberg (Bregenz)',
      'Burgenland (Eisenstadt)'
    ]
  },
  {
    country: 'Belgium',
    code: 'BE',
    states: [
      'Brussels-Capital Region',
      'Antwerp',
      'East Flanders (Ghent)',
      'Flemish Brabant (Leuven)',
      'West Flanders (Bruges)',
      'Liège',
      'Hainaut (Charleroi/Mons)',
      'Walloon Brabant (Wavre)',
      'Namur',
      'Limburg (Hasselt)',
      'Luxembourg (Arlon)'
    ]
  },
  {
    country: 'Norway',
    code: 'NO',
    states: [
      'Oslo',
      'Viken',
      'Vestland (Bergen)',
      'Trøndelag (Trondheim)',
      'Rogaland (Stavanger)',
      'Innlandet',
      'Vestfold og Telemark',
      'Agder (Kristiansand)',
      'Møre og Romsdal',
      'Nordland',
      'Troms og Finnmark'
    ]
  },
  {
    country: 'Sweden',
    code: 'SE',
    states: [
      'Stockholm County',
      'Västra Götaland (Gothenburg)',
      'Skåne (Malmö)',
      'Uppsala County',
      'Östergötland',
      'Jönköping County',
      'Halland',
      'Örebro County',
      'Värmland',
      'Dalarna',
      'Västerbotten (Umeå)',
      'Norrbotten (Luleå)'
    ]
  },
  {
    country: 'Denmark',
    code: 'DK',
    states: [
      'Capital Region (Copenhagen)',
      'Central Denmark Region (Aarhus)',
      'Region of Southern Denmark (Odense)',
      'North Denmark Region (Aalborg)',
      'Region Zealand (Roskilde)'
    ]
  },
  {
    country: 'Poland',
    code: 'PL',
    states: [
      'Masovian (Warsaw)',
      'Lesser Poland (Kraków)',
      'Lower Silesian (Wrocław)',
      'Greater Poland (Poznań)',
      'Silesian (Katowice)',
      'Pomeranian (Gdańsk)',
      'Łódź',
      'Kuyavian-Pomeranian (Bydgoszcz)',
      'Lublin',
      'Subcarpathian (Rzeszów)'
    ]
  },
  {
    country: 'Ireland',
    code: 'IE',
    states: [
      'Leinster (Dublin)',
      'Munster (Cork)',
      'Connacht (Galway)',
      'Munster (Limerick)',
      'Munster (Waterford)',
      'Ulster (Cavan, Donegal, Monaghan)',
      'Leinster (Kildare/Meath)',
      'Munster (Kerry)'
    ]
  },
  {
    country: 'Portugal',
    code: 'PT',
    states: [
      'Lisbon Metropolitan Area',
      'Porto Metropolitan Area',
      'Braga District',
      'Setúbal District',
      'Aveiro District',
      'Faro (Algarve)',
      'Coimbra District',
      'Leiria District',
      'Madeira Autonomous Region',
      'Azores Autonomous Region'
    ]
  },
  {
    country: 'Finland',
    code: 'FI',
    states: [
      'Uusimaa (Helsinki)',
      'Pirkanmaa (Tampere)',
      'Southwest Finland (Turku)',
      'North Ostrobothnia (Oulu)',
      'Central Finland (Jyväskylä)',
      'Northern Savonia (Kuopio)',
      'Lapland (Rovaniemi)'
    ]
  },
  {
    country: 'Greece',
    code: 'GR',
    states: [
      'Attica (Athens)',
      'Central Macedonia (Thessaloniki)',
      'Crete (Heraklion)',
      'Western Greece (Patras)',
      'Thessaly (Larissa)',
      'Peloponnese',
      'South Aegean (Rhodes/Mykonos)'
    ]
  },
  {
    country: 'Czech Republic',
    code: 'CZ',
    states: [
      'Prague',
      'Central Bohemian Region',
      'South Moravian Region (Brno)',
      'Moravian-Silesian Region (Ostrava)',
      'Plzeň Region',
      'Olomouc Region',
      'Ústí nad Labem Region'
    ]
  },
  {
    country: 'United States',
    code: 'US',
    states: [
      'California (Los Angeles/San Francisco)',
      'New York (New York City)',
      'Texas (Houston/Austin/Dallas)',
      'Florida (Miami/Orlando)',
      'Illinois (Chicago)',
      'Pennsylvania (Philadelphia)',
      'Washington (Seattle)',
      'Massachusetts (Boston)',
      'Georgia (Atlanta)',
      'North Carolina (Charlotte/Raleigh)',
      'Ohio (Columbus)',
      'Colorado (Denver)',
      'Virginia',
      'Arizona (Phoenix)',
      'New Jersey',
      'Michigan (Detroit)'
    ]
  },
  {
    country: 'Canada',
    code: 'CA',
    states: [
      'Ontario (Toronto/Ottawa)',
      'Quebec (Montreal/Quebec City)',
      'British Columbia (Vancouver/Victoria)',
      'Alberta (Calgary/Edmonton)',
      'Manitoba (Winnipeg)',
      'Saskatchewan (Saskatoon)',
      'Nova Scotia (Halifax)'
    ]
  },
  {
    country: 'Australia',
    code: 'AU',
    states: [
      'New South Wales (Sydney)',
      'Victoria (Melbourne)',
      'Queensland (Brisbane)',
      'Western Australia (Perth)',
      'South Australia (Adelaide)',
      'Tasmania (Hobart)',
      'Australian Capital Territory (Canberra)'
    ]
  },
  {
    country: 'United Arab Emirates',
    code: 'AE',
    states: [
      'Dubai',
      'Abu Dhabi',
      'Sharjah',
      'Ajman',
      'Ras Al Khaimah',
      'Fujairah',
      'Umm Al Quwain'
    ]
  },
  {
    country: 'Singapore',
    code: 'SG',
    states: [
      'Central Region (Downtown)',
      'Jurong / West Region',
      'Tampines / East Region',
      'Woodlands / North Region',
      'Novena / Central North'
    ]
  },
  {
    country: 'Japan',
    code: 'JP',
    states: [
      'Tokyo Metropolis',
      'Osaka Prefecture',
      'Kanagawa Prefecture (Yokohama)',
      'Aichi Prefecture (Nagoya)',
      'Kyoto Prefecture',
      'Fukuoka Prefecture',
      'Hokkaido (Sapporo)',
      'Hyogo Prefecture (Kobe)',
      'Saitama Prefecture',
      'Chiba Prefecture'
    ]
  },
  {
    country: 'Luxembourg',
    code: 'LU',
    states: [
      'Luxembourg City / Canton',
      'Esch-sur-Alzette',
      'Diekirch',
      'Grevenmacher',
      'Capellen',
      'Mersch'
    ]
  },
  {
    country: 'Monaco',
    code: 'MC',
    states: [
      'Monte Carlo',
      'La Condamine',
      'Fontvieille',
      'Monaco-Ville'
    ]
  },
  {
    country: 'Liechtenstein',
    code: 'LI',
    states: [
      'Vaduz',
      'Schaan',
      'Balzers',
      'Triesen',
      'Eschen'
    ]
  }
];

export const getCountryStateData = (countryName: string): CountryStateData | undefined => {
  return COUNTRIES_WITH_STATES.find(
    (c) => c.country.toLowerCase() === countryName.toLowerCase() || c.code.toLowerCase() === countryName.toLowerCase()
  );
};
