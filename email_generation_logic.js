// Email Generation Logic for Talents
// This explains how the email addresses are generated

function generateEmail(prenom, nom) {
  // Step 1: Remove accents (NFD normalization)
  // This converts accented characters to their base form + combining diacritics
  // Example: "Aïcha" → "Aïcha", "Grâce" → "Gracė"
  
  // Step 2: Remove combining diacritics [\u0300-\u036f]
  // This removes the accent marks, leaving only the base letters
  // Example: "Aïcha" → "Aicha", "Gracė" → "Grace"
  
  // Step 3: Convert to lowercase
  // Example: "Aicha" → "aicha", "Grace" → "grace"
  
  // Step 4: Remove non-alphabetic characters [^a-z]
  // This removes any remaining special characters, spaces, etc.
  // Example: "aicha" → "aicha", "grace" → "grace"
  
  const cleanPrenom = prenom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  
  const cleanNom = nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  
  // Step 5: Concatenate and add domain
  return `${cleanPrenom}${cleanNom}@beninease.com`;
}

// Examples:
console.log(generateEmail("Aïcha", "Hounkpatin")); // aichahounkpatin@beninease.com
console.log(generateEmail("Grâce", "Houessou"));  // gracehouessou@beninease.com
console.log(generateEmail("Jonas", "Ahodéhou")); // jonasahodehou@beninease.com
console.log(generateEmail("Mireille", "Tognifodé")); // mireilletognifode@beninease.com

// Character transformation examples:
// "Aïcha" → "Aicha" (ï → i)
// "Grâce" → "Grace" (à → a)
// "Houessou" → "Houessou" (no accents)
// "Ahodéhou" → "Ahodehou" (é → e)
// "Tognifodé" → "Tognifode" (é → e)
