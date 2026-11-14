import { getProducts } from '../services/productService';
import { getServices } from '../services/serviceService';
import { INITIAL_PRODUCTS, INITIAL_SERVICES } from '../utils/seedData';

describe('Catalog & Image Completeness Suite', () => {
  test('INITIAL_PRODUCTS contains at least 9 cupcakes, 9 cookies, 10 seasonal, and 11 cakes', () => {
    const cupcakes = INITIAL_PRODUCTS.filter(p => p.category === 'cupcakes');
    const cookies = INITIAL_PRODUCTS.filter(p => p.category === 'cookies');
    const seasonal = INITIAL_PRODUCTS.filter(p => p.category === 'seasonal');
    const cakes = INITIAL_PRODUCTS.filter(p => p.category === 'cakes');

    expect(cupcakes.length).toBeGreaterThanOrEqual(9);
    expect(cookies.length).toBeGreaterThanOrEqual(9);
    expect(seasonal.length).toBeGreaterThanOrEqual(10);
    expect(cakes.length).toBeGreaterThanOrEqual(11);
  });

  test('INITIAL_SERVICES contains all 9 catering packages', () => {
    expect(INITIAL_SERVICES.length).toBeGreaterThanOrEqual(9);
  });

  test('every item in INITIAL_PRODUCTS has a valid image path', () => {
    INITIAL_PRODUCTS.forEach(item => {
      expect(item.featuredImage).toBeTruthy();
      expect(typeof item.featuredImage).toBe('string');
      expect(item.featuredImage.startsWith('/images/')).toBe(true);
    });
  });

  test('every item in INITIAL_SERVICES has a valid coverImage path', () => {
    INITIAL_SERVICES.forEach(item => {
      expect(item.coverImage).toBeTruthy();
      expect(typeof item.coverImage).toBe('string');
      expect(item.coverImage.startsWith('/images/')).toBe(true);
    });
  });

  test('getProducts ensures complete catalog across categories even with partial data', async () => {
    const cupcakes = await getProducts({ category: 'cupcakes' });
    const cookies = await getProducts({ category: 'cookies' });
    const seasonal = await getProducts({ category: 'seasonal' });

    expect(cupcakes.length).toBeGreaterThanOrEqual(9);
    expect(cookies.length).toBeGreaterThanOrEqual(9);
    expect(seasonal.length).toBeGreaterThanOrEqual(10);
  });

  test('getServices returns all catering packages', async () => {
    const services = await getServices();
    expect(services.length).toBeGreaterThanOrEqual(9);
  });
});
