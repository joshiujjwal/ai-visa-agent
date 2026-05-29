// prisma/seed.ts — Seed country requirements for top countries
// Run: npx prisma db seed  (or: tsx prisma/seed.ts)

import { PrismaClient, VisaType } from '@prisma/client';

const prisma = new PrismaClient();

const COUNTRIES: Array<{
  countryCode: string;
  visaType: VisaType;
  requiredDocs: Array<{ name: string; description: string; required: boolean }>;
  processingDays: number;
  feeUsd: number;
  embassyUrl: string;
  notes?: string;
}> = [
  {
    countryCode: 'US',
    visaType: 'tourist',
    requiredDocs: [
      { name: 'Valid Passport', description: 'Must be valid for at least 6 months beyond stay', required: true },
      { name: 'DS-160 Form', description: 'Online nonimmigrant visa application form', required: true },
      { name: 'Photo', description: '2x2 inches, white background, taken within 6 months', required: true },
      { name: 'Bank Statement', description: 'Last 3 months showing sufficient funds', required: true },
      { name: 'Travel Itinerary', description: 'Flight bookings and hotel reservations', required: false },
      { name: 'Employment Letter', description: 'Confirming employment and leave approval', required: false },
    ],
    processingDays: 60,
    feeUsd: 185,
    embassyUrl: 'https://travel.state.gov/content/travel/en/us-visas.html',
    notes: 'B-2 tourist visa. Interview required at US Embassy/Consulate.',
  },
  {
    countryCode: 'GB',
    visaType: 'tourist',
    requiredDocs: [
      { name: 'Valid Passport', description: 'Valid for duration of stay', required: true },
      { name: 'Online Application Form', description: 'UK Visas and Immigration online form', required: true },
      { name: 'Biometric Enrollment', description: 'Fingerprints and photo at visa application center', required: true },
      { name: 'Bank Statement', description: 'Last 6 months, demonstrating financial stability', required: true },
      { name: 'Accommodation Proof', description: 'Hotel bookings or invitation letter', required: true },
    ],
    processingDays: 21,
    feeUsd: 115,
    embassyUrl: 'https://www.gov.uk/standard-visitor-visa',
    notes: 'Standard Visitor Visa. No interview required typically.',
  },
  {
    countryCode: 'CA',
    visaType: 'tourist',
    requiredDocs: [
      { name: 'Valid Passport', description: 'Valid for duration of stay', required: true },
      { name: 'IMM 5257 Form', description: 'Application for Temporary Resident Visa', required: true },
      { name: 'Photo', description: '35mm x 45mm, white background', required: true },
      { name: 'Bank Statement', description: 'Proof of sufficient funds', required: true },
      { name: 'Travel History', description: 'Previous travel documents/visas', required: false },
    ],
    processingDays: 14,
    feeUsd: 100,
    embassyUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html',
  },
  {
    countryCode: 'AU',
    visaType: 'tourist',
    requiredDocs: [
      { name: 'Valid Passport', description: 'Valid for at least 6 months beyond intended stay', required: true },
      { name: 'Online Application', description: 'Apply online via ImmiAccount', required: true },
      { name: 'Health Insurance', description: 'Travel insurance with health coverage', required: false },
      { name: 'Bank Statement', description: 'Evidence of sufficient funds', required: true },
    ],
    processingDays: 21,
    feeUsd: 145,
    embassyUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600',
    notes: 'Visitor Visa (subclass 600). Mostly processed online.',
  },
  {
    countryCode: 'JP',
    visaType: 'tourist',
    requiredDocs: [
      { name: 'Valid Passport', description: 'Valid for at least 6 months', required: true },
      { name: 'Visa Application Form', description: 'Available at Japanese embassy', required: true },
      { name: 'Photo', description: '45mm x 45mm, white background', required: true },
      { name: 'Bank Statement', description: 'Last 3 months', required: true },
      { name: 'Itinerary', description: 'Day-by-day travel plan', required: true },
      { name: 'Hotel Reservations', description: 'Accommodation for entire stay', required: true },
    ],
    processingDays: 5,
    feeUsd: 30,
    embassyUrl: 'https://www.mofa.go.jp/j_info/visit/visa/index.html',
  },
  {
    countryCode: 'AE',
    visaType: 'tourist',
    requiredDocs: [
      { name: 'Valid Passport', description: 'Valid for at least 6 months', required: true },
      { name: 'Passport-size Photo', description: 'White background, recent', required: true },
      { name: 'Return Ticket', description: 'Confirmed return flight booking', required: true },
      { name: 'Hotel Reservation', description: 'Confirmed accommodation', required: true },
    ],
    processingDays: 3,
    feeUsd: 100,
    embassyUrl: 'https://www.gdrfad.gov.ae/en/services/visa-services',
    notes: 'Many nationalities get visa on arrival. Check eligibility list.',
  },
  {
    countryCode: 'SG',
    visaType: 'tourist',
    requiredDocs: [
      { name: 'Valid Passport', description: 'Valid for at least 6 months', required: true },
      { name: '14A Form', description: 'Application for a Singapore visa', required: true },
      { name: 'Photo', description: '35mm x 45mm, white background', required: true },
      { name: 'Bank Statement', description: 'Last 3 months', required: true },
      { name: 'Travel Itinerary', description: 'Flights and accommodation', required: true },
    ],
    processingDays: 3,
    feeUsd: 30,
    embassyUrl: 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa-requirements',
  },
];

async function main() {
  console.log('Seeding country requirements...');

  for (const country of COUNTRIES) {
    await prisma.countryRequirement.upsert({
      where: {
        countryCode_visaType: {
          countryCode: country.countryCode,
          visaType: country.visaType,
        },
      },
      update: {
        requiredDocs: country.requiredDocs,
        processingDays: country.processingDays,
        feeUsd: country.feeUsd,
        embassyUrl: country.embassyUrl,
        notes: country.notes ?? null,
        lastVerifiedAt: new Date(),
      },
      create: {
        countryCode: country.countryCode,
        visaType: country.visaType,
        requiredDocs: country.requiredDocs,
        processingDays: country.processingDays,
        feeUsd: country.feeUsd,
        embassyUrl: country.embassyUrl,
        notes: country.notes ?? null,
        lastVerifiedAt: new Date(),
      },
    });
    console.log(`  ✓ ${country.countryCode} ${country.visaType}`);
  }

  console.log(`Done. Seeded ${COUNTRIES.length} country requirements.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
