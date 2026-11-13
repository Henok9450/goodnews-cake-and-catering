import { resolveCakeDetails, resolveCakeTitle, UPLOADED_CAKE_CURATIONS } from '../utils/cakeGalleryCuration';

describe('Cake Gallery Artisanal Curation Suite', () => {
  test('CUR-001: Maps all 7 recently uploaded photos to bespoke artisanal names based on design & structure', () => {
    const samples = [
      {
        caption: 'abff6066-8207-4691-ae1a-5af3432d5c20.webp',
        expectedTitle: "Vertical Pleated Ruffle & Baby's Breath Birthday Cake",
        expectedCategory: 'Birthday Cakes'
      },
      {
        caption: '2c93b7da-b8bb-4704-948f-831f7eb87b34.webp',
        expectedTitle: 'Ethereal Feather Sail & Gold Leaf Celebration Cake',
        expectedCategory: 'Celebration Cakes'
      },
      {
        caption: 'watermarked_img_12927559622594782392.webp',
        expectedTitle: 'Cascading Wave & Spiraling Sail Two-Tier Wedding Cake',
        expectedCategory: 'Wedding Cakes'
      },
      {
        caption: '05f8a227-c893-48d7-9942-d26a2e3d9891.webp',
        expectedTitle: 'Pastel Blue Baby Shower Silhouette Cake',
        expectedCategory: 'Celebration Cakes'
      },
      {
        caption: 'cee9cdc3-b728-4688-ba97-fb7b8d6e4478.webp',
        expectedTitle: 'Dusty Mauve Rose Pleated Two-Tier Monogram Cake',
        expectedCategory: 'Wedding Cakes'
      },
      {
        caption: '5edda22e-2b01-40a9-b70f-846c350d3ef3.webp',
        expectedTitle: 'Gilded Spiral Candle & Pleated Ivory Birthday Cake',
        expectedCategory: 'Birthday Cakes'
      },
      {
        caption: '8555646f-e2b4-46f3-9a14-d7ad462877e4.webp',
        expectedTitle: 'Midnight Navy & Gilded Moroccan Two-Tier Cake',
        expectedCategory: 'Celebration Cakes'
      }
    ];

    samples.forEach(sample => {
      const details = resolveCakeDetails({ caption: sample.caption });
      expect(details.title).toBe(sample.expectedTitle);
      expect(details.category).toBe(sample.expectedCategory);
      expect(details.description).toBeTruthy();
      expect(details.ingredients.length).toBeGreaterThan(0);
      expect(details.size).toBeTruthy();
      expect(details.servings).toBeTruthy();
    });
  });

  test('CUR-002: Leaves existing curated custom captions untouched', () => {
    const existing = {
      caption: 'Romantic Proposal Silhouette Cake',
      category: 'Celebration Cakes'
    };
    const details = resolveCakeDetails(existing);
    expect(details.title).toBe('Romantic Proposal Silhouette Cake');
  });

  test('CUR-003: resolveCakeTitle returns clean display title', () => {
    expect(resolveCakeTitle('8555646f-e2b4-46f3-9a14-d7ad462877e4.webp')).toBe('Midnight Navy & Gilded Moroccan Two-Tier Cake');
  });
});
