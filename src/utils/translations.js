// src/utils/translations.js

export const userTypeTranslations = {
    'CITIZEN': 'Građanin',
    'COMPANY': 'Tvrtka'
};

export const roleTranslations = {
    'USER': 'Korisnik',
    'ADMIN': 'Administrator'
};

export const statusTranslations = {
    'CREATED': 'Kreiran',
    'SCHEDULED': 'Planiran odvoz',
    'COMPLETED': 'Završen',
    'CANCELLED': 'Otkazan'
};

export const unitTranslations = {
    'KG': 'Kilogram (kg)',
    'T': 'Tona (t)',
    'M3': 'Kubični metar (m³)'
};

// Pomoćna funkcija koja sprječava greške ako dođe neki nepoznati status
export const translate = (dictionary, key) => {
    return dictionary[key] || key; 
};