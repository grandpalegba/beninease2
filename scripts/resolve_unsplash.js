const fs = require('fs');

const urls = [
  "https://unsplash.com/fr/photos/un-groupe-dhommes-travaillant-sur-un-bateau-sur-la-plage-ZY0eI-L-FBc",
  "https://unsplash.com/fr/photos/deux-personnes-dans-un-bateau-sur-un-plan-deau-7-Y-O6FA9wE",
  "https://unsplash.com/fr/photos/deux-femmes-debout-sous-un-parapluie-dans-un-jardin-9NJXIPMlGPo",
  "https://unsplash.com/fr/photos/femme-en-robe-fleurie-bleue-et-blanche-assise-sur-un-bateau-en-bois-brun-pendant-la-journee-G-3AiLWJZTE",
  "https://unsplash.com/fr/photos/homme-assis-sur-le-bateau-RGsjc0D0p_o",
  "https://unsplash.com/fr/photos/un-pecheur-jette-son-filet-sur-leau-DZMmcKTZCbA",
  "https://unsplash.com/fr/photos/un-homme-en-chemise-jaune-debout-devant-une-foule-UZqhx42lfgI",
  "https://unsplash.com/fr/photos/homme-en-cheval-noir-et-blanc-sur-le-sable-brun-pendant-la-journee-a6Y-K1duTk8",
  "https://unsplash.com/fr/photos/deux-pedalos-noirs-sur-le-bord-de-mer-pendant-la-journee-aV5lsZfxOwg",
  "https://unsplash.com/fr/photos/homme-montant-sur-un-bateau-bleu-sur-un-plan-deau-pendant-la-journee-JoQqx0fOORU",
  "https://unsplash.com/fr/photos/une-femme-arrosant-son-jardin-avec-un-arrosoir-_xK71jblMv8",
  "https://unsplash.com/fr/photos/pont-brun-au-lever-du-soleil-tqkzjhnI9i8",
  "https://unsplash.com/fr/photos/un-groupe-de-personnes-monte-sur-des-bateaux-avec-tonle-sap-en-arriere-plan-grYEjcIopgc",
  "https://unsplash.com/fr/photos/une-pile-de-tissus-poses-les-uns-sur-les-autres-GpPZLl7RM-A",
  "https://unsplash.com/fr/photos/personne-en-robe-blanche-et-chapeau-brun-assis-sur-un-banc-en-bois-brun-pendant-la-journee-tOshpNl-sW4",
  "https://unsplash.com/fr/photos/homme-en-chemise-blanche-a-manches-longues-et-chapeau-blanc-debout-devant-le-stand-de-fruits-ME416b6sp2",

  "https://unsplash.com/fr/photos/une-rue-de-la-ville-remplie-de-beaucoup-de-circulation-vvQW-3yfuos",
  "https://unsplash.com/fr/photos/photographie-aerienne-de-la-ville-6UqJTfoXIq8",
  "https://unsplash.com/fr/photos/une-femme-vetue-dune-robe-verte-regarde-son-telephone-portable-aqmgLrdyz3E",
  "https://unsplash.com/fr/photos/une-femme-vend-des-bananes-dans-la-rue-Tb9D4Ix9oYo",
  "https://unsplash.com/fr/photos/children-sitting-on-chairs-inside-classroom-jEEYZsaxbH4",
  "https://unsplash.com/fr/photos/photo-de-groupe-de-personnes-SPS796v4KmM",
  "https://unsplash.com/fr/photos/woman-carrying-baby-on-back-yrzBgqapG1I",
  "https://unsplash.com/fr/photos/une-femme-marchant-dans-une-rue-avec-un-seau-sur-la-tete-xzM6dK7nxME",
  "https://unsplash.com/fr/photos/femme-tenant-de-lherbe-verte-m0DUL38R49Y",
  "https://unsplash.com/fr/photos/femme-avec-une-fleur-verte-et-blanche-sur-loreille-h1lA3N5wb8M",
  "https://unsplash.com/fr/photos/womens-white-t-shirt-wtk4VH8EU20",
  "https://unsplash.com/fr/photos/des-personnes-dans-un-vehicule-avec-des-vetements-traditionnels-et-des-bijoux-Mf_J-HCtBcU",
  "https://unsplash.com/fr/photos/un-homme-et-une-femme-debout-dans-leau-RnQliMw6b4o",
  "https://unsplash.com/fr/photos/musicien-jouant-du-tambour-avec-ses-mains-xNIc8pWjglM",
  "https://unsplash.com/fr/photos/femme-tenant-un-panier-gB5qrP0eY50",
  "https://unsplash.com/fr/photos/femme-vendant-des-bananes-frites-dans-un-marche-en-plein-air-KFO2m5Ms1Pc",

  "https://unsplash.com/fr/photos/un-jeune-garcon-tient-en-equilibre-un-grand-bol-de-nourriture-sur-sa-tete-r7ZIVIgLzgs",
  "https://unsplash.com/fr/photos/un-seau-de-fleurs-sechees-pose-a-cote-dun-tas-de-fleurs-sechees-BQfzl7E9GQ8",
  "https://unsplash.com/fr/photos/une-femme-assise-sur-le-sol-avec-un-bol-de-nourriture-xY5injZuStQ",
  "https://unsplash.com/fr/photos/un-agriculteur-soccupe-de-ses-cultures-dans-un-champ-vert-1AoGjqdyDLU",
  "https://unsplash.com/fr/photos/panier-de-pop-corn-rose-avec-ananas-et-decor-tisse-XAOVn2V6Jd0",
  "https://unsplash.com/fr/photos/femme-en-robe-violette-et-blanche-assise-sur-un-siege-en-bois-marron-us5Ti3ladQY",
  "https://unsplash.com/fr/photos/un-groupe-de-personnes-assises-sur-un-canape-regardant-un-ordinateur-portable-M7ALc3UuX_g",
  "https://unsplash.com/fr/photos/groupe-diversifie-de-jeunes-hommes-daffaires-africains-qui-soccupent-de-la-paperasse-ensemble-lors-dune-reunion-autour-dun-cafe-a-une-table-dans-un-bureau-moderne-pqiqRpE73Xs",
  "https://unsplash.com/fr/photos/une-personne-tenant-un-cerf-volant-colore-tvTFMDwH-cQ",
  "https://unsplash.com/fr/photos/homme-daffaires-noir-africain-pointant-et-regardant-un-grand-ecran-video-pour-une-presentation-lors-dune-conference-AEEL554dZqI",
  "https://unsplash.com/fr/photos/homme-a-laide-dun-ordinateur-portable-noir-kwzWjTnDPLk",
  "https://unsplash.com/fr/photos/un-homme-avec-une-barbe-portant-un-collier-de-perles-Z3zRUPN0YVQ",
  "https://unsplash.com/fr/photos/femme-portant-une-chemise-noire-debout-devant-un-mur-rouge-f6HbVnGtNnY",
  "https://unsplash.com/fr/photos/femme-debout-au-milieu-dun-champ-de-ble-GSh_PwsZsPQ",
  "https://unsplash.com/fr/photos/persons-right-fist-grayscale-photography-e-TuK4z2LhY",
  "https://unsplash.com/fr/photos/femme-portant-des-lunettes-de-soleil-avant-gardistes-a-monture-blanche-Wu3yqve2gnc",

  "https://unsplash.com/fr/photos/braided-woman-taking-photo-beside-yellow-painted-wall-QS9ZX5UnS14",
  "https://unsplash.com/fr/photos/femme-souriante-portant-un-turban-i2hoD-C2RUA",
  "https://unsplash.com/fr/photos/une-femme-vetue-dune-robe-et-dun-chapeau-verts-et-blancs-fBCptLC4GJY",
  "https://unsplash.com/fr/photos/femme-regardant-le-sol-tout-en-souriant-0cgpyigyIkM",
  "https://unsplash.com/fr/photos/baby-clinging-on-back-1YnBzhJISg4",
  "https://unsplash.com/fr/photos/une-mere-serre-son-enfant-contre-elle-9uKNyQxX04I",
  "https://unsplash.com/fr/photos/smiling-man-wearing-black-turtleneck-shirt-holding-camrea-4Yv84VgQkRM",
  "https://unsplash.com/fr/photos/photographie-de-portrait-de-femme-RcqKOjX0ZHE",
  "https://unsplash.com/fr/photos/femme-sur-haut-a-bretelles-spaghetti-marron-aU_eOcelLhQ",
  "https://unsplash.com/fr/photos/photo-de-deux-femmes-lH973Qz0Iy4",
  "https://unsplash.com/fr/photos/femme-aux-cheveux-blancs-et-portant-un-bandeau-blanc-1I3_xTAXTxo",
  "https://unsplash.com/fr/photos/homme-en-chemise-blanche-portant-des-lunettes-de-soleil-noires-ioRBT9swcK8",
  "https://unsplash.com/fr/photos/woman-wearing-blue-denim-jacket-with-flowers-on-hair-Mx4auh5zO4w",
  "https://unsplash.com/fr/photos/une-femme-en-robe-noire-avec-ses-mains-sur-les-hanches-VyFMlAecJpU",
  "https://unsplash.com/fr/photos/a-woman-with-an-afro-is-looking-at-the-camera-xmSWVeGEnJw",
  "https://unsplash.com/fr/photos/une-femme-en-robe-orange-tenant-un-telephone-portable-8-lNqEyAiY8"
];

