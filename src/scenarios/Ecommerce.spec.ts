import { test, expect } from '@playwright/test'; 
import { ai } from '@zerostep/playwright';

test.describe.parallel('Testes funcionais no site da EBAC Shop', () => { 
    const BASE = 'http://lojaebac.ebaconline.art.br/#'; 

    test('Campo de busca exibe resultados ou mantém lista visível', async ({ page }) => {
        await page.goto(BASE); 
        const search = page.locator( 'input[type="search"], input[placeholder*="Buscar"]' ); 
        if ((await search.count()) === 0) { 
            console.warn('Campo de busca não encontrado — fallback validado.'); 
            expect(await page.locator('.product').count()).toBeGreaterThan(0); 
            return; 
        }
        await search.fill('Camisa'); 
        await search.press('Enter'); 
        const products = page.locator('.product'); 
        expect(await products.count()).toBeGreaterThan(0); 
    });

    test('Página inicial carrega corretamente', async ({ page }) => { 
        await page.goto(BASE); await expect(page).toHaveTitle(/EBAC/i); 
        await expect(page.locator('header')).toBeVisible(); 
        expect(await page.locator('.product').count()).toBeGreaterThan(0);
    }); 
     
    test('Navegação mobile - menu hamburguer', async ({ browserName, context, page }) => { 
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(BASE, { waitUntil: 'load' }); 

        const burger = page.locator( '.menu-hamburguer, .burger, [aria-label="menu"]' ); 

        if ((await burger.count()) > 0) { 
            await burger.first().click(); 
            await expect(page.locator('nav')).toBeVisible();
        } else { 
            const count = await page.locator('.product').count(); expect(count).toBeGreaterThan(0);
        } 
    });
          
    test('Verifica se rodapé é exibido', async ({ page }) => { 
        await page.goto(BASE); 
        await expect(page.locator('footer')).toBeVisible(); 
    });
    
    test('Validar menus de navegação estão presentes', async ({ page }) => { 
        await page.goto(BASE); const menuItems = page.locator('nav a'); 
        expect(await menuItems.count()).toBeGreaterThan(0); 
    });

    test('Validar produtos renderizados com imagem e preço', async ({ page }) => { 
        await page.goto(BASE); const products = page.locator('.product');

        expect(await products.count()).toBeGreaterThan(0); 
    
        await expect(products.locator('img').first()).toBeVisible();
        await expect(products.locator('.price').first()).toBeVisible(); 
    });
        
    test('Compra rápida usando ZeroStep', async ({ page }) => {
        await page.goto('http://lojaebac.ebaconline.art.br/#');
        await ai('Select the first product listed', { page, test });
        await ai('Click the add to cart button', { page, test });
        await ai('Open the cart page', { page, test });
        await ai('Verify that there is at least 1 item in the cart', { page, test });
      });
});
  