// Fuente única de datos del negocio (NAP: Name, Address, Phone).
// Mantener sincronizado con Footer y Contacto: Google cruza estos datos.

export const SITE_URL = "https://www.limpik.cl";

export const business = {
    name: "Limpik",
    legalName: "Servicios de Limpieza SpA",
    rut: "77.894.636-K",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    defaultImage: "/og/limpik-default.jpg",
    telephone: "+56984749397",
    email: "clientes@limpik.cl",
    privacyEmail: "rsanchez@limpik.cl",
    complaintsEmail: "rrhh@limpik.cl",
    recruitmentEmail: "rrhh@limpik.cl",
    foundingDate: "2008",
    description:
        "Empresa chilena con más de 18 años de experiencia en servicios integrales de limpieza para empresas, oficinas y edificios corporativos y residenciales en Santiago, Viña del Mar, Valparaíso y Concón.",
    areaServed: ["Santiago", "Viña del Mar", "Valparaíso", "Concón"],
    openingHours: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
    },
    locations: [
        {
            id: "santiago",
            name: "Limpik Santiago",
            streetAddress: "Las Hualtatas 9466",
            addressLocality: "Vitacura",
            addressRegion: "Región Metropolitana",
            postalCode: "7650191",
            latitude: -33.3844658,
            longitude: -70.5430608,
        },
        {
            id: "valparaiso",
            name: "Limpik Valparaíso",
            streetAddress: "Esmeralda 940, Of. 94",
            addressLocality: "Valparaíso",
            addressRegion: "Región de Valparaíso",
            postalCode: "2217315",
            latitude: -33.04103,
            longitude: -71.6259425,
        },
    ],
} as const;

// Versión vigente de la Política de Privacidad: se registra junto a cada consentimiento
export const PRIVACY_POLICY_VERSION = "2026-09-23";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const areaServed = business.areaServed.map((name) => ({
    "@type": "City",
    name,
}));

export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: business.name,
    legalName: business.legalName,
    taxID: business.rut,
    url: business.url,
    logo: business.logo,
    image: `${SITE_URL}${business.defaultImage}`,
    description: business.description,
    foundingDate: business.foundingDate,
    email: business.email,
    telephone: business.telephone,
    areaServed,
    contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: business.telephone,
        email: business.email,
        areaServed: "CL",
        availableLanguage: "es",
    },
};

export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: business.name,
    url: business.url,
    inLanguage: "es-CL",
    publisher: { "@id": ORG_ID },
};

export const localBusinessSchemas = business.locations.map((loc) => ({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#${loc.id}`,
    name: loc.name,
    url: business.url,
    image: `${SITE_URL}${business.defaultImage}`,
    logo: business.logo,
    telephone: business.telephone,
    email: business.email,
    parentOrganization: { "@id": ORG_ID },
    address: {
        "@type": "PostalAddress",
        streetAddress: loc.streetAddress,
        addressLocality: loc.addressLocality,
        addressRegion: loc.addressRegion,
        postalCode: loc.postalCode,
        addressCountry: "CL",
    },
    geo: {
        "@type": "GeoCoordinates",
        latitude: loc.latitude,
        longitude: loc.longitude,
    },
    openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: business.openingHours.days,
        opens: business.openingHours.opens,
        closes: business.openingHours.closes,
    },
    areaServed,
}));

export function serviceSchema(opts: {
    name: string;
    description: string;
    path: string;
    serviceType: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}${opts.path}#service`,
        name: opts.name,
        description: opts.description,
        url: `${SITE_URL}${opts.path}`,
        serviceType: opts.serviceType,
        provider: { "@id": ORG_ID },
        areaServed,
    };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${SITE_URL}${item.path}`,
        })),
    };
}