const slugs = [
  'basile-kora','armand-tossou','lionel-agossou','aicha-hounkpatin',
  'romaric-hountondji','koffi-ahouansou','carine-adjovi','jonas-ahodehou',
  'senami-dossou','arnaud-zinsou','mireille-tognifode','ibrahim-lawani',
  'koffi-adjakpa','grace-houessou','steve-kpade','nadege-kiki'
];

async function fetchRealUnsplashUrls() {
  const resolved = [];
  console.log("Fetching real CDN URLs for 64 images...");

  for (let i = 0; i < urls.length; i++) {
    try {
      const res = await fetch(urls[i]);
      const html = await res.text();
      // Match meta property="og:image" content="https://images.unsplash.com/photo-XXX..."
      const match = html.match(/content="(https:\/\/(images|plus)\.unsplash\.com\/(photo|premium_photo)-[^"?]+)/);
      let realUrl = "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6"; // fallback
      if (match && match[1]) {
        realUrl = match[1];
      }
      resolved.push(realUrl + "?auto=format&fit=crop&w=1200&q=80");
      process.stdout.write(".");
    } catch (e) {
      console.log(`Failed for ${urls[i]}`);
      resolved.push("https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80");
    }
  }

  console.log("\nDone fetching. Generating SQL...");

  let sql = `BEGIN;\n\nUPDATE talents SET\n`;

  // photo_qui_je_suis
  sql += `  photo_qui_je_suis = CASE slug\n`;
  for(let i=0; i<16; i++) sql += `    WHEN '${slugs[i]}' THEN '${resolved[i]}'\n`;
  sql += `  END,\n\n`;

  // photo_histoire
  sql += `  photo_histoire = CASE slug\n`;
  for(let i=0; i<16; i++) sql += `    WHEN '${slugs[i]}' THEN '${resolved[16+i]}'\n`;
  sql += `  END,\n\n`;

  // photo_services
  sql += `  photo_services = CASE slug\n`;
  for(let i=0; i<16; i++) sql += `    WHEN '${slugs[i]}' THEN '${resolved[32+i]}'\n`;
  sql += `  END,\n\n`;

  // photo_pourquoi
  sql += `  photo_pourquoi = CASE slug\n`;
  for(let i=0; i<16; i++) sql += `    WHEN '${slugs[i]}' THEN '${resolved[48+i]}'\n`;
  sql += `  END\n\n`;

  sql += `WHERE slug IN (${slugs.map(s => `'${s}'`).join(',')});\n\nCOMMIT;\n`;

  fs.writeFileSync('dataset_media_talents_updated.sql', sql);
  console.log("SQL updated in dataset_media_talents_updated.sql");
}

fetchRealUnsplashUrls();
