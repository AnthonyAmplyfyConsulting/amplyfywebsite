'use server';

import { Lead, LeadStatus } from './db';

export interface GooglePlacesResult {
    id: string;
    displayName: {
        text: string;
    };
    formattedAddress: string;
    nationalPhoneNumber?: string;
    internationalPhoneNumber?: string;
    websiteUri?: string;
    rating?: number;
    userRatingCount?: number;
    priceLevel?: string;
}

export interface FindLeadsParams {
    query: string; // e.g., "dental offices in Miami FL"
    maxResults?: number;
}

export interface FindLeadsResult {
    leads: Partial<Lead>[];
    totalFound: number;
    filtered: number;
}

/**
 * Find leads using Google Places API
 * Filters for businesses with phone numbers, websites, and SMB indicators
 */
export async function findLeads(params: FindLeadsParams): Promise<FindLeadsResult> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        throw new Error('Google Places API key not configured');
    }

    const { query, maxResults = 60 } = params;

    try {
        // Call Google Places API - Text Search (New)
        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.priceLevel'
            },
            body: JSON.stringify({
                textQuery: query,
                maxResultCount: maxResults,
                languageCode: 'en',
                rankPreference: 'RELEVANCE'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google Places API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const places: GooglePlacesResult[] = data.places || [];

        // Filter for SMBs with complete contact info
        const filteredLeads = places
            .filter(place => {
                // Must have phone number
                if (!place.nationalPhoneNumber && !place.internationalPhoneNumber) return false;

                // Must have website
                if (!place.websiteUri) return false;

                // SMB indicators: 50-500 reviews
                if (place.userRatingCount && (place.userRatingCount < 50 || place.userRatingCount > 500)) return false;

                // Rating 3.5+
                if (place.rating && place.rating < 3.5) return false;

                // Price level $$ or $$$ (if available)
                if (place.priceLevel && !['PRICE_LEVEL_MODERATE', 'PRICE_LEVEL_EXPENSIVE'].includes(place.priceLevel)) return false;

                return true;
            })
            .slice(0, 20) // Keep first 20 that pass filters
            .map(place => ({
                businessName: place.displayName.text,
                name: '', // To be filled in manually
                email: '', // Not available from Google Places
                phone: place.nationalPhoneNumber || place.internationalPhoneNumber || '',
                notes: `Rating: ${place.rating || 'N/A'} (${place.userRatingCount || 0} reviews)`,
                status: 'Cold' as LeadStatus,
                source: 'lead_finder' as const,
                placeId: place.id,
                website: place.websiteUri,
                address: place.formattedAddress,
                rating: place.rating,
                reviewCount: place.userRatingCount,
                priceLevel: convertPriceLevel(place.priceLevel)
            }));

        return {
            leads: filteredLeads,
            totalFound: places.length,
            filtered: filteredLeads.length
        };

    } catch (error) {
        console.error('Error finding leads:', error);
        throw error;
    }
}

function convertPriceLevel(level?: string): string {
    switch (level) {
        case 'PRICE_LEVEL_FREE': return '$';
        case 'PRICE_LEVEL_INEXPENSIVE': return '$';
        case 'PRICE_LEVEL_MODERATE': return '$$';
        case 'PRICE_LEVEL_EXPENSIVE': return '$$$';
        case 'PRICE_LEVEL_VERY_EXPENSIVE': return '$$$$';
        default: return '$$';
    }
}
